// Deliberately no Navigation/Footer here — this route group renders standalone
// pages with their own full-page design (e.g. /workshop). The site-wide
// Navigation and Footer components still live in components/ and are used by
// the (site) route group — swap this page back into (site) to bring them back.

export default function WorkshopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
