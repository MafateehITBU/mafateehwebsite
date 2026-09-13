#!/usr/bin/env node
/**
 * Internal hook: regenerate route HTML shells on demand (blog publish/update/delete).
 * Listens only inside the Docker network — not exposed via reverse-proxy.
 */
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'

const PORT = Number(process.env.ROUTE_SHELL_HOOK_PORT || 9090)
const SECRET = String(process.env.ROUTE_SHELL_HOOK_SECRET || '').trim()

let running = false
let queued = false

function runGenerate() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['/app/scripts/generate-route-html.mjs'], {
      env: process.env,
      stdio: ['ignore', 'inherit', 'inherit'],
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`generate-route-html exited ${code}`))
    })
  })
}

async function regenerate() {
  if (running) {
    queued = true
    return
  }
  running = true
  try {
    do {
      queued = false
      console.log('[route-shell-hook] Regenerating route HTML shells…')
      await runGenerate()
      console.log('[route-shell-hook] Done.')
    } while (queued)
  } finally {
    running = false
  }
}

function authorized(req) {
  if (!SECRET) return true
  const header = String(req.headers['x-route-shell-secret'] || '')
  return header === SECRET
}

const server = createServer((req, res) => {
  const url = req.url?.split('?')[0] || '/'

  if (req.method === 'GET' && url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, running }))
    return
  }

  if (req.method === 'POST' && url === '/regenerate') {
    if (!authorized(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: 'unauthorized' }))
      return
    }
    // Fire-and-forget so admin API does not wait on HTML generation
    void regenerate().catch((err) => {
      console.error('[route-shell-hook] regenerate failed:', err)
    })
    res.writeHead(202, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, accepted: true }))
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ ok: false, error: 'not_found' }))
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[route-shell-hook] Listening on :${PORT}`)
})
