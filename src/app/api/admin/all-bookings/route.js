import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

export async function GET() {
    try {
        const result = await query(`
            SELECT
                b.id,
                bo.name AS booker_name,
                bo.email,
                bo.contact_no,
                c.name AS court_name,
                b.booking_date::text AS booking_date,
                b.start_time,
                b.end_time,
                b.reference_code,
                b.status,
                b.payment_proof_url
            FROM bookings b
            JOIN courts c ON c.id = b.court_id
            JOIN bookers bo ON bo.id = b.booker_id
            ORDER BY b.booking_date DESC, b.start_time ASC
        `);

        return NextResponse.json({
            bookings: result.rows
        });
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}