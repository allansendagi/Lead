const CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const ENV = process.env.PAYPAL_ENV === 'sandbox' ? 'sandbox' : 'live'

export const PAYPAL_API_BASE = ENV === 'sandbox'
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com'

export function paypalConfigured() {
  return Boolean(CLIENT_ID && CLIENT_SECRET)
}

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getPaypalAccessToken(): Promise<string> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('PayPal is not configured (missing PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET)')
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token
  }

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(`PayPal OAuth failed: HTTP ${res.status}: ${JSON.stringify(data)}`)
  }

  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return cachedToken.token
}
