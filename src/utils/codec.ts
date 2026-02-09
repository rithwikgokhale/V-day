export type EncodedPayload = {
  v: 1
  her: string
  picks: string[]
  labels: string[]
  ts: number
}

function toBase64Url(input: string): string {
  return window
    .btoa(unescape(encodeURIComponent(input)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function fromBase64Url(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return decodeURIComponent(escape(window.atob(padded)))
}

export function buildCode(payload: EncodedPayload): string {
  return `V1-${toBase64Url(JSON.stringify(payload))}`
}

// Developer decode helper:
// In browser console, run decodeCode("V1-...") to inspect payload.
export function decodeCode(code: string): EncodedPayload | null {
  if (!code.startsWith('V1-')) {
    return null
  }

  try {
    const json = fromBase64Url(code.slice(3))
    return JSON.parse(json) as EncodedPayload
  } catch {
    return null
  }
}
