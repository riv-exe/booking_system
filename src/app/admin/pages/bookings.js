"use client";

import AdminBookingModal from "@/app/components/modals/adminBookingModal";
import { useEffect, useMemo, useState } from "react";

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [courtNames, setCourtNames] = useState([]);
    const [nameFilter, setNameFilter] = useState("");
    const [courtFilter, setCourtFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");


    useEffect(() => {
        const timer = setTimeout(async () => {
            const res = await fetch(
                `/api/admin/all-bookings?customerFilter=${encodeURIComponent(nameFilter)}&courtFilter=${encodeURIComponent(courtFilter)}&dateFilter=${encodeURIComponent(dateFilter)}&statusFilter=${encodeURIComponent(statusFilter)}`
            );

            const data = await res.json();

            setBookings(data.bookings || []);
            setCourtNames(data.courtNames || []);
        }, 300);

        return () => clearTimeout(timer);

    }, [nameFilter, courtFilter, dateFilter, statusFilter]);

    function clearFilters() {
        setNameFilter("");
        setCourtFilter("all");
        setDateFilter("");
        setStatusFilter("all");
    }

    async function updateStatus(id, status, remark) {
        const res = await fetch(`/api/admin/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, remark }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Failed");
            return;
        }

        setBookings((prev) =>
            prev.map((b) =>
                b.id === id ? { ...b, status, remark } : b
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
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />

                <select
                    className="border rounded-lg px-3 py-2"
                    value={courtFilter}
                    onChange={(e) => setCourtFilter(e.target.value)}
                >
                    <option value="all">All Courts</option>
                    {courtNames.map((c) => (
                        <option key={c.id} value={c.name}>
                            {c.name}
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
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Bookings</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
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
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-6 text-center">
                                    No bookings found
                                </td>
                            </tr>
                        ) : (
                            bookings.map((b) => (
                                <tr key={b.id} className="border-t">

                                    <td className="p-4">{b.booker_name}</td>
                                    <td className="p-4">{b.court_name}</td>
                                    <td className="p-4">
                                        {b.booking_date}
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
                onConfirm={(id, remark) => updateStatus(id, "confirmed", remark)}
                onReject={(id, remark) => updateStatus(id, "rejected", remark)}
            />

        </div>
    );
}