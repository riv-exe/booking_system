"use client";

import AdminBookingModal from "@/app/components/modals/adminBookingModal";
import { useEffect, useMemo, useState } from "react";

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);

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
            booking.booker_name?.toLowerCase().includes(search.toLowerCase());

        const matchesCourt =
            courtFilter === "all" || booking.court_name === courtFilter;

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

    async function updateStatus(id, status) {
        const res = await fetch(`/api/admin/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Failed");
            return;
        }

        setBookings((prev) =>
            prev.map((b) =>
                b.id === id ? { ...b, status } : b
            )
        );
    }

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">Bookings</h1>

            {/* FILTERS */}
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
                        <option key={court} value={court}>
                            {court}
                        </option>
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
                    {hours.map((h) => (
                        <option key={h} value={h}>{h}</option>
                    ))}
                </select>

                <button
                    onClick={clearFilters}
                    className="bg-red-500 px-4 py-2 rounded-lg text-white"
                >
                    Clear
                </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto rounded-xl border">

                <table className="w-full">

                    <thead className="bg-(--secondary)">
                        <tr>
                            <th className="p-4 text-left">Customer</th>
                            <th className="p-4 text-left">Court</th>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-left">Time</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-6 text-center">
                                    No bookings found
                                </td>
                            </tr>
                        ) : (
                            filteredBookings.map((b) => (
                                <tr key={b.id} className="border-t">

                                    <td className="p-4">{b.booker_name}</td>
                                    <td className="p-4">{b.court_name}</td>
                                    <td className="p-4">
                                        {normalizeDate(b.booking_date)}
                                    </td>
                                    <td className="p-4">
                                        {b.start_time.slice(0,5)} - {b.end_time.slice(0,5)}
                                    </td>
                                    <td className="p-4 capitalize">{b.status}</td>

                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => setSelectedBooking(b)}
                                            className="bg-(--primary) px-4 py-2 rounded-lg"
                                        >
                                            View
                                        </button>
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>

                </table>

            </div>

            {/* MODAL */}
            <AdminBookingModal
                booking={selectedBooking}
                onClose={() => setSelectedBooking(null)}
                onConfirm={(id) => updateStatus(id, "confirmed")}
                onReject={(id) => updateStatus(id, "rejected")}
            />

        </div>
    );
}