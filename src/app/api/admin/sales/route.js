import { NextResponse } from "next/server";
import { getSalesData } from "@/app/lib/sales/getSalesData";

export async function GET(req) {

    try {
        const { searchParams } = new URL(req.url);

        const filter =
            searchParams.get("filter") || "this_month";

        const data = await getSalesData(filter);

        return NextResponse.json({
            salesData: data.summary,
            courtRevenueData: data.courtRevenue,
            peakHoursData: data.peakHours,
            recentTransactionsData: data.recentTransactions
        });
    } catch (err) {
        return NextResponse.json(
            { message: "Failed to fetch sales data" },
            { status: 500 }
        );
    }
}