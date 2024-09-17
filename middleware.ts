import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { publicRoutes, authRoutes, apiAuthPrefix, defaultLoginRedirect } from './route';
import { NextResponse } from 'next/server';
const {auth} = NextAuth(authConfig)


export default auth((req) => {
  const {nextUrl} = req
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname

  console.log("ROUTE", req.nextUrl.pathname)
  console.log('ISLOGGEDIN', isLoggedIn)

  // the public route ~ publicRoutes = ["/"]
  if (publicRoutes.includes(pathname)) {
    if(isLoggedIn) {
      const absoluteURL = new URL(defaultLoginRedirect, nextUrl.origin)
      return NextResponse.redirect(absoluteURL.toString())
    }
    return NextResponse.next()
  }

  // the authentication routes ~ authRoutes = ["/auth/login", "/auth/register"]
  // the default route to dashboard ~ defaultLoginRedirect = "/dashboard"
  if (authRoutes.includes(pathname)) {
    if (isLoggedIn) {
      // Redirect to /dashboard instead of /auth/dashboard
      const absoluteURL = new URL(defaultLoginRedirect, nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }
    return NextResponse.next()
  }

  // the api authentication prefix ~ apiAuthPrefix = "/api/auth"
  if (apiAuthPrefix.includes(pathname)) {
    if (isLoggedIn) {
      return NextResponse.next()
    }
    const absoluteURL = new URL(apiAuthPrefix, nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  
  // Corrected condition to check if pathname is not in publicRoutes
  if(!isLoggedIn && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl.origin).toString())
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
