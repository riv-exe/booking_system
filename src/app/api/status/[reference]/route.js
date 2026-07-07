import { query } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
     
    try {
        const { reference } = await params;

        const result = await query("SELECT bookings.status, bookings.start_time, bookings.end_time, bookings.court_id, bookings.booking_date, courts.address FROM bookings INNER JOIN courts ON bookings.court_id = courts.id WHERE bookings.reference_code = $1", [reference]);

        const booking = result.rows[0];

        if (!booking) {
            return NextResponse.json(
                { message: "Booking not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: booking.status,
            start_time: booking.start_time,
            end_time: booking.end_time,
            court_number: booking.court_id,
            date: booking.booking_date,
            address: booking.address,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}