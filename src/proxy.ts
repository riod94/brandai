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

    const response = NextResponse.next();

    // Security Headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://app.midtrans.com https://app.sandbox.midtrans.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; connect-src 'self' https://accounts.google.com https://app.midtrans.com https://app.sandbox.midtrans.com;"
    );

    return response;
});

export const config = {
    matcher: [
        // Match all paths except static files and api
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
    ],
};
