import {
    PDFDocument,
    StandardFonts,
    rgb
} from "pdf-lib";

export async function generateSalesReport(data) {

    const {
        filter,
        summary,
        courtRevenue,
        peakHours,
        recentTransactions
    } = data;

    const pdf = await PDFDocument.create();
    const pages = [];
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

    let page = pdf.addPage([595, 842]);
    pages.push(page);

    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    const margin = 40;

    let y = pageHeight - margin;

    const lineColor = rgb(0.75,0.75,0.75);

    const gray = rgb(0.45,0.45,0.45);

    const black = rgb(0,0,0);

        function checkPage(requiredSpace = 20){

        if(y < requiredSpace + 60){

            page = pdf.addPage([595,842]);
            pages.push(page);
            y = pageHeight - margin;

            drawHeader(false);

        }

    }
        function divider(){

        checkPage();

        page.drawLine({

            start:{
                x:margin,
                y
            },

            end:{
                x:pageWidth-margin,
                y
            },

            thickness:1,

            color:lineColor

        });

        y-=15;

    }
        function write(
        text,
        size = 11,
        isBold = false,
        color = black,
        x = margin
    ){

        checkPage(size + 10);

        page.drawText(String(text),{

            x,

            y,

            size,

            font:isBold ? bold : font,

            color

        });

        y -= size + 8;

    }
        function pair(left,right){

        checkPage();

        page.drawText(String(left),{

            x:margin,

            y,

            size:11,

            font

        });

        page.drawText(String(right),{

            x:420,

            y,

            size:11,

            font:bold

        });

        y-=18;

    }
       
        function drawHeader(firstPage = true){

        if(firstPage){

            page.drawRectangle({

                x:0,

                y:785,

                width:595,

                height:57,

                color: rgb(0.13, 0.36, 0.73)

            });

            page.drawText(
                "IMUS DRIVE & SMASH SPORTS CENTER",
                {

                    x:125,

                    y:815,

                    size:18,

                    font:bold,

                    color:rgb(1,1,1)
                }
            );

            page.drawText(
                "Sales Report",
                {

                    x:260,

                    y:795,

                    size:11,

                    font,

                    color:rgb(1,1,1)

                }
            );

            y = 760;

        }

        const generatedAt = new Date().toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
        });

        write(
            `Generated: ${generatedAt}`,
            10,
            false,
            gray
        )

        write(
            `Filter: ${filter.replaceAll("_"," ").toUpperCase()}`,
            10,
            false,
            gray
        );

    y -= 5;
    }
    drawHeader();
    // ======================================================
// SUMMARY
// ======================================================

y -= 10;
write("SUMMARY", 14, true);
y -= 1;
pair(
    "Total Revenue",
    `PHP ${Number(summary.total_revenue).toLocaleString(undefined,{
        minimumFractionDigits:2,
        maximumFractionDigits:2
    })}`
);

pair(
    "Total Bookings",
    summary.total_bookings
);

pair(
    "Average Booking",
    `PHP ${Number(summary.average_booking).toLocaleString(undefined,{
        minimumFractionDigits:2,
        maximumFractionDigits:2
    })}`
);

pair(
    "Best Performing Court",
    summary.best_court || "-"
);

y -= 20;


// ======================================================
// REVENUE BY COURT
// ======================================================

write("REVENUE BY COURT",14,true);
y -= 1;

page.drawText("Court",{
    x:margin,
    y,
    size:11,
    font:bold
});

page.drawText("Revenue",{
    x:420,
    y,
    size:11,
    font:bold
});

y -= 8;

divider();

courtRevenue.forEach(function(court){

    checkPage();

    page.drawText(
        court.court_name,
        {
            x:margin,
            y,
            size:10,
            font
        }
    );

    page.drawText(
        `PHP ${Number(court.total_revenue).toLocaleString(undefined,{
            minimumFractionDigits:2,
            maximumFractionDigits:2
        })}`,
        {
            x:420,
            y,
            size:10,
            font:bold
        }
    );

    y -= 16;

});

y -= 20;
// ======================================================
// PEAK HOURS
// ======================================================

write("PEAK HOURS", 14, true);


const amHours = peakHours.filter(function (hour) {
    return Number(hour.hour_slot.substring(0, 2)) < 12;
});

const pmHours = peakHours.filter(function (hour) {
    return Number(hour.hour_slot.substring(0, 2)) >= 12;
});

// Column Headers
page.drawText("AM", {
    x: 120,
    y,
    size: 11,
    font: bold
});

page.drawText("PM", {
    x: 420,
    y,
    size: 11,
    font: bold
});

y -= 5;

divider();

const startY = y;

let leftY = startY;
let rightY = startY;

// ---------- AM ----------
amHours.forEach(function (hour) {

    page.drawText(
        new Date("2000-01-01T" + hour.hour_slot).toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }
        ),
        {
            x: 70,
            y: leftY,
            size: 9,
            font
        }
    );

    page.drawText(
        `${hour.total_bookings} bookings`,
        {
            x: 150,
            y: leftY,
            size: 9,
            font:bold
        }
    );

    leftY -= 15;

});

// ---------- PM ----------
pmHours.forEach(function (hour) {

    page.drawText(
        new Date("2000-01-01T" + hour.hour_slot).toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }
        ),
        {
            x: 370,
            y: rightY,
            size: 9,
            font
        }
    );

    page.drawText(
        `${hour.total_bookings} bookings`,
        {
            x: 450,
            y: rightY,
            size: 9,
            font: bold
        }
    );

    rightY -= 15;

});

// Continue after whichever column is longer
y = Math.min(leftY, rightY);

y -= 25;
// ======================================================
// RECENT TRANSACTIONS
// ======================================================

write("RECENT TRANSACTIONS", 14, true);
y -= 10;

// ---------- Table Header ----------

const headerY = y;

page.drawRectangle({
    x: margin,
    y: headerY - 6,
    width: pageWidth - (margin * 2),
    height: 20,
    color: rgb(85/255, 182/255, 255/255)
});

page.drawText("Date", {
    x: 45,
    y: headerY,
    size: 9,
    font: bold
});

page.drawText("Reference", {
    x: 140,
    y: headerY,
    size: 9,
    font: bold
});

page.drawText("Customer", {
    x: 230,
    y: headerY,
    size: 9,
    font: bold
});

page.drawText("Court", {
    x: 360,
    y: headerY,
    size: 9,
    font: bold
});



page.drawText("Amount", {
    x: 480,
    y: headerY,
    size: 9,
    font: bold
});

y -= 18;


// ---------- Rows ----------

recentTransactions.forEach(function(transaction, index){

    checkPage(45);

    // redraw table header after page break
    if(y > pageHeight - 100){

        page.drawRectangle({
            x: margin,
            y: y - 6,
            width: pageWidth - (margin * 2),
            height: 20,
            color: rgb(85/255, 182/255, 255/255)
        });

        page.drawText("Date",{
            x:45,
            y,
            size:9,
            font:bold
        });

        page.drawText("Reference",{
            x:140,
            y,
            size:9,
            font:bold
        });

        page.drawText("Customer",{
            x:230,
            y,
            size:9,
            font:bold
        });

        page.drawText("Court",{
            x:360,
            y,
            size:9,
            font:bold
        });

        page.drawText("Amount",{
            x:480,
            y,
            size:9,
            font:bold
        });

        y -= 18;

    }

    // Zebra stripes

    if(index % 2 !== 0){

        page.drawRectangle({

            x:margin,

            y:y-4,

            width:pageWidth-(margin*2),

            height:16,

            color:rgb(215/255, 238/255, 255/255)

        });

    }


    // Date

    page.drawText(

        new Date(transaction.created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
}),

        {

            x:45,

            y,

            size:8,

            font

        }

    );


    // Reference

    page.drawText(

        transaction.reference_code,

        {

            x:140,

            y,

            size:8,

            font

        }

    );


    // Customer

    page.drawText(

        transaction.customer_name.toUpperCase(),

        {

            x:230,

            y,

            size:8,

            font

        }

    );


    // Court

    page.drawText(

        transaction.court_name,

        {

            x:360,

            y,

            size:8,

            font

        }

    );


    // Amount

    page.drawText(

        `PHP ${Number(transaction.revenue).toFixed(2)}`,

        {

            x:480,

            y,

            size:8,

            font:bold

        }

    );

    y -= 18;

});

y -= 25;
// ======================================================
// FOOTER
// ======================================================

pages.forEach(function(currentPage, index){

    const width = currentPage.getWidth();

    currentPage.drawLine({

        start:{
            x:40,
            y:30
        },

        end:{
            x:width-40,
            y:30
        },

        thickness:1,

        color:rgb(0.8,0.8,0.8)

    });

    currentPage.drawText(

        "Generated by Imus Drive and Smash Sports Center Booking System",

        {

            x:40,

            y:15,

            size:8,

            font,

            color:gray

        }

    );

    currentPage.drawText(

        `Page ${index + 1} of ${pages.length}`,

        {

            x:470,

            y:15,

            size:8,

            font,

            color:gray

        }

    );

});

const pdfBytes = await pdf.save();

return pdfBytes;

}