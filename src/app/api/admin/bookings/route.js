import { query } from "@/app/lib/db";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const date = searchParams.get("date");

        if (!date) {
            return Response.json({ error: "Date is required" }, { status: 400 });
        }

        const courtsResult = await query(`
            SELECT id, name, price, is_active, opening_time, closing_time
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
                b.status,
                b.remark,
                bo.name AS booker_name,
                bo.email,
                bo.contact_no
            FROM bookings b
            LEFT JOIN bookers bo ON bo.id = b.booker_id
            WHERE b.booking_date = $1
            AND b.status = ANY($2)
        `, [date, ["confirmed", "pending", "blocked"]]);


        const bookings = bookingsResult.rows;

        const schedule = {};

        bookings.forEach((b) => {
            if (!schedule[b.court_id]) {
                schedule[b.court_id] = {};
            }

                const startHour = parseInt(String(b.start_time).slice(0, 2));
            const endHour = parseInt(String(b.end_time).slice(0, 2));


            for (let h = startHour; h < endHour; h++) {
                const hour = `${String(h).padStart(2, "0")}:00`;

                const existing = schedule[b.court_id][hour];
                if (existing && existing.status === "confirmed" && b.status === "pending") {
                    return;
                }

                schedule[b.court_id][hour] = {
                    booking_id: b.id,
                    name: b.status === "blocked" ? (b.remark || "blocked") : b.booker_name,
                    email: b.status === "blocked" ? null : b.email,
                    contact: b.status === "blocked" ? null : b.contact_no,
                    start_time: b.start_time,
                    end_time: b.end_time,
                    status: b.status,
                    reason: b.remark
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