import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth) {
    const loginUrl = new URL("/signin", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname); // Save original path (e.g. /signin?callbackUrl=/app)
    return Response.redirect(loginUrl);
  }
});

// Config means middleware will ONLY deal with THESE routes, everything else is not its business
export const config = {
  matcher: ["/app/:path*", "/settings/:path*"],
};
