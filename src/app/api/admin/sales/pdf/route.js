import { NextResponse } from "next/server";
import { getSalesData } from "@/app/lib/sales/getSalesData";
import { generateSalesReport } from "@/app/lib/pdf/salesReport";

export async function GET(req) {
const today = new Date().toISOString().split("T")[0];
    try {
        const { searchParams } = new URL(req.url);

        const filter =
            searchParams.get("filter") || "this_month";

        const data = await getSalesData(filter);

        const pdfBytes =
            await generateSalesReport(data);

        return new NextResponse(pdfBytes, {
            headers: {
                "Content-Type":"application/pdf",
                "Content-Disposition":
                `attachment; filename="IDS_sales_report_${today}.pdf"`
            }
        });
    } catch(err){
        return NextResponse.json(
            {
                message:"Failed to generate PDF"
            },
            {
                status:500
            }
        );
    }
}