export default function DateButtons({ time, status, remark }) {
  let bg = "bg-[var(--primary)]/75";

  if (status === "pending") {
    bg = "bg-yellow-500";
  }

  if (status === "confirmed") {
    bg = "bg-[var(--foreground)]/25";
  }

  if (status === "blocked") {
    bg = "bg-[var(--foreground)]/25";
  }

  let label = time;
  if (status === "confirmed") label = "Booked";
  if (status === "pending") label = time;
  if (status === "blocked") label = remark || "Blocked";

  return (
    <div
      className={`${bg} p-4 rounded-xl text-white text-center flex justify-center items-center`}
    >
      {label}
    </div>
  );
}
