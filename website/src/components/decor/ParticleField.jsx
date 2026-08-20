import { useEffect, useRef } from 'react'

const LINK_DISTANCE_DESKTOP = 165
const LINK_DISTANCE_MOBILE = 130
const DRIFT_RADIUS = 30
const SPEED = 0.14
const ANGLE_INTERVAL_MS = 3000
const MOBILE_MAX_WIDTH = 767

function particleCountForWidth(width) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  if (width <= MOBILE_MAX_WIDTH) return 48
  // Retina Macs paint 2–3× pixels; keep the constellation light.
  if (dpr >= 2) return 95
  return 120
}

function linkDistanceForWidth(width) {
  return width <= MOBILE_MAX_WIDTH ? LINK_DISTANCE_MOBILE : LINK_DISTANCE_DESKTOP
}

function randomVelocity() {
  const angle = Math.random() * Math.PI * 2
  return {
    vx: Math.cos(angle) * SPEED,
    vy: Math.sin(angle) * SPEED,
  }
}

function createParticles(count, width, height) {
  return Array.from({ length: count }, () => {
    const anchorX = Math.random() * width
    const anchorY = Math.random() * height
    const { vx, vy } = randomVelocity()
    return {
      anchorX,
      anchorY,
      x: anchorX,
      y: anchorY,
      vx,
      vy,
      radius: 1 + Math.random() * 1.5,
      opacity: 0.35 + Math.random() * 0.35,
    }
  })
}

function assignNewAngles(particles) {
  for (const p of particles) {
    const { vx, vy } = randomVelocity()
    p.vx = vx
    p.vy = vy
  }
}

/**
 * Constellation network: each dot stays near a fixed anchor (cluster stays in place).
 * Every 3s all dots get a new movement angle; they drift briefly then bounce at the radius edge.
 */
export function ParticleField({ isDark = false }) {
  const canvasRef = useRef(null)
  const frameRef = useRef(0)
  const particlesRef = useRef([])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= MOBILE_MAX_WIDTH) {
      return undefined
    }

    const canvas = canvasRef.current
    if (!canvas) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const parent = canvas.parentElement
    if (!parent) return undefined

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let width = 0
    let height = 0
    let linkDistance = LINK_DISTANCE_DESKTOP
    let linkDistanceSq = linkDistance * linkDistance

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      width = Math.max(rect.width, 1)
      height = Math.max(rect.height, 1)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      linkDistance = linkDistanceForWidth(width)
      linkDistanceSq = linkDistance * linkDistance
      particlesRef.current = createParticles(
        particleCountForWidth(width),
        width,
        height,
      )
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(parent)

    const angleInterval = setInterval(() => {
      assignNewAngles(particlesRef.current)
    }, ANGLE_INTERVAL_MS)

    const linkAlpha = isDark ? 0.22 : 0.34
    const maxRadiusSq = DRIFT_RADIUS * DRIFT_RADIUS

    const tick = () => {
      const particles = particlesRef.current

      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        const dx = p.x - p.anchorX
        const dy = p.y - p.anchorY
        const distSq = dx * dx + dy * dy

        if (distSq > maxRadiusSq) {
          const dist = Math.sqrt(distSq)
          const nx = dx / dist
          const ny = dy / dist
          p.x = p.anchorX + nx * DRIFT_RADIUS
          p.y = p.anchorY + ny * DRIFT_RADIUS
          const dot = p.vx * nx + p.vy * ny
          p.vx -= 2 * dot * nx
          p.vy -= 2 * dot * ny
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distSq = dx * dx + dy * dy
          if (distSq < linkDistanceSq) {
            const dist = Math.sqrt(distSq)
            const alpha = linkAlpha * (1 - dist / linkDistance)
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      frameRef.current = requestAnimationFrame(tick)
    }

    tick()

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameRef.current)
      } else {
        tick()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(frameRef.current)
      clearInterval(angleInterval)
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [isDark])

  if (typeof window !== 'undefined' && window.innerWidth <= MOBILE_MAX_WIDTH) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[2] h-full w-full"
      aria-hidden
    />
  )
}
