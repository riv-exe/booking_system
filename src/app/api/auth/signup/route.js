import { query } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
  try {
    const { name, email, password, contactNum } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users (name, email, password, contact_num)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email`,
      [name, email, hashedPassword, contactNum]
    );

    const user = result.rows[0];

    const token = await new SignJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      contact_num: user.contact_num,
      role: user.role
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
      message: "Sign Up successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        contact_num: user.contact_num,
        role: user.role
      },
    });

  } catch (err) {
    return Response.json(
      { message: "Signup failed", error: err.message },
      { status: 500 }
    );
  }
}