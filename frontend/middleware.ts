import { auth } from "@/auth";
import { NextResponse } from "next/server";

// List of routes that require authentication
const protectedRoutes = ["/home", "/apply", "/issue", "/takeout"];

export default auth((req) => {
  console.log("cookie", req.cookies.get("authjs.session-token")?.value);

  const isLoggedIn = !!req.auth;
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  console.log("isLoggedIn", isLoggedIn);
  console.log("isProtectedRoute", isProtectedRoute);

  // if (isProtectedRoute && !isLoggedIn) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  // Allow the request to proceed
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
