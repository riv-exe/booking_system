import { query } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const result = await query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return Response.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    const token = await new SignJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      contact_num: user.contact_num
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        contact_num: user.contact_num
      },
    });

  } catch (err) {
    console.error(err);

    return Response.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}