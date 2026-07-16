"use client";

import { useEffect, useMemo, useState } from "react";

function hourFromTimeStr(t, isClosing = false) {
    if (!t) return null;

    const hour = parseInt(t.slice(0, 2), 10);

    if (isClosing && hour === 0) {
        return 24;
    }

    return hour;
}

function formatHourLabel(h) {
    return `${String(h).padStart(2, "0")}:00`;
}

export default function AdminCourtSchedule() {
    const [courts, setCourts] = useState([]);
    const [bookings, setBookings] = useState({});

    const [bookingDate, setBookingDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [selectedCourt, setSelectedCourt] = useState("all");
    const [searchName, setSearchName] = useState("");

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

    const visibleCourts = courts.filter((court) =>
        selectedCourt === "all" ? true : court.id.toString() === selectedCourt
    );

    const hours = useMemo(() => {
        if (!visibleCourts.length) return [];

        let minOpen = null;
        let maxClose = null;

        visibleCourts.forEach((court) => {
            const open = hourFromTimeStr(court.opening_time);
            const close = hourFromTimeStr(court.closing_time, true);

            if (open === null || close === null) return;

            if (minOpen === null || open < minOpen) minOpen = open;
            if (maxClose === null || close > maxClose) maxClose = close;
        });

        if (minOpen === null || maxClose === null || maxClose <= minOpen) return [];

        const arr = [];
        for (let h = minOpen; h < maxClose; h++) {
            arr.push(formatHourLabel(h));
        }
        return arr;
    }, [visibleCourts]);

    function isCourtOpenAt(court, hour) {
        const open = hourFromTimeStr(court.opening_time);
        const close = hourFromTimeStr(court.closing_time, true);
        const h = hourFromTimeStr(hour);

        if (open === null || close === null) return false;

        return h >= open && h < close;
    }

    const isToday = bookingDate === new Date().toISOString().split("T")[0];
    const currentHourLabel = `${new Date().getHours().toString().padStart(2, "0")}:00`;

    const formattedDate = new Date(bookingDate + "T00:00:00").toLocaleDateString(
        "en-US",
        { weekday: "long", month: "long", day: "numeric" }
    );

    return (
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto">

            <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-(--foreground)">
                        Court schedule
                    </h1>
                    <p className="text-sm text-(--muted) mt-1">
                        {formattedDate}{isToday && (
                            <span className="ml-2 inline-flex items-center gap-1.5 text-(--primary)">
                                <span className="w-1.5 h-1.5 rounded-full bg-(--primary) live-dot" />
                                Today
                            </span>
                        )}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2.5 items-center">

                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--muted-2)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search customer"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="bg-(--secondary) border border-(--line-color) rounded-xl pl-9 pr-3 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-2) w-48 focus:outline-none focus:ring-2 focus:ring-(--primary)/30 focus:border-(--primary) transition"
                        />
                    </div>

                    <select
                        value={selectedCourt}
                        onChange={(e) => setSelectedCourt(e.target.value)}
                        className="bg-(--secondary) border border-(--line-color) rounded-xl px-3 py-2.5 text-sm text-(--foreground) w-40 focus:outline-none focus:ring-2 focus:ring-(--primary)/30 focus:border-(--primary) transition cursor-pointer"
                    >
                        <option value="all">All courts</option>
                        {courts.map((court) => (
                            <option key={court.id} value={court.id}>
                                {court.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="bg-(--secondary) border border-(--line-color) rounded-xl px-3 py-2.5 text-sm text-(--foreground) w-40 focus:outline-none focus:ring-2 focus:ring-(--primary)/30 focus:border-(--primary) transition"
                    />

                    <button
                        onClick={clearFilters}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium text-(--muted) border border-(--line-color) hover:text-(--foreground) hover:border-(--primary) transition"
                    >
                        Clear
                    </button>

                </div>
            </div>

            <div className="flex items-center gap-5 mt-5 mb-3 text-xs opacity-60">
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-(--foreground)/25" />
                    Available
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-(--shuttle) live-dot " />
                    Pending
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-(--primary)/70" />
                    Booked
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-(--muted-2)/40" />
                    Closed
                </span>
            </div>

            <div className="rounded-2xl border border-(--line-color) bg-(--secondary) overflow-hidden">
                <div className="overflow-x-auto">
                    <div
                        className="grid min-w-[640px]"
                        style={{
                            gridTemplateColumns: `84px repeat(${Math.max(visibleCourts.length, 1)}, minmax(150px, 1fr))`
                        }}
                    >
                        <div className="sticky top-0 left-0 z-20 bg-(--secondary) border-b border-r border-(--line-color)" />

                        {visibleCourts.map((court) => (
                            <div
                                key={court.id}
                                className="sticky top-0 z-10 bg-(--secondary) border-b border-r border-(--line-color) last:border-r-0 px-4 py-3.5 text-center"
                            >
                                <span className="text-sm font-medium text-(--foreground)">
                                    {court.name}
                                </span>
                                <p className="text-[10px] text-(--muted-2) mt-0.5">
                                    {court.opening_time?.slice(0, 5)} – {court.closing_time?.slice(0, 5)}
                                </p>
                            </div>
                        ))}

                        {hours.length === 0 && (
                            <div className="col-span-full px-4 py-8 text-center text-sm text-(--muted-2)">
                                No courts to display.
                            </div>
                        )}

                        {hours.map((hour) => {
                            const isCurrentHour = isToday && hour === currentHourLabel;

                            return (
                                <div key={hour} className="contents">

                                    <div
                                        className={`sticky left-0 z-10 border-b border-r border-(--line-color) px-3 py-3 text-xs flex items-center justify-end ${
                                            isCurrentHour
                                                ? "bg-(--accent-bg) text-(--primary) font-medium"
                                                : "bg-(--secondary) text-(--muted-2)"
                                        }`}
                                    >
                                        {hour}
                                    </div>

                                    {visibleCourts.map((court) => {
                                        const courtOpen = isCourtOpenAt(court, hour);
                                        const booking = courtOpen ? getSlot(court.id, hour) : null;
                                        const isPending = booking?.status === "pending";

                                        const matchesName =
                                            !searchName ||
                                            (booking &&
                                                booking.name
                                                    .toLowerCase()
                                                    .includes(searchName.toLowerCase()));

                                        if (!courtOpen) {
                                            return (
                                                <div
                                                    key={`${court.id}-${hour}`}
                                                    className="relative border-b border-r border-(--line-color) last:border-r-0 p-1.5 min-h-[60px] bg-(--muted-2)/5"
                                                >
                                                    <div className="h-full rounded-lg flex items-center justify-center">
                                                        <span className="text-(--muted-2) text-[11px] opacity-50">
                                                            Closed
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div
                                                key={`${court.id}-${hour}`}
                                                className={`relative border-b border-r border-(--line-color) last:border-r-0 p-1.5 min-h-[60px] bg-(--background) transition-opacity ${
                                                    isCurrentHour ? "bg-(--accent-bg)" : ""
                                                } ${searchName && !matchesName ? "opacity-25" : ""}`}
                                            >
                                                {booking ? (
                                                    isPending ? (
                                                        <div className="h-full rounded-lg bg-(--pending-bg) text-(--shuttle) px-2.5 py-1.5 flex flex-col items-center justify-center gap-0.5 hover:border-(--shuttle) transition cursor-default">
                                                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-(--pending-text) font-medium">
                                                                Pending
                                                            </span>
                                                            <span className="font-medium text-(--pending-text) text-xs leading-tight truncate">
                                                                {booking.name}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="h-full rounded-lg bg-(--danger-bg) text-(--primary) px-2.5 py-1.5 flex flex-col items-center justify-center gap-0.5 hover:border-(--danger) transition cursor-default">
                                                            <span className="font-medium text-xs leading-tight truncate">
                                                                {booking.name}
                                                            </span>
                                                            <span className="text-[11px] truncate">
                                                                {booking.contact}
                                                            </span>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="h-full rounded-lg flex items-center justify-center hover:bg-(--success-bg) transition cursor-default group">
                                                        <span className="text-(--success-text) text-[11px] opacity-70 group-hover:opacity-100 transition">
                                                            Open
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>
    );
}