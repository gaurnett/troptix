import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('fb-token')?.value;

  const isProtected =
    req.nextUrl.pathname.startsWith('/admin') ||
    req.nextUrl.pathname.startsWith('/account');

  if (!isProtected) {
    return NextResponse.next();
  }

  try {
    // Verify that the token is present and logged in but NOT if valid
    const decoded = jwt.decode(token || '') as any;
    if (!decoded?.user_id) throw new Error('Missing user_id');
    return NextResponse.next();
  } catch (error) {
    const url = new URL('/auth/signin', req.url);
    // url.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
