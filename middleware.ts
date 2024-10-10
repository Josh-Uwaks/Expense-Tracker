import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { publicRoutes, authRoutes, apiAuthPrefix, defaultLoginRedirect } from './route';
import { NextResponse } from 'next/server';

// Initialize NextAuth
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth; // Check if user is authenticated
  const pathname = nextUrl.pathname;

  console.log("Checking Middleware for Path:", pathname);
  console.log("User Auth State:", req.auth);
  console.log("ROUTE", pathname);
  console.log('ISLOGGEDIN', isLoggedIn);

  // Public routes logic
  if (publicRoutes.includes(pathname)) {
    if (isLoggedIn) {
      const absoluteURL = new URL(defaultLoginRedirect, nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }
    return NextResponse.next();
  }

  // Authentication routes logic
  if (authRoutes.includes(pathname)) {
    if (isLoggedIn) {
      const absoluteURL = new URL(defaultLoginRedirect, nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }
    return NextResponse.next();
  }

  // API authentication routes logic
  if (pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next(); // Allow API routes to be accessed
  }

  // Redirect to login for non-public routes if not logged in
  if (!isLoggedIn && !publicRoutes.includes(pathname)) {
    const callbackURL = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    console.log({ "callback is": nextUrl.pathname });
    console.log({ "encoded callback is": callbackURL });
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackURL}`, nextUrl.origin).toString());
  }

  return NextResponse.next(); // Allow all other routes to proceed
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

// import NextAuth from 'next-auth';
// import authConfig from './auth.config';
// import { publicRoutes, authRoutes, apiAuthPrefix, defaultLoginRedirect } from './route';
// import { NextResponse } from 'next/server';
// const {auth} = NextAuth(authConfig)


// export default auth((req) => {
//   const {nextUrl} = req
//   const isLoggedIn = !!req.auth;
//   const pathname = nextUrl.pathname

//   console.log("Checking Middleware for Path:", pathname);
// console.log("User Auth State:", req.auth);
// if (isLoggedIn) {
//   console.log("User is logged in, allowing access to:", pathname);
// } else {
//   console.log("User is not logged in, redirecting from:", pathname);
// }

//   console.log("ROUTE", req.nextUrl.pathname)
//   console.log('ISLOGGEDIN', isLoggedIn)

//   // the public route ~ publicRoutes = ["/"]
//   if (publicRoutes.includes(pathname)) {
//     if(isLoggedIn) {
//       const absoluteURL = new URL(defaultLoginRedirect, nextUrl.origin)
//       return NextResponse.redirect(absoluteURL.toString())
//     }
//     return NextResponse.next()
//   }

//   // the authentication routes ~ authRoutes = ["/auth/login", "/auth/register"]
//   // the default route to dashboard ~ defaultLoginRedirect = "/dashboard"
//   if (authRoutes.includes(pathname)) {
//     if (isLoggedIn) {
//       // Redirect to /dashboard instead of /auth/dashboard
//       const absoluteURL = new URL(defaultLoginRedirect, nextUrl.origin);
//       return NextResponse.redirect(absoluteURL.toString());
//     }
//     return NextResponse.next()
//   }

//   // the api authentication prefix ~ apiAuthPrefix = "/api/auth"
//   if (apiAuthPrefix.includes(pathname)) {
//     if (isLoggedIn) {
//       return NextResponse.next()
//     }
//     const absoluteURL = new URL(apiAuthPrefix, nextUrl.origin);
//     return NextResponse.redirect(absoluteURL.toString());
//   }
  
//   // Corrected condition to check if pathname is not in publicRoutes
//   if(!isLoggedIn && !publicRoutes.includes(pathname)) {
//     let callbackURL = nextUrl.pathname
//     if(nextUrl.search) {
//       callbackURL += nextUrl.search
//     }
//     console.log({
//       "callback is": callbackURL
//     })
//     const encodedCallbackURL = encodeURIComponent(callbackURL)
//     console.log({
//       "encoded callback is": encodedCallbackURL
//     })
//     return NextResponse.redirect(new URL(
//       `/auth/login?${encodedCallbackURL}`
//       , nextUrl.origin).toString())
//   }

//   return NextResponse.next()
// })

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };
