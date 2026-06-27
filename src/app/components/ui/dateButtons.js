export default function DateButtons({ time, isMorning, isBooked }) {
    function formatTime(time24) {
        const [hourStr, minute] = time24.split(":");
        let hour = parseInt(hourStr);

        const ampm = hour >= 12 ? "PM" : "AM";

        hour = hour % 12;
        if (hour === 0) hour = 12;

        return `${hour}:${minute} ${ampm}`;
    }

    return (
        <button
            disabled={isBooked}
            className={`p-5 rounded-2xl duration-300 hover:scale-105 ${
                isBooked
                    ? "bg-red-700 cursor-not-allowed"
                    : "bg-[var(--primary)]"
            }`}
        >
            <p>{formatTime(time)}</p>
        </button>
    );
}