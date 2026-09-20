import { readFileSync } from 'fs'
import { join } from 'path'

// Moved here from "/" — the workshop page is now the homepage.
// This is the original AI Readiness quiz, unchanged, just relocated.
export async function GET() {
  const html = readFileSync(join(process.cwd(), 'public/index.html'), 'utf8')
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
