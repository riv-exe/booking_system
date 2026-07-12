import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

export async function GET(req) {
    try {

        const { searchParams } = new URL(req.url);

        const customerFilter = searchParams.get("customerFilter");
        const courtFilter = searchParams.get("courtFilter");
        const dateFilter = searchParams.get("dateFilter");
        const statusFilter = searchParams.get("statusFilter");

        let conditions = [];
        let values = [];

        if (customerFilter) {
            values.push(`%${customerFilter}%`);
            conditions.push(`bo.name ILIKE $${values.length}`);
        }

        if (courtFilter && courtFilter !== "all") {
            values.push(courtFilter);
            conditions.push(`c.name = $${values.length}`);
        }

        if (dateFilter) {
            values.push(dateFilter);
            conditions.push(`b.booking_date = $${values.length}`);
        }

        if (statusFilter && statusFilter !== "all") {
            values.push(statusFilter);
            conditions.push(`b.status = $${values.length}`);
        }

        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";

        const bookings = await query(
            `
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
                b.payment_proof_url,
                b.remark,
                b.revenue
            FROM bookings b
            JOIN courts c ON c.id = b.court_id
            JOIN bookers bo ON bo.id = b.booker_id
            ${whereClause}
            ORDER BY b.booking_date DESC, b.start_time ASC;
            `,
            values
        );

        const courtNames = await query(`SELECT name, id from courts ORDER BY id ASC;`);

        return NextResponse.json({
            bookings: bookings.rows,
            courtNames: courtNames.rows
        });
    } catch (err) {
        console.error(err);

        return NextResponse.json(
            { error: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}