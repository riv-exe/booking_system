import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({ user: payload });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}