import { NextResponse } from "next/server";
import { getSalesData } from "@/app/services/getSalesData";
import { generateSalesExcel } from "@/app/lib/excel/salesReport";

export async function GET(req) {

    try {
        const { searchParams } = new URL(req.url);

        const filter =
            searchParams.get("filter") || "this_month";

        const data =
            await getSalesData(filter);

        const excelBuffer =
            await generateSalesExcel(data);

        const today =
            new Date().toISOString().split("T")[0];

        return new NextResponse(excelBuffer, {

            headers: {
                "Content-Type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition":
                `attachment; filename="IDS_sales_report_${today}.xlsx"`
            }
        });
    }
    catch(err){
        return NextResponse.json(
            {
                message:"Failed to generate Excel."
            },
            {
                status:500
            }
        );
    }
}