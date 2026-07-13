import { NextResponse } from "next/server";
import {query} from "@/app/lib/db";

export async function POST(req) {
    try {
        const { userId, activity } = await req.json();
        
        await query(`INSERT INTO activity_logs (activity, user_id)   
            VALUES ($1, $2);`,
            [activity, userId]
        );

        return NextResponse.json(
            {
                success: true,
                message: "Activity logged success"
            }
        );

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}