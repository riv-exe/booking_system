"use client";

export default function BookingReceipt({
    isOpen,
    setIsOpen,
    booking,
    court,
    user,
    price
}) {
    if (!isOpen) return null;

    const ref = booking?.id
        ? `BK-${String(booking.id).padStart(6, "0")}`
        : "PENDING";

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (t) => t?.slice(0, 5);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="w-[420px] bg-(--secondary) border border-gray-700 rounded-2xl p-6 flex flex-col gap-5 shadow-xl">

                <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">Booking Receipt</p>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                <div className="bg-background border border-gray-700 rounded-xl p-4 flex flex-col gap-2">
                    <p className="text-sm opacity-60">Reference Number</p>
                    <p className="text-xl font-bold">{booking?.reference_code}</p>
                </div>

                <div className="bg-background border border-gray-700 rounded-xl p-4 flex flex-col gap-2">
                    <p className="font-semibold">{court?.name}</p>
                    <p className="text-sm opacity-70">
                        ₱{price} 
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background border border-gray-700 rounded-xl p-3">
                        <p className="text-xs opacity-60">Date</p>
                        <p className="font-semibold">
                            {formatDate(booking?.booking_date)}
                        </p>
                    </div>

                    <div className="bg-background border border-gray-700 rounded-xl p-3">
                        <p className="text-xs opacity-60">Contact</p>
                        <p className="font-semibold">
                            {user.contactNum || "N/A"}
                        </p>
                    </div>
                </div>

                <div className="bg-background border border-gray-700 rounded-xl p-3 flex justify-between">
                    <div>
                        <p className="text-xs opacity-60">Start</p>
                        <p className="font-semibold">
                            {formatTime(booking?.start_time)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs opacity-60">End</p>
                        <p className="font-semibold">
                            {formatTime(booking?.end_time)}
                        </p>
                    </div>
                </div>

                <div className="bg-background border border-gray-700 rounded-xl p-3 flex justify-between items-center">
                    <p className="text-sm opacity-70">Status</p>
                    <p className="text-yellow-500 font-bold">PENDING</p>
                </div>

                <p className="text-xs opacity-50 text-center">
                    Show this to staff for verification
                </p>
            </div>
        </div>
    );
}