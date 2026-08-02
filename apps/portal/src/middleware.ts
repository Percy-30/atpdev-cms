import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supportedLocales = ['es', 'en', 'ru', 'hi', 'zh', 'fr', 'de', 'pt', 'ja'];
const defaultLocale = 'es';

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  // Simple parser: gets the first preferred language code (e.g. "en-US,en;q=0.9" -> "en")
  const preferred = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
  
  if (supportedLocales.includes(preferred)) {
    return preferred;
  }
  
  // You could return preferred anyway to support ANY language, 
  // but bounding it to a known list is safer for SEO. 
  // For infinite languages, just return preferred if it's a valid 2-letter code.
  if (/^[a-z]{2}$/.test(preferred)) {
    return preferred;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // like favicon.ico, images, pdfs
  ) {
    return NextResponse.next();
  }

  // Check if the pathname is missing a locale
  // We check if the first segment is a valid 2-letter code
  const pathnameIsMissingLocale = !/^\/[a-z]{2}(\/|$)/.test(pathname);

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    // e.g. incoming request is /about
    // The new URL is now /en/about
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
