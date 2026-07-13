"use client";
import { useState } from "react";
import Image from "next/image";
export default function AdminBookingModal({
  booking,
  onClose,
  onConfirm,
  onReject
}) {
  if (!booking) return null;

  const [remark, setRemark] = useState(booking.remark || "");
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-[var(--background)] w-full max-w-3xl rounded-2xl border border-gray-700 p-6 flex flex-col gap-5">

        <div className="flex justify-between">
          <div>
            <h2 className="text-xl font-bold">Booking Details</h2>
            <p className="text-sm text-gray-400">
              {booking.reference_code}
            </p>
          </div>

          <button onClick={onClose}>✕</button>
        </div>

        <div className="grid grid-cols-2 gap-5">

          <div className="flex flex-col gap-3">

            <div className="p-3 border rounded-xl">
              <p className="text-sm text-gray-400">Customer</p>
              <p className="font-semibold">{booking.booker_name}</p>
            </div>

            <div className="p-3 border rounded-xl">
              <p className="text-sm text-gray-400">Total Amount</p>
              <p className="font-semibold">{parseFloat(booking.revenue).toFixed(2)}</p>
            </div>

            <div className="p-3 border rounded-xl">
              <p className="text-sm text-gray-400">Court</p>
              <p>{booking.court_name}</p>
            </div>

            <div className="p-3 border rounded-xl">
              <p className="text-sm text-gray-400">Schedule</p>
              <p>{booking.booking_date}</p>
              <p>{booking.start_time} - {booking.end_time}</p>
            </div>

            <div className="p-3 border rounded-xl">
              <p className="text-sm text-gray-400">Status</p>
              <p className="capitalize font-bold">{booking.status}</p>
            </div>

            <div className="p-3 border rounded-xl">
              <p className="text-sm text-gray-400">Remark</p>
              <input type="text" id="remarkInput" className="w-full p-1 focus:outline-none"
                placeholder="Enter remark..." value={remark} autoComplete="off" onChange={(e) => setRemark(e.target.value)} readOnly={booking.status !== 'pending'} />
              </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-400">Payment Proof</p>

            {booking.payment_proof_url ? (
              <div className="flex justify-center">
                <Image
                  src={booking.payment_proof_url}
                  alt="Payment Proof"
                  width={600}
                  height={900}
                  className="w-60 h-auto object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="p-3 border rounded-xl text-gray-400">
                No proof uploaded
              </div>
            )}
          </div>

        </div>
        {booking.status === "pending" && (
          <div className="flex justify-end gap-3">

            <button
              onClick={() => {
                onReject(booking.id, remark, booking.reference_code); 
                onClose(); }}
              className="bg-red-600 px-4 py-2 rounded-lg"
            >
              Reject
            </button>

            <button
              onClick={() => {
                onConfirm(booking.id, remark, booking.reference_code); 
                onClose();}}
              className="bg-(--primary) px-4 py-2 rounded-lg"
            >
              Confirm
            </button>

          </div>
        )}

      </div>

    </div>
  );
}