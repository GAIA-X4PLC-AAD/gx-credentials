import { auth } from "@/auth";
import { NextResponse } from "next/server";

const protectedRoutes = ["/home", "/apply", "/issue", "/takeout"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route),
  );

  console.log("isLoggedIn", isLoggedIn);
  console.log("isProtectedRoute", isProtectedRoute);

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
