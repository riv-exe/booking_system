import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

export async function GET() {
    const totalBookings = await query(`SELECT COUNT(*) FROM bookings`);

    const todayBookings = await query(`SELECT COUNT(*) FROM bookings WHERE booking_date = CURRENT_DATE AND status='confirmed'`);

    const totalCourts = await query(`SELECT COUNT(*) FROM courts WHERE is_active = 'true'`);

    const revenue = await query(`SELECT COALESCE(SUM(revenue), 0) AS monthly_revenue 
        FROM bookings
        WHERE created_at >= date_trunc('month', CURRENT_DATE)
        AND created_at < date_trunc('month', CURRENT_DATE) + interval '1 month'
        AND status = 'confirmed'`);

    const pendingBookings = await query(`SELECT COUNT(*) FROM bookings WHERE status = 'pending';`);

    const upcomingBookings = await query(`SELECT COUNT(*) FROM bookings
         WHERE booking_date >= CURRENT_DATE AND status = 'confirmed';`);

    const confirmedBookings = await query(`SELECT COUNT(*)
        FROM bookings
        WHERE created_at >= date_trunc('month', CURRENT_DATE)
        AND created_at < date_trunc('month', CURRENT_DATE) + interval '1 month'
        AND status = 'confirmed'`);

    const newMembers = await query(`
        SELECT COUNT(*)
        FROM users
        WHERE created_at >= date_trunc('month', CURRENT_DATE)
        AND created_at < date_trunc('month', CURRENT_DATE) + interval '1 month'`);


    const recentActivities = await query(`SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 10`);

    return NextResponse.json({
        stats: {
            totalBookings: Number(totalBookings.rows[0].count),
            todayBookings: Number(todayBookings.rows[0].count),
            totalCourts: Number(totalCourts.rows[0].count),
            totalRevenue: Number(revenue.rows[0].monthly_revenue),
            pendingBookings: Number(pendingBookings.rows[0].count),
            upcomingBookings: Number(upcomingBookings.rows[0].count),
            confirmedBookings: Number(confirmedBookings.rows[0].count),
            newMembers: Number(newMembers.rows[0].count)
        },
            recentActivities: recentActivities.rows
    });
}