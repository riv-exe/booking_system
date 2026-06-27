import { query } from "@/app/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    const {name, email, password} = await req.json();

    try {
        if (!name || !email || !password) {
            return NextResponse.json(
                {error: "Missing some of the required fields."},
                {status: 400}
            );
        }

        const existingUser = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]    
        );

        if (existingUser.rowCount > 0) {
            return NextResponse.json(
                {error: "Email is already registered."},
                {status: 409}
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await query(
            `
                INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, name, email, role
            `, [name, email, hashedPassword]
        );

        return NextResponse.json(user.rows[0]);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}