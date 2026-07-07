"use client";
import {useState, useEffect} from "react";

export default function TrackStatus() {
    const [status, setStatus] = useState("");
    const [reference, setReference] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [courtNumber, setCourtNumber] = useState(0);
    const [courtAddress, setCourtAddress] = useState("");
    const [error, setError] = useState("");

    const getStatus = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/status/${reference}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Booking not found");
                return;
            }

            setStatus(data.status);
            setStartTime(data.start_time);
            setEndTime(data.end_time);
            setCourtNumber(data.court_number);
            setDate(data.date);
            setCourtAddress(data.address);
        }
        catch (err) {
            setError("Something went wrong");
        }
    }

    const bookingDate = new Date(date);

    const formattedDate = bookingDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formatTime = (time) => {
        const [hours, minutes] = time.split(":");

        const d = new Date();
        d.setHours(hours, minutes);

        return d.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    useEffect(() => {
        const statusElement = document.querySelector(".status-color");
    if(statusElement) {
        if(status.toLowerCase() === "rejected") {
            statusElement.style.color = "red";
        }else if(status.toLowerCase() === "confirmed") {
            statusElement.style.color = "green";
        }else if(status.toLowerCase() === "pending") {
            statusElement.style.color = "yellow";
        }
    }
}, [status]);
    return (
        <div className=" py-10 flex flex-col items-center">
            <p className="text-4xl font-bold">Track your booking status.</p>
            <form className="flex mt-10" id="trackForm">
                <input
                    type="text"
                    placeholder="Reference Number..." className="w-[250px] border border-gray-300 rounded-md py-2 px-4 focus:outline-none"
                    value={reference}
                    onChange={(e) => {
                        setReference(e.target.value);

                        // Clear previous result
                        setStatus("");
                        setError("");
                        setDate("");
                        setStartTime("");
                        setEndTime("");
                        setCourtNumber(0);
                    }}
                />
                <button className="cursor-pointer ml-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200" onClick={getStatus}>Track</button>
            </form>
        
        {status && (
            <div className="mt-10 text-lg font-mono">
                <p><strong>Booking Reference:</strong> {reference.toUpperCase()}</p>
                <p><strong>Status:</strong> <span className="status-color">{status.toUpperCase()}</span></p>
                <p><strong>Date:</strong> {formattedDate}</p>
                <p><strong>Time:</strong> {formatTime(startTime)} - {formatTime(endTime)}</p>
                <p><strong>Court Number:</strong> {courtNumber}</p>
                <p><strong>Court Address:</strong> {courtAddress}</p>
            </div>
        )}

        {error && (
            <div className="mt-10 text-xl font-mono ">
                <p>{error}</p>
            </div>
        )}
        </div>
)}