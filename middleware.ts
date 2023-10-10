import {NextRequest, NextResponse} from 'next/server'

const forbiddenPathnames = [
  '/en/galeria',
  '/ca/tienda',
  '/en/tienda',
  '/ca/tienda/impresiones',
  '/en/tienda/impresiones',
  '/en/sobre-mi',
  '/ca/politica-de-privacidad',
  '/en/politica-de-privacidad',
  '/ca/politica-de-cookies',
  '/en/politica-de-cookies'
]

export const config = {
  matcher: [
    '/galeria',
    '/tienda',
    '/sobre-mi',
    '/politica-de-privacidad',
    '/politica-de-cookies'
  ]
}

export async function middleware(request: NextRequest) {
  const {href, origin} = request.nextUrl
  const fullPathname = href.split(origin)[1]
  const isForbiddenPathname = forbiddenPathnames.some(pathname =>
    fullPathname.startsWith(pathname)
  )

  if (isForbiddenPathname) {
    const url = request.nextUrl.clone()

    url.pathname = '/404'

    return NextResponse.rewrite(url)
  }
}
