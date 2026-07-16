"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import DateButtons from "../components/ui/dateButtons";
import BookingDetails from "../components/modals/bookingDetails";
import BookingReceipt from "../components/modals/bookingReceipt";

function hourFromTimeStr(t, isClosing = false) {
    if (!t) return null;

    const hour = parseInt(t.slice(0, 2), 10);

    if (isClosing && hour === 0) {
        return 24;
    }

    return hour;
}

function formatHour(h) {
    return `${String(h).padStart(2, "0")}:00`;
}

export default function Court({ id }) {
    const [user, setUser] = useState(null);
    const [court, setCourt] = useState(null);

    const [bookingDate, setBookingDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const [slots, setSlots] = useState([]);

    const [bookingDetailsIsActive, setBookingDetailsIsActive] = useState(false);
    const [receiptOpen, setReceiptOpen] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    const [userData, setUserData] = useState(null);

    const router = useRouter();
    const pathname = usePathname();

    const hours = useMemo(() => {
        if (!court) return [];

        const open = hourFromTimeStr(court.opening_time);
        const close = hourFromTimeStr(court.closing_time, true);

        if (open === null || close === null || close <= open) return [];

        const arr = [];
        for (let h = open; h < close; h++) {
            arr.push(formatHour(h));
        }
        return arr;
    }, [court]);

    const endHours = useMemo(() => {
        if (!court) return [];

        const open = hourFromTimeStr(court.opening_time);
        const close = hourFromTimeStr(court.closing_time, true);

        if (open === null || close === null || close <= open) return [];

        const arr = [];
        for (let h = open + 1; h <= close; h++) {
            arr.push(formatHour(h));
        }
        return arr;
    }, [court]);

    useEffect(() => {
        if (hours.length && endHours.length) {
            setStartTime((prev) => (prev && hours.includes(prev) ? prev : hours[0]));
            setEndTime((prev) => (prev && endHours.includes(prev) ? prev : endHours[0]));
        }
    }, [hours, endHours]);

    async function getSlots() {
        const res = await fetch(`/api/book?court_id=${id}&date=${bookingDate}`);
        const data = await res.json();
        setSlots(data.slots || []);
    }

    useEffect(() => {
        async function load() {
            const res = await fetch(`/api/courts/${id}`);
            const data = await res.json();

            setCourt(data.courts[0]);
            getSlots();
        }

        load();
    }, []);

    useEffect(() => {
        getSlots();
    }, [bookingDate]);

    useEffect(() => {
        async function getUser() {
            const res = await fetch("/api/auth/me");
            const data = await res.json();

            setUser(data.user);
        }

        getUser();
    }, []);

    function getSlotStatus(hour) {
        const slot = slots.find((s) => s.time === hour);
        return slot ? slot.status : null;
    }

    function changeDate(days) {
        const date = new Date(bookingDate);
        date.setDate(date.getDate() + days);

        setBookingDate(date.toISOString().split("T")[0]);
    }

    function formatTimeLabel(time24) {
        const [hour] = time24.split(":").map(Number);

        const period = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;

        return `${hour12} ${period}`;
    }

    const blockedHours = slots
        .filter((s) => s.status === "confirmed" || s.status === "pending")
        .map((s) => s.time);

    useEffect(() => {
        if (!startTime) return;

        const startIndex = hours.indexOf(startTime);
        if (startIndex === -1) return;

        if (endHours.indexOf(endTime) <= startIndex) {
            setEndTime(endHours[startIndex + 1] ?? endHours[endHours.length - 1]);
        }
    }, [startTime]);

    const validEndHours = endHours.filter((h) => startTime && h > startTime);

    function hasConflict(start, end) {
        const startHour = parseInt(start.slice(0, 2));
        const endHour = parseInt(end.slice(0, 2));

        return blockedHours.some((time) => {
            if (!time) return false;

            const bookedHour = parseInt(time.slice(0, 2));
            const bookedStart = bookedHour;
            const bookedEnd = bookedHour + 1;

            return startHour < bookedEnd && endHour > bookedStart;
        });
    }

    function handleBook() {
        if (!startTime || !endTime) return;

        if (hasConflict(startTime, endTime)) {
            alert("Selected time overlaps with an existing booking.");
            return;
        }

        if (!user?.id) {
            router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        setBookingDetailsIsActive(true);
    }

    const displayDate = new Date(bookingDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const start = startTime ? Number(startTime.split(":")[0]) : 0;
    const end = endTime ? Number(endTime.split(":")[0]) : 0;

    const hoursSelected = Math.max(0, end - start);
    const rate = court?.price || 0;
    const totalPrice = hoursSelected * rate;

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
                <div className="bg-(--secondary) p-6 md:p-8 rounded-2xl border border-(--line-color) flex flex-col">
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
                        Court Availability
                    </h2>

                    {court ? (
                        <div className="bg-background border border-(--line-color) py-4 px-5 rounded-xl flex items-center justify-between">
                            <p className="font-semibold text-lg">{court?.name}</p>
                            <div className="text-right">
                                <p className="text-sm opacity-60">₱{rate} / hour</p>
                                <p className="text-xs opacity-40">
                                    Open {formatTimeLabel(hours[0] || "00:00")} – {formatTimeLabel(endHours[endHours.length - 1] || "00:00")}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-background border border-(--line-color) py-4 px-5 rounded-xl h-13 animate-pulse" />
                    )}

                    <div className="bg-background border border-(--line-color) py-3 px-4 rounded-xl flex justify-between items-center mt-3">
                        <button
                            onClick={() => changeDate(-1)}
                            aria-label="Previous day"
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-(--line-color) transition-colors cursor-pointer"
                        >
                            ‹
                        </button>
                        <p className="font-medium text-sm md:text-base">{displayDate}</p>
                        <button
                            onClick={() => changeDate(1)}
                            aria-label="Next day"
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-(--line-color) transition-colors cursor-pointer"
                        >
                            ›
                        </button>
                    </div>

                    <div className="flex items-center gap-5 mt-5 mb-3 text-xs opacity-60">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-(--primary)/70" />
                            Available
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-(--shuttle) live-dot " />
                            Pending
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-(--foreground)/25" />
                            Booked
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 flex-1">
                        {hours.length ? (
                            hours.map((hour) => (
                                <DateButtons
                                    key={hour}
                                    time={formatTimeLabel(hour)}
                                    status={getSlotStatus(hour)}
                                />
                            ))
                        ) : (
                            <p className="text-sm opacity-50 col-span-full">Loading court hours…</p>
                        )}
                    </div>
                </div>

                <div className="bg-(--secondary) p-6 md:p-8 rounded-2xl border border-(--line-color) flex flex-col">
                    <h2 className="font-display text-2xl font-bold mb-6">Book this Court</h2>

                    <div className="flex flex-col gap-4">
                        <div className="p-4 bg-background border border-(--line-color) rounded-xl">
                            <p className="text-xs opacity-50 mb-1">Standard Rate</p>
                            <p className="text-xl font-bold">
                                ₱{rate}
                                <span className="text-sm font-normal opacity-60"> / hour</span>
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs opacity-60">Booking Date</label>
                            <input
                                type="date"
                                className="bg-background border border-(--line-color) py-2.5 px-4 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--primary)/50"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs opacity-60">Pick a time slot</label>

                            <div className="flex gap-3">
                                <div className="bg-background border border-(--line-color) py-2.5 px-4 rounded-xl w-full">
                                    <label className="text-[11px] opacity-50">Start</label>
                                    <select
                                        value={startTime || ""}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="bg-transparent w-full text-sm font-medium focus:outline-none cursor-pointer mt-0.5"
                                        disabled={!hours.length}
                                    >
                                        {hours.map((h) => (
                                            <option key={h} value={h}>
                                                {formatTimeLabel(h)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="bg-background border border-(--line-color) py-2.5 px-4 rounded-xl w-full">
                                    <label className="text-[11px] opacity-50">End</label>
                                    <select
                                        value={endTime || ""}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="bg-transparent w-full text-sm font-medium focus:outline-none cursor-pointer mt-0.5"
                                        disabled={!validEndHours.length}
                                    >
                                        {validEndHours.map((h) => (
                                            <option key={h} value={h}>
                                                {formatTimeLabel(h)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1" />

                    <div className="flex flex-col gap-4 pt-6">
                        <div className="border-t border-(--line-color) pt-4 flex flex-col gap-1.5 text-sm">
                            <div className="flex justify-between opacity-60">
                                <span>{hoursSelected} hr{hoursSelected !== 1 ? "s" : ""} × ₱{rate}</span>
                                <span>₱{totalPrice}</span>
                            </div>
                            <div className="flex justify-between font-bold text-base pt-1">
                                <span>Total</span>
                                <span>₱{totalPrice}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleBook}
                            disabled={!startTime || !endTime}
                            className="bg-(--primary) text-(--white) hover:brightness-110 transition-all p-3.5 rounded-xl font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>

            {bookingDetailsIsActive && (
                <BookingDetails
                    isActive={setBookingDetailsIsActive}
                    userId={user?.id}
                    userName={user?.name}
                    userEmail={user?.email}
                    userContactNum={user?.contact_num}
                    price={totalPrice}
                    courtId={id}
                    court={court}
                    bookingDate={bookingDate}
                    startTime={startTime}
                    endTime={endTime}
                    getSlots={getSlots}
                    setReceiptOpen={setReceiptOpen}
                    setReceiptData={setReceiptData}
                    setUserData={setUserData}
                />
            )}

            <BookingReceipt
                isOpen={receiptOpen}
                setIsOpen={setReceiptOpen}
                booking={receiptData?.booking}
                booker={receiptData?.booker}
                reference={receiptData?.reference}
                court={court}
                user={userData}
                price={totalPrice}
            />
        </div>
    );
}