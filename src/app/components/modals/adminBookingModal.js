"use client";
import { useState } from "react";
import Image from "next/image";
export default function AdminBookingModal({
  booking,
  onClose,
  onConfirm,
  onReject
}) {
  const [remark, setRemark] = useState(booking?.remark || "");

  if (!booking) return null;

  function formatTime(timeStr) {
    const [hourStr, minuteStr] = timeStr.split(":");
    const hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minuteStr} ${period}`;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

      <div className="bg-background w-full max-w-3xl max-h-[90vh] rounded-2xl border border-gray-700 overflow-hidden flex flex-col">

        <div className="flex justify-between items-center px-6 pt-5 pb-3 border-b border-gray-700">
          <div>
            <h2 className="text-lg font-bold">Booking Details</h2>
            <p className="text-xs text-gray-400">
              {booking.reference_code}
            </p>
          </div>

          <button onClick={onClose}>✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 p-6 items-stretch">

          <div className="md:col-span-3 flex flex-col gap-3">

            <div className="grid grid-cols-2 gap-3">

              <div>
                <p className="text-xs text-gray-400">Customer</p>
                <p className="font-semibold text-sm">{booking.booker_name}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Total Amount</p>
                <p className="font-semibold text-sm">{parseFloat(booking.revenue).toFixed(2)}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Court</p>
                <p className="text-sm">{booking.court_name}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Status</p>
                <p className="capitalize font-bold text-sm">{booking.status}</p>
              </div>

              <div className="col-span-2">
                <p className="text-xs text-gray-400">Schedule</p>
                <p className="text-sm">{booking.booking_date}</p>
                <p className="text-sm">
                  {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <p className="text-xs text-gray-400 mb-1">Remark</p>
              <textarea
                id="remarkInput"
                className="w-full flex-1 min-h-[70px] p-2 text-sm border rounded-lg resize-none focus:outline-none"
                placeholder="Enter remark..."
                value={remark}
                autoComplete="off"
                onChange={(e) => setRemark(e.target.value)}
                readOnly={booking.status !== 'pending'}
              />
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <p className="text-xs text-gray-400">Payment Proof</p>

            {booking.payment_proof_url ? (
              <div className="relative flex-1 min-h-[180px] border rounded-xl overflow-hidden">
                <Image
                  src={booking.payment_proof_url}
                  alt="Payment Proof"
                  fill
                  className="object-contain p-2"
                />
              </div>
            ) : (
              <div className="flex-1 min-h-[180px] flex items-center justify-center border rounded-xl text-gray-400 text-sm text-center">
                No proof uploaded
              </div>
            )}
          </div>

        </div>

        {booking.status === "pending" && (
          <div className="flex justify-end gap-3 px-6 pb-5 pt-2">

            <button
              onClick={() => {
                onReject(booking.id, remark, booking.reference_code); 
                onClose(); }}
              className="bg-red-600 px-4 py-2 rounded-lg text-sm"
            >
              Reject
            </button>

            <button
              onClick={() => {
                onConfirm(booking.id, remark, booking.reference_code); 
                onClose();}}
              className="bg-(--primary) px-4 py-2 rounded-lg text-sm"
            >
              Confirm
            </button>

          </div>
        )}

      </div>

    </div>
  );
}