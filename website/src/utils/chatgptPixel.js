/**
 * OpenAI / ChatGPT Ads pixel (oaiq).
 * Pixel ID and lead event from campaign setup.
 */
export const CHATGPT_PIXEL_ID = 'MQbGnApBZQwsL397o6417f'
export const CHATGPT_LEAD_EVENT = 'lead_created'

const SCRIPT_ATTR = 'data-mafateeh-oaiq'
const SCRIPT_SRC = 'https://bzrcdn.openai.com/sdk/oaiq.min.js'

/**
 * Queue stub used before the SDK loads (same pattern as their snippet).
 * @returns {(...args: unknown[]) => void}
 */
function ensureOaiqStub() {
  if (typeof window.oaiq === 'function') return window.oaiq
  const q = /** @type {((...args: unknown[]) => void) & { q: unknown[] }} */ (
    function oaiq() {
      // eslint-disable-next-line prefer-rest-params
      q.q.push(arguments)
    }
  )
  q.q = []
  window.oaiq = q
  return q
}

/** Load + init the ChatGPT pixel once (respect cookie consent via caller). */
export function initChatGptPixel() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  if (document.querySelector(`script[${SCRIPT_ATTR}]`)) return

  const oaiq = ensureOaiqStub()
  oaiq('init', {
    pixelId: CHATGPT_PIXEL_ID,
    debug: Boolean(import.meta.env.DEV),
  })

  const script = document.createElement('script')
  script.async = true
  script.src = SCRIPT_SRC
  script.setAttribute(SCRIPT_ATTR, CHATGPT_PIXEL_ID)
  const first = document.getElementsByTagName('script')[0]
  first?.parentNode?.insertBefore(script, first)
}

/** Contact form conversion: lead_created / customer_action. */
export function trackChatGptLeadCreated() {
  if (typeof window === 'undefined') return
  const oaiq = window.oaiq
  if (typeof oaiq !== 'function') return
  oaiq('measure', CHATGPT_LEAD_EVENT, { type: 'customer_action' })
}
