import { query } from "@/app/lib/db";

export async function getSalesData(filter) {
    
 const recentTransactionsData = await query(
            `SELECT b.created_at, b.booking_date, b.start_time, b.end_time, b.reference_code, b.revenue, bo.name AS customer_name, c.name AS court_name
            FROM bookings b
            INNER JOIN bookers bo ON bo.id = b.booker_id
            INNER JOIN courts c ON c.id = b.court_id
            WHERE b.status = 'confirmed'
            ORDER BY b.created_at DESC
            LIMIT 20`
        );

        let dateCondition = "";

        switch (filter) {
            case "today":
                dateCondition = `
                    bookings.created_at >= CURRENT_DATE
                    AND bookings.created_at < CURRENT_DATE + interval '1 day'
                `;
                break;

            case "this_week":
                dateCondition = `
                    bookings.created_at >= date_trunc('week', CURRENT_DATE)
                    AND bookings.created_at < date_trunc('week', CURRENT_DATE) + interval '1 week'
                `;
                break;

            case "this_year":
                dateCondition = `
                    bookings.created_at >= date_trunc('year', CURRENT_DATE)
                    AND bookings.created_at < date_trunc('year', CURRENT_DATE) + interval '1 year'
                `;
                break;

            default: // this_month
                dateCondition = `
                    bookings.created_at >= date_trunc('month', CURRENT_DATE)
                    AND bookings.created_at < date_trunc('month', CURRENT_DATE) + interval '1 month'
                `;
        }

        const salesData = await query(`SELECT 
                                    COALESCE(SUM(bookings.revenue),0) AS total_revenue, 
                                    COUNT(bookings.id) AS total_bookings, 
                                    COALESCE(AVG(bookings.revenue),0) AS average_booking, 
                                    (SELECT courts.name FROM bookings b JOIN courts ON courts.id=b.court_id WHERE b.status='confirmed' AND ${dateCondition.replaceAll("bookings.","b.")} GROUP BY courts.id,courts.name ORDER BY COUNT(*) DESC LIMIT 1) AS best_court
                                    FROM bookings 
                                    WHERE bookings.status='confirmed' AND ${dateCondition};`);

        const courtRevenueData = await query(`SELECT courts.id AS court_id, 
                                    courts.name AS court_name,
                                    COALESCE(SUM(bookings.revenue),0) AS total_revenue
                                    FROM courts 
                                    LEFT JOIN bookings ON courts.id=bookings.court_id AND bookings.status='confirmed' AND ${dateCondition}
                                    GROUP BY courts.id, courts.name 
                                    ORDER BY total_revenue DESC;

`);
        const peakHoursData = await query(`WITH hour_slots AS (
                                    SELECT TIME '06:00' AS hour_slot
                                    UNION ALL SELECT TIME '07:00'
                                    UNION ALL SELECT TIME '08:00'
                                    UNION ALL SELECT TIME '09:00'
                                    UNION ALL SELECT TIME '10:00'
                                    UNION ALL SELECT TIME '11:00'
                                    UNION ALL SELECT TIME '12:00'
                                    UNION ALL SELECT TIME '13:00'
                                    UNION ALL SELECT TIME '14:00'
                                    UNION ALL SELECT TIME '15:00'
                                    UNION ALL SELECT TIME '16:00'
                                    UNION ALL SELECT TIME '17:00'
                                )
                                    SELECT hs.hour_slot, COUNT(bookings.id) AS total_bookings
                                    FROM hour_slots hs
                                    LEFT JOIN bookings
                                    ON bookings.start_time <= hs.hour_slot
                                    AND bookings.end_time > hs.hour_slot
                                    AND bookings.status = 'confirmed'
                                    AND ${dateCondition}
                                    GROUP BY hs.hour_slot
                                    ORDER BY hs.hour_slot;`);
    return {
        filter,
        summary: salesData.rows[0],
        courtRevenue: courtRevenueData.rows,
        peakHours: peakHoursData.rows,
        recentTransactions: recentTransactionsData.rows
    };
}