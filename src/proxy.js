import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};