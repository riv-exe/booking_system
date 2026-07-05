"use client";

import { useEffect, useState } from "react";
import DateButtons from "../components/ui/dateButtons";
import BookingDetails from "../components/modals/bookingDetails";
import BookingReceipt from "../components/modals/bookingReceipt";

export default function Court({ id }) {
    const [user, setUser] = useState(null);
    const [court, setCourt] = useState(null);

    const [bookingDate, setBookingDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [startTime, setStartTime] = useState("06:00");
    const [endTime, setEndTime] = useState("07:00");

    const [slots, setSlots] = useState([]);

    const [bookingDetailsIsActive, setBookingDetailsIsActive] = useState(false);
    const [receiptOpen, setReceiptOpen] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    const [userData, setUserData] = useState(null);

    const hours = [
        "06:00","07:00","08:00","09:00","10:00",
        "11:00","12:00","13:00","14:00","15:00",
        "16:00","17:00"
    ];

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
            console.log(data.user);
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

    // safe blocked slots
    const blockedHours = slots
        .filter(s => s.status === "confirmed" || s.status === "pending")
        .map(s => s.time);

    // FIX 1: prevent invalid end time
    useEffect(() => {
        const startIndex = hours.indexOf(startTime);
        const endIndex = hours.indexOf(endTime);

        if (endIndex <= startIndex) {
            setEndTime(hours[startIndex + 1] || startTime);
        }
    }, [startTime]);

    const startIndex = hours.indexOf(startTime);

    // FIX 2: valid end times
    const validEndHours = hours.filter((h, idx) => {
        if (idx <= startIndex) return false;
        return true;
    });

    // FIX 3: safe conflict detection (NO slice crash)
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
        if (hasConflict(startTime, endTime)) {
            alert("Selected time overlaps with an existing booking.");
            return;
        }

        setBookingDetailsIsActive(true);
    }

    const displayDate = new Date(bookingDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const start = parseInt(startTime.slice(0, 2));
    const end = parseInt(endTime.slice(0, 2));
    const totalPrice = Math.max(0, end - start) * court?.price;

    return (
        <div className="px-5 py-10">

            <div className="flex items-start gap-5">

                {/* LEFT */}
                <div className="w-[65vw] bg-(--secondary) p-5 rounded-2xl border border-gray-700">

                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold">Court Availability</p>
                    </div>

                    <div className="bg-background border border-gray-700 py-3 px-5 rounded-2xl mt-3">
                        <p>{court?.name}</p>
                    </div>

                    <div className="bg-background border border-gray-700 py-3 px-5 rounded-2xl flex justify-between items-center mt-3">
                        <button onClick={() => changeDate(-1)}>&lt;</button>
                        <p>{displayDate}</p>
                        <button onClick={() => changeDate(1)}>&gt;</button>
                    </div>

                    <div className="grid grid-cols-4 gap-5 mt-4">
                        {hours.map((hour) => (
                            <DateButtons
                                key={hour}
                                time={formatTimeLabel(hour)}
                                status={getSlotStatus(hour)}
                            />
                        ))}
                    </div>

                </div>

                {/* RIGHT */}
                <div className="w-[35vw] bg-(--secondary) p-5 rounded-2xl border border-gray-700 flex flex-col gap-5">

                    <p className="text-2xl font-bold">Book this Court</p>

                    <div className="flex flex-col gap-3">
                        <p className="font-semibold">Booking Date</p>
                        <input
                            type="date"
                            className="bg-[var(--background)] border border-gray-700 py-2 px-5 rounded-2xl cursor-pointer"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <p className="font-semibold">Pick a time slot</p>

                        <div className="flex gap-5">

                            {/* START */}
                            <div className="bg-background border border-gray-700 py-2 px-5 rounded-2xl w-full">
                                <label>Start Time</label>
                                <select
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="bg-background border border-gray-700 py-2 px-5 rounded-2xl w-full"
                                >
                                    {hours.map((h) => (
                                        <option
                                            key={h}
                                            value={h}
                                            // disabled={blockedHours.includes(h)}
                                        >
                                            {formatTimeLabel(h)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* END */}
                            <div className="bg-background border border-gray-700 py-2 px-5 rounded-2xl w-full">
                                <label>End Time</label>
                                <select
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="bg-background border border-gray-700 py-2 px-5 rounded-2xl w-full"
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

                    <div className="bg-(--primary) p-3 rounded-2xl flex justify-center">
                        <button onClick={handleBook}>
                            Book Now
                        </button>
                    </div>

                </div>

            </div>

            {/* MODALS */}
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