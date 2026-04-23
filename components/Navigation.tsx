'use client'
import Link from 'next/link'
import { useState } from 'react'

const industries = [
  'Retail','Luxury & Jewellery','Logistics','Real Estate','Legal Services',
  'Healthcare','Financial Services','Hospitality','Restaurants','Construction',
  'Education','HR & Recruitment','Trading Companies','Marketing Agencies','Professional Services',
]
const slugMap: Record<string, string> = {
  'Retail':'retail','Luxury & Jewellery':'luxury-jewellery','Logistics':'logistics',
  'Real Estate':'real-estate','Legal Services':'legal-services','Healthcare':'healthcare',
  'Financial Services':'financial-services','Hospitality':'hospitality',
  'Restaurants':'restaurants','Construction':'construction','Education':'education',
  'HR & Recruitment':'hr-recruitment','Trading Companies':'trading-companies',
  'Marketing Agencies':'marketing-agencies','Professional Services':'professional-services',
}

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [industriesOpen, setIndustriesOpen] = useState(false)

  return (
    <>
      <header style={{
        position:'fixed',top:0,left:0,right:0,zIndex:9000,height:64,
        background:'rgba(255,255,255,0.97)',
        borderBottom:'1px solid #e5e7eb',
        backdropFilter:'blur(12px)',
        WebkitBackdropFilter:'blur(12px)',
      }}>
        <div style={{
          display:'flex',alignItems:'center',justifyContent:'space-between',
          height:'100%',padding:'0 24px',maxWidth:1200,margin:'0 auto',
        }}>
          {/* Logo */}
          <Link href="/" style={{fontWeight:700,fontSize:15,color:'#1a1a1a',textDecoration:'none',letterSpacing:'0.02em'}}>
            AI Navigator
          </Link>

          {/* Desktop nav */}
          <nav style={{display:'flex',alignItems:'center',gap:4}} aria-label="Main navigation">
            {/* Resources dropdown */}
            <div style={{position:'relative'}}
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}>
              <button style={navBtnStyle}>Resources ▾</button>
              {resourcesOpen && (
                <div style={dropdownStyle}>
                  <div style={ddGroup}>Getting Started</div>
                  <Link href="/resources/how-to-implement-ai-in-business-qatar" style={ddLink}>How to Implement AI in Qatar</Link>
                  <Link href="/resources/is-my-business-ready-for-ai" style={ddLink}>Is My Business Ready for AI?</Link>
                  <Link href="/resources/ai-implementation-plan-sme" style={ddLink}>What Is an AI Implementation Plan?</Link>
                  <div style={{...ddGroup,marginTop:10}}>The Framework</div>
                  <Link href="/resources/ai-navigator-framework" style={ddLink}>The AI Navigator Framework</Link>
                  <Link href="/resources/ai-strategy-vs-ai-implementation" style={ddLink}>AI Strategy vs Implementation</Link>
                  <Link href="/resources/how-long-does-ai-implementation-take" style={ddLink}>How Long Does It Take?</Link>
                  <div style={{...ddGroup,marginTop:10}}>For Your Business</div>
                  <Link href="/resources/ai-consulting-cost-qatar" style={ddLink}>AI Consulting Cost in Qatar</Link>
                  <Link href="/resources/how-to-choose-an-ai-consultant-qatar" style={ddLink}>How to Choose an AI Consultant</Link>
                  <Link href="/resources/will-ai-replace-my-employees" style={ddLink}>Will AI Replace My Employees?</Link>
                  <Link href="/resources/data-protection-ai-qatar-pdppl" style={ddLink}>Data Protection &amp; PDPPL</Link>
                </div>
              )}
            </div>

            {/* Industries dropdown */}
            <div style={{position:'relative'}}
              onMouseEnter={() => setIndustriesOpen(true)}
              onMouseLeave={() => setIndustriesOpen(false)}>
              <button style={navBtnStyle}>Industries ▾</button>
              {industriesOpen && (
                <div style={{...dropdownStyle,columns:2,columnGap:0,width:380}}>
                  {industries.map(ind => (
                    <Link key={ind}
                      href={`/industries/${slugMap[ind]}/doha`}
                      style={{...ddLink,display:'block'}}>
                      {ind}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" style={navLinkStyle}>About</Link>
            <Link href="/work-with-us" style={navLinkStyle}>Work With Me</Link>
          </nav>

          {/* CTA + hamburger */}
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <Link href="/" style={{
              background:'#1C1714',color:'#fff',padding:'9px 18px',
              borderRadius:8,fontSize:13,fontWeight:600,textDecoration:'none',
              whiteSpace:'nowrap',
            }} className="hide-mobile">
              Take the Assessment →
            </Link>
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(p => !p)}
              style={{background:'none',border:'none',cursor:'pointer',padding:4,color:'#1a1a1a',display:'none'}}
              className="show-mobile">
              {mobileOpen
                ? <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                : <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              }
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position:'fixed',top:64,left:0,right:0,zIndex:8999,
          background:'#fff',borderBottom:'1px solid #e5e7eb',
          padding:'16px 24px 24px',display:'flex',flexDirection:'column',gap:4,
        }}>
          <MobileGroup label="Getting Started">
            <MobileLink href="/resources/how-to-implement-ai-in-business-qatar" onClick={() => setMobileOpen(false)}>How to Implement AI in Qatar</MobileLink>
            <MobileLink href="/resources/is-my-business-ready-for-ai" onClick={() => setMobileOpen(false)}>Is My Business Ready?</MobileLink>
            <MobileLink href="/resources/ai-navigator-framework" onClick={() => setMobileOpen(false)}>The AI Navigator Framework</MobileLink>
          </MobileGroup>
          <MobileGroup label="Industries">
            {industries.slice(0,6).map(ind => (
              <MobileLink key={ind} href={`/industries/${slugMap[ind]}/doha`} onClick={() => setMobileOpen(false)}>{ind}</MobileLink>
            ))}
            <MobileLink href="/industries" onClick={() => setMobileOpen(false)}>View all industries →</MobileLink>
          </MobileGroup>
          <MobileLink href="/about" onClick={() => setMobileOpen(false)}>About</MobileLink>
          <MobileLink href="/work-with-us" onClick={() => setMobileOpen(false)}>Work With Me</MobileLink>
          <Link href="/" onClick={() => setMobileOpen(false)}
            style={{background:'#1C1714',color:'#fff',padding:'13px 20px',borderRadius:8,fontSize:15,fontWeight:600,textDecoration:'none',textAlign:'center',marginTop:8}}>
            Take the free AI Readiness Assessment →
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: block !important; }
          nav[aria-label="Main navigation"] { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}

function MobileGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{marginBottom:8}}>
      <div style={{fontSize:11,fontWeight:700,color:'#9ca3af',letterSpacing:'0.08em',textTransform:'uppercase',padding:'8px 0 4px'}}>{label}</div>
      {children}
    </div>
  )
}

function MobileLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick}
      style={{display:'block',padding:'9px 0',fontSize:15,color:'#374151',textDecoration:'none',borderBottom:'1px solid #f3f4f6'}}>
      {children}
    </Link>
  )
}

const navBtnStyle: React.CSSProperties = {
  background:'none',border:'none',cursor:'pointer',
  padding:'8px 12px',fontSize:14,color:'#374151',fontWeight:500,
  borderRadius:6,transition:'background 150ms',
}
const navLinkStyle: React.CSSProperties = {
  padding:'8px 12px',fontSize:14,color:'#374151',fontWeight:500,
  textDecoration:'none',borderRadius:6,
}
const dropdownStyle: React.CSSProperties = {
  position:'absolute',top:'100%',left:0,
  background:'#fff',border:'1px solid #e5e7eb',
  borderRadius:10,padding:'12px 8px',
  minWidth:280,boxShadow:'0 8px 32px rgba(0,0,0,0.12)',
  zIndex:100,
}
const ddGroup: React.CSSProperties = {
  fontSize:11,fontWeight:700,color:'#9ca3af',
  letterSpacing:'0.08em',textTransform:'uppercase',
  padding:'4px 10px 6px',
}
const ddLink: React.CSSProperties = {
  display:'block',padding:'7px 10px',fontSize:14,
  color:'#374151',textDecoration:'none',borderRadius:6,
}
