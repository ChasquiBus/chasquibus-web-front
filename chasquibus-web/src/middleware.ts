import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;

  const protectedPaths = ['/dashboard/:path*'];

  if (protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    // Aquí podrías validar el token con el backend si es necesario
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};