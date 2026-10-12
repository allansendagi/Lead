// The circular credential seal. Colours come from the page's CSS tokens unless fixed ones are passed
// (the share image renders outside the page, so it passes literal colours).
export default function Seal({ year, idSuffix, className, blue = 'var(--blue)', ink = 'var(--ink)' }:
  { year: string; idSuffix: string; className?: string; blue?: string; ink?: string }) {
  const ring = 'MAKE AI WORK · VERIFIABLE CREDENTIAL · AI VALUE SANDBOX · '
  const pathId = `seal-path-${idSuffix}`
  return (
    <svg className={className} viewBox="0 0 120 120" role="img" aria-label="AI Value Sandbox seal">
      <defs>
        <path id={pathId} d="M60,60 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0" />
      </defs>
      <g fill="none" stroke={blue}>
        <circle cx="60" cy="60" r="56" strokeWidth=".9" />
        <circle cx="60" cy="60" r="33" strokeWidth=".7" />
        <g strokeWidth=".55">
          {Array.from({ length: 60 }, (_, i) => (
            <line key={i} x1="60" y1="7" x2="60" y2={i % 5 ? 10 : 12.5} transform={`rotate(${i * 6} 60 60)`} />
          ))}
        </g>
      </g>
      <text fontSize="6.5" fontWeight={600} letterSpacing=".72" fill={blue} style={{ fontFamily: 'var(--cr-body), sans-serif' }}>
        <textPath href={`#${pathId}`}>{ring}</textPath>
      </text>
      <text x="60" y="57" textAnchor="middle" fontSize="9.5" fill={ink} style={{ fontFamily: 'var(--cr-display), serif', fontStyle: 'italic' }}>Specified</text>
      <text x="60" y="70" textAnchor="middle" fontSize="7.6" fontWeight={600} letterSpacing="1.2" fill={ink} style={{ fontFamily: 'var(--cr-body), sans-serif' }}>{year}</text>
    </svg>
  )
}
