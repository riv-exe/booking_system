import { query } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import {rateLimit} from "@/app/lib/rateLimit";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {

   const limited = rateLimit({
          req,
          name: "api:signup",
          limit: 20,
          windowMs: 30 * 60 * 1000, // 30 minutes
      });

      if (!limited.allowed) {
          return Response.json(
              {
                  error: "Too many signup attempts. Please try again later.",
              },
              {
                  status: 429,
                  headers: {
                      "Retry-After": Math.ceil(
                          (limited.resetAt - Date.now()) / 1000
                      ).toString(),
                  },
              }
          );
      }
      
  try {
    const { name, email, password, contactNum } = await req.json();


    if (!name || !email || !password || !contactNum) {
      return Response.json(
          {
              message: "All fields are required.",
          },
          {
              status: 400,
          }
      );
  }

  const existing = await query( "SELECT id FROM users WHERE email = $1", [email] ); 
  
  if (existing.rows.length > 0) { 
    return Response.json( { 
      message: "Email is already registered.", 
    }, { 
      status: 409, 
    } ); 
  }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users (name, email, password, contact_num)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, contact_num, role`,
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
    },{
      status: 201
    });

  } catch (err) {
    return Response.json(
      { message: "Signup failed" },
      { status: 500 }
    );
  }
}