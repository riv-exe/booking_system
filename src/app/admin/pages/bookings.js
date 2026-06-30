"use client";

import { useEffect, useMemo, useState } from "react";

export default function Bookings() {
    const [bookings, setBookings] = useState([]);

    const [search, setSearch] = useState("");
    const [courtFilter, setCourtFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");
    const [timeFilter, setTimeFilter] = useState("all");

    const hours = [
        "06:00","07:00","08:00","09:00","10:00",
        "11:00","12:00","13:00","14:00","15:00",
        "16:00","17:00"
    ];

    useEffect(() => {
        async function loadBookings() {
            const res = await fetch("/api/admin/all-bookings");
            const data = await res.json();
            setBookings(data.bookings || []);
        }
        loadBookings();
    }, []);

    const courts = useMemo(() => {
        return [...new Set(bookings.map((b) => b.court_name))];
    }, [bookings]);

    const normalizeDate = (date) => {
        if (!date) return "";
        return new Date(date).toISOString().split("T")[0];
    };

    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch =
            booking.booker_name
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesCourt =
            courtFilter === "all" ||
            booking.court_name === courtFilter;

        const matchesDate =
            dateFilter === "" ||
            normalizeDate(booking.booking_date) === dateFilter;

        const matchesTime =
            timeFilter === "all" ||
            booking.start_time.slice(0, 5) === timeFilter;

        return matchesSearch && matchesCourt && matchesDate && matchesTime;
    });

    function clearFilters() {
        setSearch("");
        setCourtFilter("all");
        setDateFilter("");
        setTimeFilter("all");
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Bookings</h1>

            <div className="flex flex-wrap gap-3 mb-6">

                <input
                    className="border rounded-lg px-3 py-2"
                    placeholder="Search customer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border rounded-lg px-3 py-2"
                    value={courtFilter}
                    onChange={(e) => setCourtFilter(e.target.value)}
                >
                    <option value="all">All Courts</option>
                    {courts.map((court) => (
                        <option key={court} value={court} className="bg-background border border-gray-700 py-2 px-5 rounded-2xl w-full">{court}</option>
                    ))}
                </select>

                <input
                    type="date"
                    className="border rounded-lg px-3 py-2"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                />

                <select
                    className="border rounded-lg px-3 py-2"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                >
                    <option value="all">All Times</option>
                    {hours.map((hour) => (
                        <option key={hour} value={hour} className="bg-background border border-gray-700 py-2 px-5 rounded-2xl w-full">{hour}</option>
                    ))}
                </select>

                <button
                    onClick={clearFilters}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white"
                >
                    Clear Filters
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl border">

                <table className="w-full">

                    <thead className="bg-(--secondary)">
                        <tr>
                            <th className="text-left p-4">Customer</th>
                            <th className="text-left p-4">Court</th>
                            <th className="text-left p-4">Date</th>
                            <th className="text-left p-4">Time</th>
                            <th className="text-left p-4">Contact</th>
                            <th className="text-center p-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filteredBookings.length === 0 ? (
                            <tr>
                                <td className="text-center p-8" colSpan={6}>
                                    No bookings found
                                </td>
                            </tr>
                        ) : (
                            filteredBookings.map((booking) => (
                                <tr key={booking.id} className="border-t">
                                    <td className="p-4">{booking.booker_name}</td>
                                    <td className="p-4">{booking.court_name}</td>
                                    <td className="p-4">{normalizeDate(booking.booking_date)}</td>
                                    <td className="p-4">
                                        {booking.start_time.slice(0,5)} - {booking.end_time.slice(0,5)}
                                    </td>
                                    <td className="p-4">{booking.contact_no}</td>
                                    <td className="p-4 text-center">
                                        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </div>
        </div>
    );
}