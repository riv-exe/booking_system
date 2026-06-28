import { query } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    let {user_id, court_id, booking_date, start_time, end_time, name, email, contactNum} = await req.json();

    let booker_id;

    try {
        if (!court_id || !booking_date || !start_time || !end_time) {
            return NextResponse.json(
                {error: "Required fields are missing."},
                {status: 400}
            );
        }

        if(user_id) {
          const user = await query(
            `
              SELECT * FROM users WHERE id = $1
            `, [user_id]
          );

          const userRes = user.rows[0];
          
          name = userRes.name;
          email = userRes.email;
          contactNum = userRes.contact_num;

          const bookers = await query(
              `
                  INSERT INTO bookers (user_id, name, email, contact_no)
                  VALUES ($1, $2, $3, $4)
                  RETURNING id, user_id, name, email, contact_no
              `, [user_id, name, email, contactNum]
          );

          booker_id = bookers.rows[0].id;

          const bookings = await query(
              `
                  INSERT INTO bookings (booker_id, court_id, booking_date, start_time, end_time)
                  VALUES ($1, $2, $3, $4, $5)
                  RETURNING id, booker_id, court_id, booking_date, start_time, end_time
              `, [booker_id, court_id, booking_date, start_time, end_time]
          );

          return NextResponse.json(
              {
                  message: "Booking sucessfuly created.",
                  booker: bookers.rows[0],
                  booking: bookings.rows[0]
              }
          )
        } else {
          const bookers = await query(
              `
                  INSERT INTO bookers (user_id, name, email, contact_no)
                  VALUES ($1, $2, $3, $4)
                  RETURNING id, user_id, name, email, contact_no
              `, [user_id, name, email, contactNum]
          );

          booker_id = bookers.rows[0].id;

          const bookings = await query(
              `
                  INSERT INTO bookings (booker_id, court_id, booking_date, start_time, end_time)
                  VALUES ($1, $2, $3, $4, $5)
                  RETURNING id, booker_id, court_id, booking_date, start_time, end_time
              `, [booker_id, court_id, booking_date, start_time, end_time]
          );

          return NextResponse.json({
            message: "Booking successfully created.",
            booker: bookers.rows[0],
            bookings: bookings.rows[0]
        });
        }

        
    } catch (error) {
        console.log(error);
        return NextResponse.json(
              {
                  message: "Booking not sucessfuly created."
              },
              {status: 500}
          )
    }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const court_id = searchParams.get("court_id");
  const date = searchParams.get("date");

  if (!court_id || !date) {
    return NextResponse.json(
      { error: "court_id and date are required" },
      { status: 400 }
    );
  }

  try {
    const result = await query(
      `
      SELECT start_time, end_time
      FROM bookings
      WHERE court_id = $1
      AND booking_date = $2
      `,
      [court_id, date]
    );

    // Convert bookings into hourly slots
    const bookedHours = [];

    result.rows.forEach((booking) => {
      const start = parseInt(booking.start_time.slice(0, 2));
      const end = parseInt(booking.end_time.slice(0, 2));

      for (let h = start; h < end; h++) {
        bookedHours.push(`${String(h).padStart(2, "0")}:00`);
      }
    });

    return NextResponse.json({ bookedHours });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}