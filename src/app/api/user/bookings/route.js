import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

function authUserOrNull() {
  
  return null;
}

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null, error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, secret);
    const userId = payload?.id;

    if (!userId) {
      return NextResponse.json({ user: null, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    const statusFilter = searchParams.get("statusFilter");
    const dateFilter = searchParams.get("dateFilter");

    const conditions = [];
    const values = [userId];

    
    
    conditions.push(`bo.user_id = $1`);

    if (statusFilter && statusFilter !== "all") {
      values.push(statusFilter);
      conditions.push(`b.status = $${values.length}`);
    }

    if (dateFilter) {
      values.push(dateFilter);
      conditions.push(`b.booking_date = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const totalResult = await query(
      `
        SELECT COUNT(*) AS total
        FROM bookings b
        JOIN courts c ON c.id = b.court_id
        JOIN bookers bo ON bo.id = b.booker_id
        ${whereClause}
      `,
      values
    );

    const total = Number(totalResult.rows?.[0]?.total || 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const bookingValues = [...values, limit, offset];
    const limitIndex = bookingValues.length - 1;
    const offsetIndex = bookingValues.length;

    const bookingsResult = await query(
      `
        SELECT
          b.id,
          b.reference_code,
          c.name AS court_name,
          b.booking_date::text AS booking_date,
          b.start_time,
          b.end_time,
          b.status,
          b.payment_proof_url,
          b.remark,
          b.revenue
        FROM bookings b
        JOIN courts c ON c.id = b.court_id
        JOIN bookers bo ON bo.id = b.booker_id
        ${whereClause}
        ORDER BY b.booking_date DESC, b.start_time ASC
        LIMIT $${limitIndex}
        OFFSET $${offsetIndex}
      `,
      bookingValues
    );

    return NextResponse.json({
      bookings: bookingsResult.rows || [],
      page,
      limit,
      total,
      totalPages,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

