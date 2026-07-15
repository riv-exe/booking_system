"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Wallet,
  X,
  CalendarX2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ImageOff,
} from "lucide-react";
import Navbar from "../components/layout/navbar";

function formatMoney(amount) {
  const n = Number(amount || 0);
  return `₱${n.toFixed(2)}`;
}

function formatTimeRange(startTime, endTime) {
  const s = startTime?.slice(0, 5) || "—";
  const e = endTime?.slice(0, 5) || "—";
  return `${s} – ${e}`;
}

function formatDateLabel(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-PH", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const STATUS_STYLES = {
  confirmed: {
    label: "Confirmed",
    dot: "bg-emerald-500",
    chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
    bar: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    dot: "bg-amber-500",
    chip: "border-amber-500/30 bg-amber-500/10 text-amber-600",
    bar: "bg-amber-500",
  },
  rejected: {
    label: "Rejected",
    dot: "bg-rose-500",
    chip: "border-rose-500/30 bg-rose-500/10 text-rose-600",
    bar: "bg-rose-500",
  },
};

function statusStyle(status) {
  return STATUS_STYLES[status] || STATUS_STYLES.pending;
}

function StatusChip({ status }) {
  const s = statusStyle(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full capitalize whitespace-nowrap border ${s.chip}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function BookingModal({ booking, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!booking) return null;
  const s = statusStyle(booking.status);

  function handleCopy() {
    navigator.clipboard?.writeText(booking.reference_code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-background w-full max-w-3xl rounded-3xl border border-(--line-color) overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-1 w-full ${s.bar}`} />

        <div className="flex justify-between items-start px-6 pt-5 pb-4 border-b border-(--line-color)">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Booking details</h2>
              <StatusChip status={booking.status} />
            </div>
            <button
              onClick={handleCopy}
              className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-(--foreground)/50 hover:text-(--foreground)/80 font-mono transition-colors"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {booking.reference_code}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center hover:bg-(--secondary) transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-(--secondary) p-4">
                <p className="text-xs text-(--foreground)/50">Court</p>
                <p className="font-semibold mt-0.5">{booking.court_name}</p>
              </div>

              <div className="rounded-2xl bg-(--secondary) p-4">
                <p className="text-xs text-(--foreground)/50 flex items-center gap-1.5">
                  <Calendar size={12} /> Date
                </p>
                <p className="font-semibold mt-0.5">{formatDateLabel(booking.booking_date)}</p>
              </div>

              <div className="rounded-2xl bg-(--secondary) p-4 sm:col-span-2">
                <p className="text-xs text-(--foreground)/50 flex items-center gap-1.5">
                  <Clock size={12} /> Time
                </p>
                <p className="font-semibold mt-0.5">
                  {formatTimeRange(booking.start_time, booking.end_time)}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-(--foreground)/50">Remark</p>
              <p className="mt-1 text-sm wrap-break-words text-(--foreground)/80">
                {booking.remark || "No remark provided."}
              </p>
            </div>

            <div className="mt-5 flex items-center gap-2 pt-4 border-t border-(--line-color)">
              <Wallet size={16} className="text-(--foreground)/50" />
              <p className="text-xs text-(--foreground)/50">Amount</p>
              <p className="text-xl font-bold ml-auto">{formatMoney(booking.revenue)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-(--foreground)/50">Payment proof</p>
            {booking.payment_proof_url ? (
              <div className="relative w-full h-55 border border-(--line-color) rounded-2xl overflow-hidden bg-(--secondary)">
                <Image
                  src={booking.payment_proof_url}
                  alt="Payment proof"
                  fill
                  className="object-contain p-2"
                />
              </div>
            ) : (
              <div className="w-full h-55 border border-dashed border-(--line-color) rounded-2xl flex flex-col items-center justify-center gap-2 text-(--foreground)/40">
                <ImageOff size={22} />
                <span className="text-xs">No payment proof uploaded</span>
              </div>
            )}

            <p className="text-xs text-(--foreground)/40 leading-relaxed">
              Staff verification status will reflect here once reviewed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingCardSkeleton() {
  return (
    <div className="rounded-2xl border border-(--line-color) overflow-hidden animate-pulse">
      <div className="h-1 w-full bg-(--secondary)" />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 w-2/3">
            <div className="h-3 w-20 bg-(--secondary) rounded" />
            <div className="h-4 w-32 bg-(--secondary) rounded" />
          </div>
          <div className="h-6 w-20 bg-(--secondary) rounded-full" />
        </div>
        <div className="h-3 w-full bg-(--secondary) rounded" />
        <div className="h-3 w-2/3 bg-(--secondary) rounded" />
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <MyBookingsInner />
    </div>
  );
}

function MyBookingsInner() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);

  const LIMIT = 6;

  const filtersQuery = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("limit", String(LIMIT));
    if (statusFilter && statusFilter !== "all") sp.set("statusFilter", statusFilter);
    if (dateFilter) sp.set("dateFilter", dateFilter);
    return sp.toString();
  }, [page, statusFilter, dateFilter]);

  async function loadBookings() {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/bookings?${filtersQuery}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Failed to fetch my bookings", data);
        setBookings([]);
        return;
      }

      const data = await res.json();
      setBookings(data.bookings || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (e) {
      console.error(e);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => loadBookings());
  }, [filtersQuery]);

  function clearFilters() {
    setStatusFilter("all");
    setDateFilter("");
    setPage(1);
  }

  const hasActiveFilters = statusFilter !== "all" || Boolean(dateFilter);
  const startBooking = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const endBooking = Math.min(page * LIMIT, total);

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "confirmed", label: "Confirmed" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-14">
      <div className="mb-8 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-sm text-(--foreground)/60 mt-1">
            View your booking history and verification status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-1 rounded-full bg-(--secondary) border border-(--line-color)">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setStatusFilter(opt.value);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  statusFilter === opt.value
                    ? "bg-background shadow-sm text-foreground"
                    : "text-(--foreground)/55 hover:text-(--foreground)/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <input
            type="date"
            className="border border-(--line-color) bg-background rounded-full px-4 py-2 text-sm text-(--foreground)/80 focus:outline-none focus:ring-2 focus:ring-(--foreground)/15"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1);
            }}
          />

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-(--foreground)/55 hover:text-foreground px-3 py-2 transition-colors"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <BookingCardSkeleton key={i} />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="border border-(--line-color) rounded-3xl p-14 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-(--secondary) flex items-center justify-center">
            <CalendarX2 size={22} className="text-(--foreground)/40" />
          </div>
          <p className="font-semibold">No bookings found</p>
          <p className="text-sm text-(--foreground)/55 max-w-sm">
            {hasActiveFilters
              ? "Nothing matches your current filters. Try adjusting or clearing them."
              : "Your bookings will show up here once you've reserved a court."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-1 text-sm font-medium underline underline-offset-4 text-(--foreground)/70 hover:text-foreground"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((b) => {
            const s = statusStyle(b.status);
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                className="group text-left bg-(--secondary) border border-(--line-color) rounded-2xl overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all"
              >
                <div className={`h-1 w-full ${s.bar}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-(--foreground)/45">{b.reference_code}</p>
                      <p className="font-bold mt-1 truncate">{b.court_name}</p>
                    </div>
                    <StatusChip status={b.status} />
                  </div>

                  <div className="mt-4 space-y-1.5 text-sm text-(--foreground)/75">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-(--foreground)/40" />
                      <span>{formatDateLabel(b.booking_date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-(--foreground)/40" />
                      <span>{formatTimeRange(b.start_time, b.end_time)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-(--line-color)">
                    <span className="font-bold">{formatMoney(b.revenue)}</span>
                    <span className="text-xs text-(--foreground)/40 group-hover:text-(--foreground)/70 transition-colors">
                      View details →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-(--line-color) text-sm font-medium disabled:opacity-40 hover:bg-(--secondary) transition-colors"
          >
            <ChevronLeft size={15} />
            Previous
          </button>

          <div className="text-center">
            <p className="text-sm font-medium">
              Page {page} of {totalPages}
            </p>
            <p className="text-xs text-(--foreground)/50 mt-0.5">
              Showing {startBooking}–{endBooking} of {total} bookings
            </p>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-(--line-color) text-sm font-medium disabled:opacity-40 hover:bg-(--secondary) transition-colors"
          >
            Next
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </div>
  );
}
