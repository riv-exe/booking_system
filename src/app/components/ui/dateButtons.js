export default function DateButtons({ time, status }) {
  let bg = "bg-[var(--primary)]/75";

  if (status === "pending") {
    bg = "bg-yellow-500";
  }

  if (status === "confirmed") {
    bg = "bg-[var(--foreground)]/25";
  }

  return (
    <div
      className={`${bg} p-4 rounded-xl text-white text-center flex justify-center items-center`}
    >
      {status === "confirmed" ? "Booked" : time}
    </div>
  );
}