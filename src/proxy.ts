import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    // Protected routes
    const protectedPaths = ["/create", "/dashboard"];
    const isProtectedRoute = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );

    // Auth routes (should redirect to dashboard if already logged in)
    const authPaths = ["/auth/sign-in", "/auth/sign-up"];
    const isAuthRoute = authPaths.some((path) => pathname.startsWith(path));

    if (isProtectedRoute && !isLoggedIn) {
        const signInUrl = new URL("/auth/sign-in", req.nextUrl.origin);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
    }

    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/create/logo", req.nextUrl.origin));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Match all paths except static files and api
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
    ],
};
