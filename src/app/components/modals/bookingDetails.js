import { useEffect, useState } from "react";
import UploadProofModal from "./uploadPicture";

export default function BookingDetails({
  title,
  userId,
  userName,
  userEmail,
  userContactNum,
  courtId,
  court,
  price,
  bookingDate,
  startTime,
  endTime,
  isActive,
  getSlots,
  onSuccess,
  setReceiptOpen,
  setReceiptData,
  setUserData
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNum, setContactNum] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [secureUrl, setSecureUrl] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userName) setName(userName);
    if (userEmail) setEmail(userEmail);
    if (userContactNum) setContactNum(userContactNum);
  }, [userName, userEmail, userContactNum]);

  async function bookingSubmit() {
    if (loading) return;

    if (!secureUrl) {
      setIsOpen(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          name,
          email,
          contactNum,
          court_id: courtId,
          booking_date: bookingDate,
          start_time: `${startTime}:00`,
          end_time: `${endTime}:00`,
          revenue: price,
          payment_proof_url: secureUrl
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result?.message || "Booking failed");
        return;
      }

      isActive(false);

      setUserData({
        name,
        email,
        contactNum
      });

      setReceiptData(result);
      setReceiptOpen(true);

      getSlots();

      if (onSuccess) {
        onSuccess(result.booking, result.booker);
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

      <div className="bg-[var(--background)] w-full max-w-2xl rounded-2xl shadow-xl border border-gray-700 p-6 flex flex-col gap-6">

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

        <div className="grid grid-cols-5 gap-6">

          <div className="col-span-3 flex flex-col gap-4">

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="p-3 rounded-xl bg-black/20 border border-gray-700"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="p-3 rounded-xl bg-black/20 border border-gray-700"
            />

            <input
              value={contactNum}
              onChange={(e) => setContactNum(e.target.value)}
              placeholder="Contact"
              className="p-3 rounded-xl bg-black/20 border border-gray-700"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-4">

            <div className="p-4 bg-black/20 border border-gray-700 rounded-xl">
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-gray-400">{bookingDate}</p>
              <p className="text-sm text-gray-400">
                {startTime} - {endTime}
              </p>
            </div>

            <div className="p-4 bg-black/20 border border-gray-700 rounded-xl">
              <p>Total</p>
              <p className="text-2xl font-bold text-[var(--primary)]">
                ₱{price}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={bookingSubmit}
          disabled={loading}
          className="w-full bg-[var(--primary)] p-3 rounded-xl font-semibold disabled:opacity-60"
        >
          {loading
            ? "Processing Booking..."
            : secureUrl
              ? "Confirm Booking"
              : "Upload Payment Proof"}
        </button>

      </div>

      <UploadProofModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onUpload={setSecureUrl}
      />

    </div>
  );
}