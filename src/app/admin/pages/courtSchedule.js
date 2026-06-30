"use client";

import { useEffect, useState } from "react";

export default function AdminCourtSchedule() {
    const [courts, setCourts] = useState([]);
    const [bookings, setBookings] = useState({});

    const [bookingDate, setBookingDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [selectedCourt, setSelectedCourt] = useState("all");
    const [searchName, setSearchName] = useState("");

    const hours = [
        "06:00","07:00","08:00","09:00","10:00",
        "11:00","12:00","13:00","14:00","15:00",
        "16:00","17:00"
    ];

    useEffect(() => {
        async function fetchCourts() {
            const res = await fetch("/api/courts");
            const data = await res.json();
            setCourts(data.courts);
        }

        fetchCourts();
    }, []);

    useEffect(() => {
        async function fetchBookings() {
            const res = await fetch(`/api/admin/bookings?date=${bookingDate}`);
            const data = await res.json();
            setBookings(data.bookings || {});
        }

        fetchBookings();
    }, [bookingDate]);

    function getSlot(courtId, hour) {
        return bookings?.[courtId]?.[hour];
    }

    function clearFilters() {
        setSelectedCourt("all");
        setSearchName("");
        setBookingDate(new Date().toISOString().split("T")[0]);
    }

    return (
        <div className="p-6 overflow-x-hidden">

            <div className="flex flex-wrap justify-between items-center mb-6 gap-4 w-full">

                <h1 className="text-2xl font-bold whitespace-nowrap">
                    Court Schedule
                </h1>

                <div className="flex flex-wrap gap-3 items-center">

                    <select
                        value={selectedCourt}
                        onChange={(e) => setSelectedCourt(e.target.value)}
                        className="border px-3 py-2 rounded-lg w-40"
                    >
                        <option value="all">All Courts</option>

                        {courts.map((court) => (
                            <option key={court.id} value={court.id} className="bg-background border border-gray-700 py-2 px-5 rounded-2xl w-full">
                                {court.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Search name..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="border px-3 py-2 rounded-lg w-48"
                    />

                    <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="border px-3 py-2 rounded-lg w-44"
                    />

                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                    >
                        Clear
                    </button>

                </div>
            </div>

            <div className="flex flex-col gap-6">

                {courts
                    .filter((court) =>
                        selectedCourt === "all"
                            ? true
                            : court.id.toString() === selectedCourt
                    )
                    .map((court) => (
                        <div
                            key={court.id}
                            className="border rounded-2xl p-4 bg-(--secondary)"
                        >

                            <h2 className="font-bold text-lg mb-3">
                                {court.name}
                            </h2>

                            <div className="grid grid-cols-1 gap-2">

                                {hours.map((hour) => {

                                    const booking = getSlot(court.id, hour);

                                    const matchesName =
                                        !searchName ||
                                        (booking &&
                                            booking.name
                                                .toLowerCase()
                                                .includes(searchName.toLowerCase()));

                                    if (!matchesName) return null;

                                    return (
                                        <div
                                            key={hour}
                                            className="flex justify-between px-4 py-2 rounded-lg bg-background border border-gray-700 "
                                        >
                                            <span>{hour}</span>

                                            <span
                                                className={
                                                    booking
                                                        ? "text-red-400"
                                                        : "text-green-400"
                                                }
                                            >
                                                {booking ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">
                                                            {booking.name}
                                                        </span>
                                                        <span className="text-xs opacity-70">
                                                            {booking.contact}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    "Available"
                                                )}
                                            </span>
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}