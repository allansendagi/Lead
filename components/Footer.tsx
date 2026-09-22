import Link from 'next/link'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '97450176561'
const TEAM_TRAINING_WA = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Allan, we're interested in team training using the AI Value Sandbox workshop")}`

export default function Footer() {
  return (
    <footer style={{
      borderTop:'1px solid #e5e7eb',
      background:'#f9fafb',
      padding:'32px 24px',
      marginTop:'auto',
    }}>
      <div style={{
        maxWidth:1200,margin:'0 auto',
        display:'flex',flexWrap:'wrap',gap:24,
        alignItems:'center',justifyContent:'space-between',
      }}>
        <Link href="/" style={{fontWeight:700,fontSize:14,color:'#1a1a1a',textDecoration:'none'}}>
          AI Navigator
        </Link>
        <nav style={{display:'flex',flexWrap:'wrap',gap:20,alignItems:'center'}}>
          <Link href="/assessment" style={footerLink}>Take the Assessment</Link>
          <Link href="/resources" style={footerLink}>Resources</Link>
          <Link href="/industries" style={footerLink}>Industries</Link>
          <Link href="/book" style={footerLink}>Book</Link>
          <Link href="/work-with-us" style={footerLink}>Work With Me</Link>
          <a href={TEAM_TRAINING_WA} target="_blank" rel="noopener noreferrer" style={footerLink}>Training for Teams</a>
          <Link href="/terms" style={footerLink}>Terms</Link>
          <Link href="/privacy" style={footerLink}>Privacy</Link>
        </nav>
        <div style={{textAlign:'right'}}>
          <p style={{fontSize:13,color:'#9ca3af',margin:0}}>
            © {new Date().getFullYear()} SafeHaven LLC. All rights reserved.
          </p>
          <p style={{fontSize:11,color:'#c1c5cb',margin:'2px 0 0'}}>
            QFC Number 03084 &middot; Qatar Financial Centre, Doha, Qatar
          </p>
        </div>
      </div>
    </footer>
  )
}

const footerLink: React.CSSProperties = {
  fontSize:13,color:'#6b7280',textDecoration:'none',
}
