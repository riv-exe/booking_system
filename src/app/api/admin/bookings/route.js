import { query } from "@/app/lib/db";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const date = searchParams.get("date");

        if (!date) {
            return Response.json({ error: "Date is required" }, { status: 400 });
        }

        const courtsResult = await query(`
            SELECT id, name, price, is_active
            FROM courts
            WHERE is_active = true
            ORDER BY id ASC
        `);

        const courts = courtsResult.rows;

        const bookingsResult = await query(`
            SELECT 
                b.id,
                b.court_id,
                b.booking_date,
                b.start_time,
                b.end_time,
                bo.name AS booker_name,
                bo.email,
                bo.contact_no
            FROM bookings b
            JOIN bookers bo ON bo.id = b.booker_id
            WHERE b.booking_date = $1
        `, [date]);

        const bookings = bookingsResult.rows;

        const schedule = {};

        bookings.forEach((b) => {
            if (!schedule[b.court_id]) {
                schedule[b.court_id] = {};
            }

            const startHour = parseInt(b.start_time.slice(0, 2));
            const endHour = parseInt(b.end_time.slice(0, 2));

            for (let h = startHour; h < endHour; h++) {
                const hour = `${String(h).padStart(2, "0")}:00`;

                schedule[b.court_id][hour] = {
                    booking_id: b.id,
                    name: b.booker_name,
                    email: b.email,
                    contact: b.contact_no,
                    start_time: b.start_time,
                    end_time: b.end_time
                };
            }
        });

        return Response.json({
            courts,
            bookings: schedule
        });

    } catch (err) {
        console.error(err);
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}