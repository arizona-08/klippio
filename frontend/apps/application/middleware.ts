import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const API_URL = process.env.INTERNAL_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

  const sessionCookieName = 'connect.sid';
  const sessionCookie = req.cookies.get(sessionCookieName);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  try{
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        "Cookie": `${sessionCookie.name}=${sessionCookie.value}`,
        "Content-Type": "application/json"
      }
    });

    if(!response.ok){
      const redirectResponse = NextResponse.redirect(new URL('/auth/login', req.url));

      redirectResponse.cookies.delete(sessionCookieName); // nettoie le cookie invalide
      return redirectResponse;
    }

    return NextResponse.next();

  } catch(error) {
    console.error('Erreur de communication avec le serveur NestJS:', error);
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

 
}

export const config = {
  matcher: [
    '/dashboard/',
    '/dashboard/:path*',
    '/project/:path*',
    '/profile/:path*',
  ],
};