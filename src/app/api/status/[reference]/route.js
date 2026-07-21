import { query } from "@/app/lib/db";
import { NextResponse } from "next/server";
import {rateLimit} from "@/app/lib/rateLimit";

export async function GET(req, { params }) {
     const limited = rateLimit({
          req,
          name: "api:status",
          limit: 20,
          windowMs: 10 * 60 * 1000, // 10 minutes
      });

      if (!limited.allowed) {
          return Response.json(
              {
                  error: "Too many attempts. Please try again later.",
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
        const { reference } = await params;

        const result = await query("SELECT bookings.status, bookings.start_time, bookings.end_time, bookings.court_id, bookings.booking_date, bookings.remark, courts.name, courts.address FROM bookings INNER JOIN courts ON bookings.court_id = courts.id WHERE bookings.reference_code = $1", [reference]);

        const booking = result.rows[0];

        if (!booking) {
            return NextResponse.json(
                { message: "Booking not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: booking.status,
            start_time: booking.start_time,
            end_time: booking.end_time,
            court_number: booking.court_id,
            court_name: booking.name,
            date: booking.booking_date,
            address: booking.address,
            remark: booking.remark,
        });
    } catch (error) {

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}