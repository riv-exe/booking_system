"use client";
import {useState, useEffect} from "react";
export default function Sales() {
    const [filter, setFilter] = useState("this_month");
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0);
    const [averageBooking, setAverageBooking] = useState(0);
    const [bestPerformingCourt, setBestPerformingCourt] = useState("-");

    const [courtRevenueData, setCourtRevenueData] = useState([]);
    const [peakHoursData, setPeakHoursData] = useState([]);
    const [recentTransactionsData, setRecentTransactionsData] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const getFilterData = async () => {
            setLoading(true);
        try{
            const res = await fetch(`/api/admin/sales?filter=${filter}`);
            const data = await res.json();

            if(!res.ok){
                console.error(data.message || "Failed to fetch sales data");
                return;
            }

            setTotalRevenue(Number(data.salesData.total_revenue));
            setTotalBookings(data.salesData.total_bookings);
            setAverageBooking(Number(data.salesData.average_booking));
            setBestPerformingCourt(data.salesData.best_court);

            setCourtRevenueData(data.courtRevenueData);
            setPeakHoursData(data.peakHoursData);
            setRecentTransactionsData(data.recentTransactionsData);

        }catch(err){
            console.error(err);
        }finally{
            setLoading(false);
        }
    };

    useEffect(function () {
        getFilterData();
    }, [filter]);

    const amHours = peakHoursData.filter(function (hour) {
        return Number(hour.hour_slot.substring(0, 2)) < 12;
    });

    const pmHours = peakHoursData.filter(function (hour) {
        return Number(hour.hour_slot.substring(0, 2)) >= 12;
    });

    const filteredTransactions = recentTransactionsData.filter((transaction) =>
        transaction.customer_name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    const today = new Date().toISOString().split("T")[0];

    const exportPDF = async () => {

        const response = await fetch(
            `/api/admin/sales/pdf?filter=${filter}`
        );


        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = `IDS_sales_report_${today}.pdf`;

        link.click();

        window.URL.revokeObjectURL(url);

    };

    const exportExcel = async () => {

        const response = await fetch(
            `/api/admin/sales/excel?filter=${filter}`
        );

        const blob = await response.blob();

        const url =
            window.URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download = `IDS_sales_report_${today}.xlsx`;

        link.click();

        window.URL.revokeObjectURL(url);

    };
    return (
        <div className="p-6 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Sales Report</h1>

                <div className="flex gap-2">
                    <select 
                        className="border rounded-lg px-3 py-2" 
                        value={filter} 
                        onChange={(e) => {setFilter(e.target.value)}}>
                        <option value="this_month">This Month</option>
                        <option value="this_week">This Week</option>
                        <option value="today">Today</option>
                        <option value="this_year">This Year</option>
                    </select>

                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={exportPDF}>
                        Export PDF
                    </button>

                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    onClick={exportExcel}>
                        Export Excel
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 ">
                <div className="rounded-xl p-5 bg-[var(--secondary)] border">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <h2 className="text-3xl font-bold mt-2">₱{totalRevenue?.toFixed(2) || "0.00"}</h2>
                </div>

                <div className="bg-[var(--secondary)] border rounded-xl p-5">
                    <p className="text-sm text-gray-500">Total Confirmed Bookings</p>
                    <h2 className="text-3xl font-bold mt-2">{totalBookings || "0"}</h2>
                </div>

                <div className="bg-[var(--secondary)] border rounded-xl p-5">
                    <p className="text-sm text-gray-500">Average Booking</p>
                    <h2 className="text-3xl font-bold mt-2">₱{averageBooking?.toFixed(2) || "0.00"}</h2>
                </div>

                <div className="bg-[var(--secondary)] border rounded-xl p-5">
                    <p className="text-sm text-gray-500">Best Performing Court</p>
                    <h2 className="text-2xl font-bold mt-2">{bestPerformingCourt || "-"}</h2>
                </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[var(--secondary)] border rounded-xl p-5">
                    <h2 className="text-lg font-semibold mb-4">
                        Revenue by Court
                    </h2>

                    <div className="space-y-3">
                        {courtRevenueData.length === 0 ? (
                            <div className="flex justify-between">
                                <span>Court 1</span>
                                <span>₱0</span>
                            </div>
                        ) : (
                            courtRevenueData.map((c) => (
                            <div className="flex justify-between" key={c.court_id}>
                                <span>{c.court_name}</span>
                                <span>₱{Number(c.total_revenue).toFixed(2)}</span>
                            </div>
                            ))
                        )}
                        

                    </div>
                </div>

                <div className="bg-[var(--secondary)] border rounded-xl p-5">
                    <h2 className="text-lg font-semibold mb-4">
                        Peak Hours
                    </h2>
                    <div className="flex w-full justify-between ">
                        {peakHoursData.length === 0 ? (
                            <>
                                {/* AM */}
                        <div className="space-y-3">
                            <div className="flex justify-between w-50">
                                <span>6:00 AM</span>
                                <span>0 Bookings</span>
                            </div>
                        </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-3">
                                    <div className="space-y-3">
                                        {amHours.map(function (hour) {
                                            return (
                                                <div
                                                    key={hour.hour_slot}
                                                    className="flex justify-between w-50"
                                                >
                                                    <span>
                                                        {new Date(
                                                            "2000-01-01T" + hour.hour_slot
                                                        ).toLocaleTimeString([], {
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>

                                                    <span>{hour.total_bookings} Bookings</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-3">
                                        {pmHours.map(function (hour) {
                                            return (
                                                <div
                                                    key={hour.hour_slot}
                                                    className="flex justify-between w-50"
                                                >
                                                    <span>
                                                        {new Date(
                                                            "2000-01-01T" + hour.hour_slot
                                                        ).toLocaleTimeString([], {
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>

                                                    <span>{hour.total_bookings} Bookings</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-[var(--secondary)] border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                        Recent Transactions
                    </h2>

                    <input
                        type="text"
                        placeholder="Search customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr >
                                <th className="text-center p-3">Date</th>
                                <th className="text-center p-3">Reference</th>
                                <th className="text-center p-3">Customer</th>
                                <th className="text-center p-3">Court</th>
                                <th className="text-center p-3">Booking Schedule</th>
                                <th className="text-center p-3">Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center py-8"
                                    >
                                        Loading records...
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((transaction) => (
                                        <tr
                                            key={transaction.reference_code}
                                            className="border-t"
                                        >
                                            <td className="text-center">
                                                {new Date(transaction.created_at).toLocaleString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}
                                            </td>

                                            <td className="text-center p-3">
                                                {transaction.reference_code}
                                            </td>

                                            <td className="text-center uppercase">
                                                {transaction.customer_name}
                                            </td>

                                            <td className="text-center">
                                                {transaction.court_name}
                                            </td>

                                            <td className="text-center">
                                                    {new Date(
                                                        transaction.booking_date
                                                    ).toLocaleDateString("en-US", {
                                                        weekday: "long",
                                                    })}, &nbsp;
                                                    {new Date(
                                                        transaction.booking_date
                                                    ).toLocaleDateString("en-US", {
                                                        month: "long",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })},  &nbsp;
                                                    {new Date(
                                                        `1970-01-01T${transaction.start_time}`
                                                    ).toLocaleTimeString("en-US", {
                                                        hour: "numeric",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })}{" "}
                                                    -{" "}
                                                    {new Date(
                                                        `1970-01-01T${transaction.end_time}`
                                                    ).toLocaleTimeString("en-US", {
                                                        hour: "numeric",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })}
                                            </td>

                                            <td className="text-center">
                                                ₱{Number(transaction.revenue).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center py-8"
                                        >
                                            No transactions found.
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}