import { NextResponse, type NextRequest } from "next/server";

const ROLE_COOKIE = "zoya_role";

const roleHome: Record<string, string> = {
  guest: "/",
  prospect: "/konversi",
  agent: "/dashboard",
  klien_maklon: "/maklon-portal",
  admin: "/admin"
};

/** Which roles may enter each protected area. */
function allowed(pathname: string, role: string): boolean {
  if (pathname.startsWith("/admin")) return role === "admin";
  if (pathname.startsWith("/dashboard")) return role === "agent" || role === "admin";
  if (pathname.startsWith("/maklon-portal")) return role === "klien_maklon" || role === "admin";
  if (pathname.startsWith("/konversi") || pathname.startsWith("/ajukan-agen")) {
    return role === "prospect" || role === "admin";
  }
  return true; // public areas
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = req.cookies.get(ROLE_COOKIE)?.value ?? "guest";

  if (!allowed(pathname, role)) {
    const url = req.nextUrl.clone();
    url.pathname = roleHome[role] ?? "/";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"]
};
