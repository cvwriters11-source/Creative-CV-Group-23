import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin/session";
import { WRITER_COOKIE, verifyWriterToken } from "@/lib/writer/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSession = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
  const writerSession = await verifyWriterToken(request.cookies.get(WRITER_COOKIE)?.value);

  if (pathname.startsWith("/writer")) {
    if (pathname === "/writer/login") {
      if (writerSession) {
        return NextResponse.redirect(new URL("/writer", request.url));
      }
      return NextResponse.next();
    }
    if (!writerSession) {
      return NextResponse.redirect(new URL("/writer/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    if (adminSession) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    const login = new URL("/auth/login", request.url);
    const next = request.nextUrl.searchParams.get("next");
    if (next) login.searchParams.set("next", next);
    return NextResponse.redirect(login);
  }

  if (!adminSession) {
    if (writerSession) {
      return NextResponse.redirect(new URL("/writer", request.url));
    }
    const login = new URL("/auth/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/writer", "/writer/:path*"],
};
