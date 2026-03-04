import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const authRoutes = ["/login", "/signup"];
const protectedRoutes = ["/"];
const API_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });

  let isAuthenticated = false;

  if (token && (token as any).accessToken) {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${(token as any).accessToken}`,
        },
      });
      isAuthenticated = res.ok;
    } catch {
      isAuthenticated = false;
    }
  }

  const { pathname } = req.nextUrl;

  if (!isAuthenticated && protectedRoutes.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && authRoutes.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup"],
};

