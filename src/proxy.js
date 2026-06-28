import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(req) {
//   const token = req.cookies.get("token")?.value;
//   if (!token) {
//     return NextResponse.redirect(new URL("/signin", req.url));
//   }

//   try {
//     await jwtVerify(token, secret);
//     return NextResponse.next();

//   } catch (err) {
//     return NextResponse.redirect(new URL("/signin", req.url));
//   }
// }
// export const config = {
//   matcher: [
//     "/((?!signin|signup|api/auth|_next/static|_next/image|favicon.ico).*)",
//   ],
};