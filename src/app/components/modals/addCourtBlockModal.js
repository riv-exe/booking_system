"use client";

import { useEffect, useMemo, useState } from "react";

function toDateInputValue(date) {
  if (!date) return "";
  if (typeof date === "string") return date;
  return date.toISOString().split("T")[0];
}

function normalizeHourLabelToInt(hourLabel) {
  if (!hourLabel) return null;
  
  const h = parseInt(String(hourLabel).slice(0, 2), 10);
  return Number.isFinite(h) ? h : null;
}

function intToHourLabel(h) {
  return `${String(h).padStart(2, "0")}:00`;
}

function generateHourOptions() {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    const value = `${String(hour).padStart(2, "0")}:00`;
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const label = `${hour12}:00 ${period}`;
    options.push({ value, label });
  }
  return options;
}

const HOUR_OPTIONS = generateHourOptions();

export default function AddCourtBlockModal({
  open,
  initialData,
  onClose,
  onSuccess,
}) {
  const [date, setDate] = useState("");
  const [courtId, setCourtId] = useState(null);

  const [startHourLabel, setStartHourLabel] = useState("");
  const [endHourLabel, setEndHourLabel] = useState("");

  const [reasonPreset, setReasonPreset] = useState("Maintenance");
  const [reasonCustom, setReasonCustom] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const init = initialData || {};

    const nextDate = toDateInputValue(init.date);
    const nextCourtId = init.courtId ?? null;

    const start = init.startHourLabel || "";
    const startInt = normalizeHourLabelToInt(start);

    let endInt = null;
    if (init.endHourLabel) {
      endInt = normalizeHourLabelToInt(init.endHourLabel);
    } else if (startInt !== null) {
      endInt = startInt + 1;
    }

    const nextStartHourLabel = start;
    const nextEndHourLabel = endInt !== null ? intToHourLabel(endInt) : "";

    const nextReasonPreset = init.reasonPreset || "Maintenance";
    const nextReasonCustom = init.reasonCustom || "";

    
    queueMicrotask(() => {
      setDate(nextDate);
      setCourtId(nextCourtId);
      setStartHourLabel(nextStartHourLabel);
      setEndHourLabel(nextEndHourLabel);
      setReasonPreset(nextReasonPreset);
      setReasonCustom(nextReasonCustom);
      setSubmitting(false);
    });
  }, [open, initialData]);

  const reason = useMemo(() => {
    const custom = reasonCustom?.trim();
    if (custom) return custom;
    return reasonPreset;
  }, [reasonCustom, reasonPreset]);

  const canSubmit =
    !!date &&
    courtId !== null &&
    !!startHourLabel &&
    !!endHourLabel &&
    reason.trim().length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    const startHourInt = normalizeHourLabelToInt(startHourLabel);
    const endHourInt = normalizeHourLabelToInt(endHourLabel);

    if (startHourInt === null || endHourInt === null) {
      alert("Invalid start/end time");
      return;
    }

    if (endHourInt <= startHourInt) {
      alert("End time must be after start time");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        booking_date: date,
        court_id: courtId,
        start_time: intToHourLabel(startHourInt),
        end_time: intToHourLabel(endHourInt),
        status: "blocked",
        reason,
      };

      const res = await fetch("/api/admin/bookings/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create block");
        return;
      }

      onSuccess?.(data);
      onClose?.();
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-background w-full max-w-xl rounded-2xl border border-gray-700 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 pt-5 pb-3 border-b border-gray-700">
          <div>
            <h2 className="text-lg font-bold">Add blocked slot</h2>
            <p className="text-xs text-gray-400">Block time on the court schedule</p>
          </div>
          <button onClick={onClose} className="text-xl leading-none">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 text-sm border rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="bg-back text-xs text-gray-400 block mb-1">Court ID</label>
              <input
                type="text"
                value={courtId ?? ""}
                readOnly
                className="w-full p-2 text-sm border rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Start time</label>
              <select
                className="w-full p-2 text-sm border rounded-lg focus:outline-none"
                value={startHourLabel || ""}
                onChange={(e) => setStartHourLabel(e.target.value)}
              >
                <option value="" className="bg-(--secondary)">
                  Select Time
                </option>
                {HOUR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-(--secondary)">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">End time</label>
              <select
                className="w-full p-2 text-sm border rounded-lg focus:outline-none"
                value={endHourLabel || ""}
                onChange={(e) => setEndHourLabel(e.target.value)}
              >
                <option value="" className="bg-(--secondary)">
                  Select Time
                </option>
                {HOUR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-(--secondary)">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400">Reason</label>
            <div className="flex gap-2 flex-wrap">
              <select
                className="flex-1 min-w-[180px] p-2 text-sm border rounded-lg"
                value={reasonPreset}
                onChange={(e) => setReasonPreset(e.target.value)}
              >
                <option value="Maintenance" className="bg-(--secondary)">Maintenance</option>
                <option value="Cleaning" className="bg-(--secondary)">Cleaning</option>
                <option value="Staff_issue" className="bg-(--secondary)">Staff Issue</option>
                <option value="Other" className="bg-(--secondary)">Other</option>
              </select>

              <input
                className="flex-1 min-w-[180px] p-2 text-sm border rounded-lg"
                placeholder="Custom reason (optional)"
                value={reasonCustom}
                onChange={(e) => setReasonCustom(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-400">
              What will show on the grid:{" "}
              <span className="font-medium text-gray-200">{reason}</span>
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded-lg"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="bg-(--primary) text-(--white) px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save block"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

