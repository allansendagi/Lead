import Link from 'next/link'

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
          <Link href="/" style={footerLink}>Take the Assessment</Link>
          <Link href="/resources" style={footerLink}>Resources</Link>
          <Link href="/industries" style={footerLink}>Industries</Link>
          <Link href="/about" style={footerLink}>About</Link>
          <Link href="/work-with-us" style={footerLink}>Work With Me</Link>
        </nav>
        <p style={{fontSize:13,color:'#9ca3af',margin:0}}>
          © {new Date().getFullYear()} SafeHaven AI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

const footerLink: React.CSSProperties = {
  fontSize:13,color:'#6b7280',textDecoration:'none',
}
