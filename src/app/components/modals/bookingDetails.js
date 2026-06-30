import { useState } from "react";

export default function BookingDetails({
  title,
  price,
  bookingDate,
  startTime,
  endTime,
  isActive,
  getBookedSlots,
  onSuccess
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNum, setContactNum] = useState("");

  async function bookingSubmit() {
    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        contactNum,
        court_id: 2,
        booking_date: bookingDate,
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      alert("Booking failed");
      return;
    }

    isActive(false);
    getBookedSlots();

    if (onSuccess) {
      onSuccess(result.booking, result.booker);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      
      <div className="bg-[var(--background)] w-full max-w-2xl rounded-2xl shadow-xl border border-gray-700 p-6 flex flex-col gap-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Complete Your Booking</h2>
            <p className="text-sm text-gray-400">
              Fill in your details to confirm reservation
            </p>
          </div>

          <button
            onClick={() => isActive(false)}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Reminder */}
        <div className="bg-yellow-600/5 text-sm p-3 rounded-xl flex gap-2">
          <p>
            Tip: Sign in to avoid re-entering your details every time you book.
          </p>

          <button
            onClick={() => isActive(false) || window.location.assign("/signin")}
            className="underline text-(--primary) font-bold hover:text-white text-sm cursor-pointer"
          >
            Sign in now →
          </button>
        </div>

        <div className="grid grid-cols-5 gap-6">

          {/* LEFT - FORM */}
          <div className="col-span-3 flex flex-col gap-4">

            <h3 className="font-semibold text-lg">Your Information</h3>

            <div className="flex flex-col gap-3">

              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 rounded-xl bg-black/20 border border-gray-700 focus:outline-none focus:border-[var(--primary)]"
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 rounded-xl bg-black/20 border border-gray-700 focus:outline-none focus:border-[var(--primary)]"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="text"
                placeholder="Contact Number"
                className="w-full p-3 rounded-xl bg-black/20 border border-gray-700 focus:outline-none focus:border-[var(--primary)]"
                onChange={(e) => setContactNum(e.target.value)}
              />

            </div>
          </div>

          {/* RIGHT - SUMMARY */}
          <div className="col-span-2 flex flex-col justify-between">

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-lg">Booking Summary</h3>

              <div className="p-4 rounded-xl bg-black/20 border border-gray-700 text-sm">
                <p className="text-gray-300">
                  <span className="font-semibold text-white">{title}</span>
                </p>
                <p className="text-gray-400 mt-1">
                  {bookingDate}
                </p>
                <p className="text-gray-400">
                  {startTime} - {endTime}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/20 border border-gray-700">
                <p className="text-gray-400 text-sm">Total Payment</p>
                <p className="text-2xl font-bold text-[var(--primary)]">
                  ₱{price}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={bookingSubmit}
          className="w-full bg-[var(--primary)] hover:opacity-90 transition p-3 rounded-xl font-semibold"
        >
          Confirm Booking
        </button>

      </div>
    </div>
  );
}