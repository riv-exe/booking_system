import { query } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
    try {
        const { id } = await params;
        const { status, remark } = await req.json();

        if (!["confirmed", "rejected", "pending"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status." },
                { status: 400 }
            );
        }

        const result = await query(
            `
            UPDATE bookings
            SET status = $1, remark = $2
            WHERE id = $3
            RETURNING *
            `,
            [status, remark, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: "Booking not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Booking updated successfully.",
            booking: result.rows[0],
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Internal Server Error." },
            { status: 500 }
        );
    }
}