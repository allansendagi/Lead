import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { credentials, getCredential, ISSUER } from '@/lib/credentials'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Make AI Work credential'

export function generateStaticParams() {
  return credentials.map(c => ({ id: c.id }))
}

const font = (f: string) => readFile(path.join(process.cwd(), 'assets/fonts', f))

// Keep the share image to whole words: long tasks get a smaller size, then a clean cut with an ellipsis.
function taskLine(task: string) {
  const full = `built an AI Task Specification for ${task.charAt(0).toLowerCase()}${task.slice(1)}`
  if (full.length <= 120) return { text: full, size: 40 }
  if (full.length <= 175) return { text: full, size: 34 }
  const cut = full.slice(0, 172)
  return { text: `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '')}…`, size: 34 }
}

const PAPER = '#F7F8F5', INK = '#14213D', SUB = '#4E586E', BLUE = '#2B5BA6', GRID = '#E4E9F1'

function seal(year: string) {
  const ticks = Array.from({ length: 60 }, (_, i) =>
    `<line x1="60" y1="7" x2="60" y2="${i % 5 ? 10 : 12.5}" transform="rotate(${i * 6} 60 60)"/>`).join('')
  // Satori cannot lay text on a path, so the share image uses the seal's rings and centre only.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="200" height="200">
    <g fill="none" stroke="${BLUE}"><circle cx="60" cy="60" r="56" stroke-width=".9"/><circle cx="60" cy="60" r="45" stroke-width=".5"/><circle cx="60" cy="60" r="33" stroke-width=".7"/><g stroke-width=".55">${ticks}</g></g></svg>`
  return { src: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`, year }
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const c = getCredential(id)
  const [light, italic, body, bodyBold] = await Promise.all([
    font('spectral-latin-300-normal.woff'), font('spectral-latin-400-italic.woff'),
    font('hanken-grotesk-latin-400-normal.woff'), font('hanken-grotesk-latin-600-normal.woff'),
  ])
  const revoked = !c || c.status === 'revoked'
  const s = seal(c?.date.slice(0, 4) ?? '2026')

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: PAPER, color: INK,
        padding: '72px 80px 64px', fontFamily: 'Hanken',
        backgroundImage: `linear-gradient(${GRID} 1px, transparent 1px), linear-gradient(90deg, ${GRID} 1px, transparent 1px)`,
        backgroundSize: '26px 26px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}><div style={{ display: 'flex', fontSize: 26, fontWeight: 600 }}>{ISSUER} · Make AI Work</div><div style={{ display: 'flex', fontSize: 20, color: SUB, marginTop: 4 }}>operated by SafeHaven LLC</div></div>
          <div style={{ display: 'flex', position: 'relative', width: 200, height: 200, marginTop: -30, marginRight: -10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} width={200} height={200} alt="" />
            <div style={{ position: 'absolute', top: 0, left: 0, width: 200, height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: 'SpectralItalic', fontSize: 17 }}>Specified</div>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2 }}>{s.year}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', fontFamily: 'SpectralLight', fontSize: 84, lineHeight: 1, marginTop: -40 }}>
          {revoked ? 'Credential revoked' : c!.name}
        </div>
        {!revoked && (
          <div style={{ display: 'flex', fontFamily: 'SpectralItalic', fontSize: taskLine(c!.task).size, lineHeight: 1.3, marginTop: 28, maxWidth: 940 }}>
            {taskLine(c!.task).text}
          </div>
        )}
        <div style={{ display: 'flex', marginTop: 'auto', justifyContent: 'space-between', borderTop: `3px solid ${INK}`, paddingTop: 18, fontSize: 24, color: SUB }}>
          <span>{c ? `Credential ${c.id}` : 'Credential'}</span>
          <span style={{ color: BLUE, fontWeight: 600 }}>{c ? `ainavsystem.com/c/${c.id}` : 'ainavsystem.com/verify'}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'SpectralLight', data: light, weight: 300, style: 'normal' },
        { name: 'SpectralItalic', data: italic, weight: 400, style: 'italic' },
        { name: 'Hanken', data: body, weight: 400, style: 'normal' },
        { name: 'Hanken', data: bodyBold, weight: 600, style: 'normal' },
      ],
    },
  )
}
