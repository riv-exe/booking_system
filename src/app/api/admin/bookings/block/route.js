import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

function normalizeHourToLabel(t) {
  if (!t) return null;
  
  if (typeof t === "string" && t.includes(":")) {
    const hh = parseInt(t.slice(0, 2), 10);
    if (!Number.isFinite(hh)) return null;
    return `${String(hh).padStart(2, "0")}:00`;
  }
  const hh = parseInt(String(t).slice(0, 2), 10);
  if (!Number.isFinite(hh)) return null;
  return `${String(hh).padStart(2, "0")}:00`;
}

export async function DELETE(req) {
  try {
    const body = await req.json();

    const booking_id = body.booking_id;
    if (!booking_id) {
      return NextResponse.json({ error: "booking_id is required" }, { status: 400 });
    }

    
    const result = await query(
      `DELETE FROM bookings
       WHERE id = $1
       AND status = 'blocked'
       RETURNING id`,
      [booking_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Blocked booking not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, bookingId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();


    const booking_date = body.booking_date;
    const court_id = body.court_id;
    const start_time = normalizeHourToLabel(body.start_time);
    const end_time = normalizeHourToLabel(body.end_time);
    const status = body.status;
    
    
    const reason = (body.reason || "").toString().trim();

    if (!booking_date || !court_id || !start_time || !end_time) {
      return NextResponse.json(
        { error: "booking_date, court_id, start_time and end_time are required" },
        { status: 400 }
      );
    }

    if (status !== "blocked") {
      return NextResponse.json({ error: "status must be 'blocked'" }, { status: 400 });
    }

    if (!reason) {
      return NextResponse.json({ error: "reason is required" }, { status: 400 });
    }

    const startHour = parseInt(start_time.slice(0, 2), 10);
    const endHour = parseInt(end_time.slice(0, 2), 10);

    if (!Number.isFinite(startHour) || !Number.isFinite(endHour) || endHour <= startHour) {
      return NextResponse.json({ error: "Invalid time range" }, { status: 400 });
    }

    
    
    
    const booker_id = body.booker_id;

    let finalBookerId = booker_id;

    
    
    if (!finalBookerId) {
      const anyBooker = await query(`SELECT id FROM bookers ORDER BY id ASC LIMIT 1`);
      if (anyBooker.rows.length === 0) {
        return NextResponse.json(
          { error: "Cannot create block: bookers table is empty and booker_id was not provided" },
          { status: 400 }
        );
      }
      finalBookerId = anyBooker.rows[0].id;
    }

    
    const bookerCheck = await query(`SELECT id FROM bookers WHERE id = $1`, [finalBookerId]);
    if (bookerCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid booker_id: not found in bookers" },
        { status: 400 }
      );
    }


    const result = await query(
      `
        INSERT INTO bookings
        (court_id, booking_date, start_time, end_time, status, remark, booker_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `,
      [court_id, booking_date, start_time, end_time, status, reason, booker_id]
    );



    return NextResponse.json({ ok: true, bookingId: result.rows[0]?.id });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

