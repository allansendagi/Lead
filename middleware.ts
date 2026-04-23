import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Serve the quiz HTML at the root path
  if (request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/index.html', request.url))
  }
}

export const config = {
  matcher: ['/'],
}
