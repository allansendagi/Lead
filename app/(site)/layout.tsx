import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />
      <main style={{ paddingTop: 64, flex: 1 }}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
