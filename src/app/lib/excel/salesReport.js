import ExcelJS from "exceljs";

export async function generateSalesExcel(data) {

    const {
        filter,
        summary,
        courtRevenue,
        peakHours,
        recentTransactions
    } = data;

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "IDS Sport Court Booking System";
    workbook.company = "IDS";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Sales Report");

    // COLUMN WIDTHS

    worksheet.columns = [
        { width: 24 },
        { width: 25 },
        { width: 30 },
        { width: 22 },
        { width: 45 },
        { width: 18 }
    ];

    // TITLE

    worksheet.mergeCells("A1:F1");

    const title = worksheet.getCell("A1");

    title.value = "IMUS DRIVE AND SMASH SPORT CENTER BOOKING SYSTEM";

    title.font = {
        bold: true,
        size: 18,
        color: { argb: "FFFFFFFF" }
    };

    title.alignment = {
        horizontal: "center",
        vertical: "middle"
    };

    title.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1E3A8A" }
    };

    worksheet.mergeCells("A2:F2");

    const subtitle = worksheet.getCell("A2");

    subtitle.value = "Sales Report";

    subtitle.font = {
        bold: true,
        size: 13
    };

    subtitle.alignment = {
        horizontal: "center"
    };

    worksheet.addRow([]);

    const generatedAt = new Date().toLocaleString("en-PH", {
        timeZone: "Asia/Manila",
    });

    worksheet.addRow([
        "Generated:",
        generatedAt
    ]);

    worksheet.addRow([
        "Filter:",
        filter.replaceAll("_", " ").toUpperCase()
    ]);

    worksheet.addRow([]);
    
    // SUMMARY

    const summaryTitle = worksheet.addRow(["SUMMARY"]);

    summaryTitle.font = {
        bold: true,
        size: 14
    };

    worksheet.addRow([
        "Total Revenue",
        Number(summary.total_revenue)
    ]);

    worksheet.addRow([
        "Total Bookings",
        summary.total_bookings
    ]);

    worksheet.addRow([
        "Average Booking",
        Number(summary.average_booking)
    ]);

    worksheet.addRow([
        "Best Performing Court",
        summary.best_court || "-"
    ]);

    worksheet.getColumn(2).numFmt =
        '"PHP" #,##0.00';

    worksheet.addRow([]);

    // REVENUE BY COURT

    const revenueTitle =
        worksheet.addRow(["REVENUE BY COURT"]);

    revenueTitle.font = {
        bold: true,
        size: 14
    };

    const revenueHeader =
        worksheet.addRow([
            "Court",
            "Revenue"
        ]);

    revenueHeader.font = {
        bold: true
    };

    courtRevenue.forEach(function(court){

        worksheet.addRow([
            court.court_name,
            Number(court.total_revenue)
        ]);

    });

    worksheet.addRow([]);

    // PEAK HOURS

    const peakTitle = worksheet.addRow(["PEAK HOURS"]);

    peakTitle.font = {
        bold: true,
        size: 14
    };

    const peakHeader = worksheet.addRow([
        "Time Slot",
        "Bookings"
    ]);

    peakHeader.font = {
        bold: true
    };

    peakHours.forEach(function(hour){

        worksheet.addRow([
            new Date(
                `1970-01-01T${hour.hour_slot}`
            ).toLocaleTimeString("en-US",{
                hour:"numeric",
                minute:"2-digit",
                hour12:true
            }),

            Number(hour.total_bookings)

        ]);

    });

    worksheet.addRow([]);

    // RECENT TRANSACTIONS
    
    const transactionTitle = worksheet.addRow([
            "RECENT TRANSACTIONS"
        ]);

    transactionTitle.font = {
        bold:true,
        size:14
    };

    const transactionHeader =
        worksheet.addRow([

            "Date",

            "Reference",

            "Customer",

            "Court",

            "Booking Schedule",

            "Amount"

        ]);

    transactionHeader.font = {
        bold:true
    };
        recentTransactions.forEach(function(transaction){

        const bookingSchedule =

            `${new Date(
                transaction.booking_date
            ).toLocaleDateString("en-US",{

                weekday:"long",

                month:"long",

                day:"numeric",

                year:"numeric"

            })}, ${new Date(
            `1970-01-01T${transaction.start_time}`
            ).toLocaleTimeString("en-US",{

            hour:"numeric",

            minute:"2-digit",

            hour12:true

            })} - ${new Date(
            `1970-01-01T${transaction.end_time}`
            ).toLocaleTimeString("en-US",{

            hour:"numeric",

            minute:"2-digit",

            hour12:true

            })}`;

        worksheet.addRow([

            new Date(
                transaction.created_at
            ).toLocaleString("en-US",{

                month:"short",

                day:"numeric",

                year:"numeric",

                hour:"numeric",

                minute:"2-digit",

                hour12:true

            }),

            transaction.reference_code,

            transaction.customer_name,

            transaction.court_name,

            bookingSchedule,

            Number(transaction.revenue)

        ]);

    });
        worksheet.getColumn(6).numFmt =
        '"PHP" #,##0.00';
            worksheet.getColumn(5).alignment = {

        wrapText:true,

        vertical:"middle"

    };
        transactionHeader.alignment = {

        horizontal:"center",

        vertical:"middle"

    };

    peakHeader.alignment = {

        horizontal:"center"

    };

    revenueHeader.alignment = {

        horizontal:"center"

    };
        worksheet.views = [

        {

            state:"frozen",

            ySplit:2

        }

    ];
        worksheet.eachRow(function(row){

        row.eachCell(function(cell){

            cell.border = {

                top:{
                    style:"thin"
                },

                left:{
                    style:"thin"
                },

                bottom:{
                    style:"thin"
                },

                right:{
                    style:"thin"
                }

            };

        });

    });
        
    summaryTitle.eachCell(function(cell){

        cell.border = {};

    });
    revenueTitle.eachCell(function(cell){

        cell.border = {};

    });
    peakTitle.eachCell(function(cell){

        cell.border = {};

    });
    transactionTitle.eachCell(function(cell){

        cell.border = {};

    });

    worksheet.eachRow(function(row){

        row.height = 22;

    });
    
    worksheet.getRow(1).height = 30;
        const buffer =
        await workbook.xlsx.writeBuffer();

    return buffer;

}