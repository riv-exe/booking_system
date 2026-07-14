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

    const formatDate = (date) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (t) => t?.slice(0, 5) || "—";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-105 bg-(--secondary) border border-(--line-color) rounded-2xl shadow-2xl flex flex-col relative">

                <span className="absolute left-0 top-39 -translate-x-1/2 w-6 h-6 rounded-full bg-black/60" />
                <span className="absolute right-0 top-39 translate-x-1/2 w-6 h-6 rounded-full bg-black/60" />

                <div className="p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs opacity-50">Booking Receipt</p>
                            <p className="text-lg font-bold font-display">{court?.name || "Court"}</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close"
                            className="w-8 h-8 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-background transition-colors cursor-pointer shrink-0"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="bg-background border border-(--line-color) rounded-xl p-4">
                        <p className="text-xs opacity-50 mb-1">Reference Number</p>
                        <p className="text-xl font-bold font-mono tracking-wide">
                            {booking?.reference_code || "PENDING"}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-background border border-(--line-color) rounded-xl p-3">
                            <p className="text-xs opacity-50">Date</p>
                            <p className="font-semibold text-sm mt-0.5">{formatDate(booking?.booking_date)}</p>
                        </div>
                        <div className="bg-background border border-(--line-color) rounded-xl p-3">
                            <p className="text-xs opacity-50">Contact</p>
                            <p className="font-semibold text-sm mt-0.5">{user?.contactNum || "N/A"}</p>
                        </div>
                    </div>

                    <div className="bg-background border border-(--line-color) rounded-xl p-3 flex justify-between">
                        <div>
                            <p className="text-xs opacity-50">Start</p>
                            <p className="font-semibold font-mono">{formatTime(booking?.start_time)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs opacity-50">End</p>
                            <p className="font-semibold font-mono">{formatTime(booking?.end_time)}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-dashed border-(--line-color)" />

                <div className="p-6 pt-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm opacity-60">Amount Due</p>
                        <p className="text-2xl font-bold">₱{price}</p>
                    </div>

                    <div className="flex justify-between items-center bg-background border border-(--line-color) rounded-xl px-4 py-2.5">
                        <p className="text-sm opacity-70">Status</p>
                        <span className="flex items-center gap-1.5 text-(--shuttle) font-bold text-sm">
                            <span className="w-2 h-2 rounded-full bg-(--shuttle) live-dot" />
                            PENDING
                        </span>
                    </div>

                    <p className="text-xs opacity-40 text-center">
                        Show this to staff for verification
                    </p>
                </div>
            </div>
        </div>
    );
}