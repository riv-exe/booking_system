"use client"

import { useEffect, useState } from "react";
import DateButtons from "../components/ui/dateButtons"

export default function Court({ id }) {
    const [court, setCourt] = useState(null);
    const [bookingDate, setBookingDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const hours = [
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
    ];
    const [bookedHours, setBookedHours] = useState([]);

    async function getBookedSlots() {
        const res = await fetch(`/api/book?court_id=${id}&date=${bookingDate}`);
        const data = await res.json();
        setBookedHours(data.bookedHours);
        console.log(data);
    }
    
    useEffect(() => {
        async function loadUsers() {
            const res = await fetch(`/api/courts/${id}`);
            const data = await res.json();
            console.log(data);
            setCourt(data.courts[0]);
            getBookedSlots();
        }

        loadUsers();
    }, []);

    useEffect(() => {
        async function refreshBookedSlots() {
            getBookedSlots();
        }

        refreshBookedSlots();
    }, [bookingDate]);

    function isBooked(hour) {
        return bookedHours.includes(hour);
    }

    async function bookingSubmit() {
        const formatTime = (t) => `${t}:00`;
        const res = await fetch("/api/book", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
                user_id: 1,
                court_id: id,
                booking_date: bookingDate,
                start_time: formatTime(startTime),
                end_time: formatTime(endTime),
            })
        })

        getBookedSlots();
    }

    function changeDate(days) {
        const date = new Date(bookingDate);
        date.setDate(date.getDate() + days);
        setBookingDate(date.toISOString().split("T")[0]);
    }

    const displayDate = new Date(bookingDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    function formatTimeLabel(time24) {
        const [hour] = time24.split(":").map(Number);

        const period = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;

        return `${hour12} ${period}`;
    }

    return (
        <div className="px-5 py-10">
            <div className="flex items-start gap-5">
                <div className="w-[65vw] bg-(--secondary) p-5 rounded-2xl border border-gray-700 flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold">Court Availability</p>
                        <div className="flex gap-2">
                            <div className="bg-(--primary) px-2 py-1 text-xs rounded-full">Available</div>
                            <div className="bg-red-700 px-2 py-1 text-xs rounded-full">Occupied</div>
                            <div className="bg-yellow-600 px-2 py-1 text-xs rounded-full">Selected</div>
                        </div>
                    </div>
                    <div className="bg-background border border-gray-700 py-3 px-5 my-2 rounded-2xl cursor-pointer">
                        <p>{court?.name}</p>
                    </div>
                    <div className="bg-background border border-gray-700 py-3 px-5 rounded-2xl flex justify-between items-center">
                        <button
                            onClick={() => changeDate(-1)}
                            className="cursor-pointer"
                        >
                            &lt;
                        </button>

                        <p>{displayDate}</p>

                        <button
                            onClick={() => changeDate(1)}
                            className="cursor-pointer"
                        >
                            &gt;
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-5">
                        {hours.map((hour) => (
                        <DateButtons
                            key={hour}
                            time={hour}
                            isBooked={isBooked(hour)}
                        />
                        ))}
                    </div>
            </div>
                <div className="w-[35vw] bg-(--secondary) p-5 rounded-2xl border border-gray-700 flex flex-col gap-5">
                    <p className="text-2xl font-bold">Book this Court</p>
                    <div className="p-5 bg-background rounded-2xl flex flex-col gap-2">
                        <p>Standard Rate</p>
                        <p className="text-xl font-semibold">₱{court?.price} / hour</p>
                    </div>
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
                            <div className="bg-background border border-gray-700 py-2 px-5 rounded-2xl w-full cursor-pointer">
                                <label>Start Time</label>
                                <select
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="bg-background border border-gray-700 py-2 px-5 rounded-2xl w-full"
                                    >
                                    {hours.map((h) => (
                                        <option key={h} value={h}>
                                            {formatTimeLabel(h)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="bg-background border border-gray-700 py-2 px-5 rounded-2xl w-full cursor-pointer">
                                <label>End Time</label>
                                <select
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="bg-background border border-gray-700 py-2 px-5 rounded-2xl w-full"
                                    >
                                    {hours.map((h) => (
                                        <option key={h} value={h}>
                                            {formatTimeLabel(h)}
                                        </option>
                                    ))}
                                    <option value="18:00">{formatTimeLabel("18:00")}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="bg-(--primary) p-3 rounded-2xl flex justify-center">
                        <button 
                            onClick={() => {bookingSubmit(); alert("booking success!");}}
                            className="cursor-pointer"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}