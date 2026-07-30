import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;
  const search = url.search;

  // 1. Handle blog.n8ndevelopers.com subdomain requests
  if (hostname.startsWith('blog.n8ndevelopers.com')) {
    // Strip leading /blog or /blogs if present
    let cleanPath = pathname;
    if (cleanPath.startsWith('/blogs/')) {
      cleanPath = cleanPath.replace(/^\/blogs/, '');
    } else if (cleanPath.startsWith('/blog/')) {
      cleanPath = cleanPath.replace(/^\/blog/, '');
    } else if (cleanPath === '/blog' || cleanPath === '/blogs') {
      cleanPath = '/';
    }

    const destination = cleanPath === '/' || cleanPath === ''
      ? `https://www.n8ndevelopers.com/blogs${search}`
      : `https://www.n8ndevelopers.com/blogs${cleanPath}${search}`;

    return NextResponse.redirect(destination, { status: 301 });
  }

  // 2. Handle non-www n8ndevelopers.com domain requests
  if (hostname === 'n8ndevelopers.com') {
    // Check if path is /blog or /blog/:path*
    if (pathname === '/blog' || pathname === '/blog/') {
      return NextResponse.redirect(`https://www.n8ndevelopers.com/blogs${search}`, { status: 301 });
    }
    if (pathname.startsWith('/blog/')) {
      const rest = pathname.slice(5); // remove '/blog'
      return NextResponse.redirect(`https://www.n8ndevelopers.com/blogs${rest}${search}`, { status: 301 });
    }
    // General non-www to www redirect
    return NextResponse.redirect(`https://www.n8ndevelopers.com${pathname}${search}`, { status: 301 });
  }

  // 3. Handle singular /blog, /post, /article path redirects on www or localhost
  if (pathname === '/blog' || pathname === '/blog/') {
    url.pathname = '/blogs';
    return NextResponse.redirect(url, { status: 301 });
  }
  if (pathname.startsWith('/blog/')) {
    url.pathname = `/blogs${pathname.slice(5)}`;
    return NextResponse.redirect(url, { status: 301 });
  }
  if (pathname.startsWith('/post/')) {
    url.pathname = `/blogs${pathname.slice(5)}`;
    return NextResponse.redirect(url, { status: 301 });
  }
  if (pathname.startsWith('/posts/')) {
    url.pathname = `/blogs${pathname.slice(6)}`;
    return NextResponse.redirect(url, { status: 301 });
  }
  if (pathname.startsWith('/article/')) {
    url.pathname = `/blogs${pathname.slice(8)}`;
    return NextResponse.redirect(url, { status: 301 });
  }
  if (pathname.startsWith('/articles/')) {
    url.pathname = `/blogs${pathname.slice(9)}`;
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and api routes
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};