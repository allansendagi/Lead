// GA4 helper. gtag is only loaded in production, and loads after hydration, so
// wait for it briefly instead of dropping an event fired on first render.
export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const w = window as any
  if (w.gtag) {
    w.gtag('event', event, params)
    return
  }
  let tries = 0
  const timer = setInterval(() => {
    if (w.gtag) {
      clearInterval(timer)
      w.gtag('event', event, params)
    } else if (++tries > 50) {
      clearInterval(timer)
    }
  }, 200)
}
