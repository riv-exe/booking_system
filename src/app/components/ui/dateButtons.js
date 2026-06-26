export default function DateButtons({ time, isMorning }) {
    return (
        <button className="bg-[var(--primary)] p-5 rounded-2xl cursor-pointer duration-300 hover:scale-105">
            <p>
                {time}:00 {isMorning ? "AM" : "PM"}
            </p>
        </button>
    )
}