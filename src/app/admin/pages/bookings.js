"use client";

import AdminBookingModal from "@/app/components/modals/adminBookingModal";
import { useEffect, useState } from "react";
import {getAdminInfo, addActivity} from '@/app/services/activity.js';

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [courts, setCourts] = useState([]);
    const [nameFilter, setNameFilter] = useState("");
    const [courtFilter, setCourtFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBookings, setTotalBookings] = useState(0);
    const LIMIT = 10;
    const [loading, setLoading] = useState(false);

    const loadBookings = async () => {
        setLoading(true);

        try{
            const res = await fetch(
                `/api/admin/all-bookings?customerFilter=${encodeURIComponent(nameFilter)}&courtFilter=${encodeURIComponent(courtFilter)}&dateFilter=${encodeURIComponent(dateFilter)}&statusFilter=${encodeURIComponent(statusFilter)}&page=${page}&limit=${LIMIT}`
            );

            if (!res.ok) {
                console.error("Failed to fetch bookings");
                return;
            }

            const data = await res.json();

            setBookings(data.bookings || []);
            setTotalPages(data.totalPages || 1);
            setTotalBookings(data.total || 0);
        }catch(error){
            console.error(error);
        }finally{
            setLoading(false);
        }
    };

    const loadCourtNames = async () => {
        try{
            const res = await fetch(
                `/api/admin/court-management`
            );

            if (!res.ok) {
                console.error("Failed to fetch courts");
                return;
            }

            const data = await res.json();
            setCourts(data.courts || []);
        }catch(error){
            console.error(error);
        }
    }
    
    useEffect (() => {
        loadBookings(); 
        loadCourtNames();
    }, []);

    useEffect(() => {
        if (
            nameFilter === "" &&
            courtFilter === "all" &&
            dateFilter === "" &&
            statusFilter === "" &&
            page === 1
        ) {
            return;
        }
        const timer = setTimeout(() => {
           loadBookings();
        }, 300);

        return () => clearTimeout(timer);

    }, [nameFilter, courtFilter, dateFilter, statusFilter, page]);

    function clearFilters() {
        setNameFilter("");
        setCourtFilter("all");
        setDateFilter("");
        setStatusFilter("all");
        setPage(1);
    }

    async function updateStatus(id, status, remark, activityMessage) {
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

        await loadBookings();
        
        const adminInfo = await getAdminInfo();
        
        if (adminInfo) {
            addActivity(adminInfo.id, activityMessage);
        }
        
    }
    
    const startBooking = totalBookings === 0 ? 0 : (page - 1) * LIMIT + 1;

    const endBooking = Math.min(page * LIMIT, totalBookings);

    useEffect(() => {
        if (page > totalPages && totalPages > 0) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    function formatTime(timeStr) {
        const [hourStr, minuteStr] = timeStr.split(":");
        const hour = parseInt(hourStr, 10);
        const period = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        return `${hour12}:${minuteStr} ${period}`;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Bookings</h1>

                <div className="flex flex-wrap items-center gap-3">

                    <input
                        className="border border-(--border-color) rounded-lg px-3 py-2 flex-1 min-w-45"
                        placeholder="Search customer..."
                        value={nameFilter}
                        onChange={(e) => {
                            setNameFilter(e.target.value);
                            setPage(1);
                        }}
                    />

                    <select
                        className="border border-(--border-color) rounded-lg px-3 py-2"
                        value={courtFilter}
                        onChange={(e) => {
                            setCourtFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="all">All Courts</option>
                        {courts.map((c) => (
                            <option key={c.id} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        className="border border-(--border-color) rounded-lg px-3 py-2"
                        value={dateFilter}
                        onChange={(e) => {
                            setDateFilter(e.target.value);
                            setPage(1);
                        }}
                    />

                    <select
                        className="border border-(--border-color) rounded-lg px-3 py-2"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
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
            </div>

            <div className="overflow-x-auto rounded-xl border border-(--border-color)">

                <table className="w-full">

                    <thead className="bg-(--secondary)">
                        <tr>
                            <th className="p-3 text-center uppercase">Customer</th>
                            <th className="p-3 text-center uppercase">Court</th>
                            <th className="p-3 text-center uppercase">Date</th>
                            <th className="p-3 text-center uppercase">Time</th>
                            <th className="p-3 text-center uppercase">Status</th>
                            <th className="p-3 text-center uppercase">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-6 text-center">
                                    Loading bookings...
                                </td>
                            </tr>
                        ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center">
                                        No bookings found
                                    </td>
                                </tr>
                            ) : (
                            bookings.map((b) => (
                                <tr key={b.id} className="border-t border-(--border-color)">

                                    <td className="p-2 text-center uppercase">{b.booker_name}</td>
                                    <td className="p-2 text-center">{b.court_name}</td>
                                    <td className="p-2 text-center">
                                        {b.booking_date}
                                    </td>
                                    <td className="p-2 text-center">
                                        {formatTime(b.start_time)} - {formatTime(b.end_time)}
                                    </td>
                                    <td className="p-2 text-center capitalize">{b.status}</td>

                                    <td className="p-2 text-center">
                                        <button
                                            onClick={() => setSelectedBooking(b)}
                                            className="bg-(--primary) text-(--white) px-4 py-2 rounded-lg"
                                        >
                                            View
                                        </button>
                                    </td>

                                </tr>
                            ))
                        )
                        }
                    </tbody>
                </table>
            </div>
            
            <div className="flex items-center justify-between mt-5">

                <button
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border border-(--border-color) rounded-lg disabled:opacity-50"
                >
                    Previous
                </button>

                <div className="text-center">
                <p className="font-medium">
                    Page {page} of {totalPages}
                </p>

                <p className="text-sm text-gray-500">
                    Showing {startBooking}–{endBooking} of {totalBookings} bookings
                </p>
            </div>

                <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-(--border-color) rounded-lg disabled:opacity-50"
                >
                    Next
                </button>

            </div>

            <AdminBookingModal
                booking={selectedBooking}
                onClose={() => setSelectedBooking(null)}
                onConfirm={
                    (id, remark, reference) => {
                        updateStatus(id, "confirmed", remark, `Confirmed booking ${reference}.`)
                    }
                }
                onReject={(id, remark, reference) => {
                    updateStatus(id, "rejected", remark, `Rejected booking ${reference}.`)
                }}
            />

        </div>
    );
}