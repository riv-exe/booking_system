import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

export async function GET() {
    const totalBookings = await query(`SELECT COUNT(*) FROM bookings`);

    const todayBookings = await query(`
        SELECT COUNT(*) 
        FROM bookings 
        WHERE booking_date = CURRENT_DATE
    `);

    const totalCourts = await query(`
        SELECT COUNT(*) FROM courts
    `);

    const revenue = await query(`
        SELECT COALESCE(SUM(c.price), 0) AS total
        FROM bookings b
        JOIN courts c ON c.id = b.court_id
    `);

    const recentBookings = await query(`
        SELECT 
            b.id,
            bo.name AS booker_name,
            c.name AS court_name,
            b.booking_date,
            b.start_time,
            b.end_time
        FROM bookings b
        JOIN bookers bo ON bo.id = b.booker_id
        JOIN courts c ON c.id = b.court_id
        ORDER BY b.id DESC
        LIMIT 5
    `);

    return NextResponse.json({
        stats: {
            totalBookings: Number(totalBookings.rows[0].count),
            todayBookings: Number(todayBookings.rows[0].count),
            totalCourts: Number(totalCourts.rows[0].count),
            totalRevenue: Number(revenue.rows[0].total)
        },
        recentBookings: recentBookings.rows
    });
}