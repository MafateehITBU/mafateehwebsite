/**
 * @param {unknown} error
 * @returns {string}
 */
export function getApiErrorMessage(error) {
  if (error && typeof error === 'object' && 'response' in error) {
    const data = /** @type {{ response?: { data?: { message?: unknown } } }} */ (
      error
    ).response?.data
    if (data && typeof data === 'object' && 'message' in data) {
      const msg = data.message
      if (typeof msg === 'string') return msg
    }
  }
  if (error instanceof Error && error.message) return error.message
  return 'Something went wrong'
}
