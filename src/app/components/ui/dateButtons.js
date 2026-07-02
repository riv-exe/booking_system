export default function DateButtons({ time, status }) {

    let bg = "bg-(--primary)";

    if (status === "pending") {
        bg = "bg-yellow-500";
    }

    if (status === "confirmed") {
        bg = "bg-red-600";
    }

    return (
        <div className={`${bg} p-4 rounded-xl text-white text-center`}>
            {time}
        </div>
    );
}