import { query } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const courts = await query(
      `SELECT * FROM courts LIMIT 4`
    );

    return NextResponse.json({ courts: courts.rows });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}