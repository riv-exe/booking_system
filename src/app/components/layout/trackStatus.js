"use client";

import { useState } from "react";

export default function TrackStatus() {
  const [status, setStatus] = useState("");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [courtNumber, setCourtNumber] = useState("");
  const [courtName, setCourtName] = useState("");
  const [courtAddress, setCourtAddress] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");

  const getStatus = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/status/${reference}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Booking not found");
        setStatus("");
        return;
      }

      setStatus(data.status || "");
      setStartTime(data.start_time || "");
      setEndTime(data.end_time || "");
      setCourtNumber(data.court_number || "");
      setCourtName(data.court_name || "");
      setDate(data.date || "");
      setCourtAddress(data.address || "");
      setRemark(data.remark || "");
      setError("");
    } catch {
      setError("Something went wrong");
      setStatus("");
    }
  };

  const bookingDate = date ? new Date(date) : null;

  const formattedDate =
    bookingDate && !Number.isNaN(bookingDate.getTime())
      ? bookingDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");
    const d = new Date();
    d.setHours(Number(hours), Number(minutes));

    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const statusClass =
    status.toLowerCase() === "rejected"
      ? "text-red-600"
      : status.toLowerCase() === "confirmed"
      ? "text-green-600"
      : status.toLowerCase() === "pending"
      ? "text-yellow-500"
      : "text-gray-900";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-10 sm:px-6">
      <p className="text-center text-2xl font-bold sm:text-4xl">
        Track your booking status
      </p>

      <form
        className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
        onSubmit={getStatus}
      >
        <input
          type="text"
          placeholder="Reference Number..."
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={reference}
          onChange={(e) => {
            setReference(e.target.value);
            setStatus("");
            setError("");
            setDate("");
            setStartTime("");
            setEndTime("");
            setCourtNumber("");
            setCourtName("");
            setCourtAddress("");
            setRemark("");
          }}
        />
        <button
          type="submit"
          className="w-full cursor-pointer rounded-md bg-blue-500 px-4 py-3 text-white transition duration-200 hover:bg-blue-600 sm:w-auto"
        >
          Track
        </button>
      </form>

      {(status || error) && (
        <div className="mt-8 w-full max-w-md rounded-lg border border-gray-200 p-5 text-sm sm:text-base">
          {status && (
            <div className="space-y-2 wrap-break-words font-mono">
              <p>
                <strong>Booking Reference:</strong> {reference.toUpperCase()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={statusClass}>{status.toUpperCase()}</span>
              </p>
              {formattedDate && (
                <p>
                  <strong>Date:</strong> {formattedDate}
                </p>
              )}
              {startTime && endTime && (
                <p>
                  <strong>Time:</strong> {formatTime(startTime)} -{" "}
                  {formatTime(endTime)}
                </p>
              )}
              {courtNumber !== "" && (
                <p>
                  <strong>Court Number:</strong> {courtNumber}
                </p>
              )}
              {courtName !== "" && (
                <p>
                  <strong>Court Name:</strong> {courtName}
                </p>
              )}
              {courtAddress && (
                <p className="wrap-break-words">
                  <strong>Court Address:</strong> {courtAddress}
                </p>
              )}
              {remark && (
                <p className="wrap-break-words">
                  <strong>Remark:</strong> {remark}
                </p>
              )}
            </div>
          )}

          {error && <p className="font-mono text-base">{error}</p>}
        </div>
      )}
    </div>
  );
}