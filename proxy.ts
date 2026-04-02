import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy (middleware) untuk melindungi rute-rute yang memerlukan autentikasi.
 * - /admin/* hanya bisa diakses oleh pengguna yang sudah login.
 * - /cart, /checkout hanya bisa diakses oleh pengguna yang sudah login.
 *
 * Catatan: Pengecekan peran ADMIN dilakukan di level server component/action
 * karena proxy tidak bisa mengakses database secara langsung.
 */
export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("bookstore_session");
  const { pathname } = request.nextUrl;

  /** Rute yang memerlukan autentikasi */
  const protectedRoutes = ["/admin", "/cart", "/checkout", "/contact"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  /** Rute autentikasi (login/register) - redirect jika sudah login */
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && sessionCookie) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
