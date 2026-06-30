import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (!token) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (pathname === "/" && payload.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};