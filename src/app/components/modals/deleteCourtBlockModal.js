"use client";

import { useEffect, useMemo, useState } from "react";

function toNiceTime(hourLabel) {
  if (!hourLabel) return "";
  return hourLabel;
}

export default function DeleteCourtBlockModal({
  open,
  initialData,
  onClose,
  onConfirm,
}) {
  const [date, setDate] = useState("");
  const [courtName, setCourtName] = useState("");
  const [startHourLabel, setStartHourLabel] = useState("");
  const [endHourLabel, setEndHourLabel] = useState("");
  const [reasonText, setReasonText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const init = initialData || {};

    
    queueMicrotask(() => {
      setDate(init.date || "");
      setCourtName(init.courtName || "");
      setStartHourLabel(init.startHourLabel || "");
      setEndHourLabel(init.endHourLabel || "");
      setReasonText(init.reasonText || "");
      setSubmitting(false);
    });
  }, [open, initialData]);


  const timeRangeText = useMemo(() => {
    const start = toNiceTime(startHourLabel);
    const end = toNiceTime(endHourLabel);
    if (!start || !end) return "";
    return `${start} – ${end}`;
  }, [startHourLabel, endHourLabel]);

  if (!open) return null;

  async function handleConfirm() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onConfirm?.();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-background w-full max-w-xl rounded-2xl border border-gray-700 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 pt-5 pb-3 border-b border-gray-700">
          <div>
            <h2 className="text-lg font-bold">Remove blocked slot</h2>
            <p className="text-xs text-gray-400">This will immediately make the time available.</p>
          </div>
          <button onClick={onClose} className="text-xl leading-none">
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="text-sm text-(--muted-2)">
            <div className="flex flex-col gap-1">
              <div>
                <span>Date:</span> <span className="font-medium">{date}</span>
              </div>
              <div>
                <span>Court:</span> <span className="font-medium">{courtName}</span>
              </div>
              <div>
                <span>Time:</span>{" "}
                <span className="font-medium">{timeRangeText}</span>
              </div>
              {reasonText ? (
                <div>
                  <span>Reason:</span>{" "}
                  <span className="font-medium">{reasonText}</span>
                </div>
              ) : null}
            </div>
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
              type="button"
              onClick={handleConfirm}
              disabled={submitting}
              className="bg-(--danger-bg) text-(--primary) border border-(--danger) px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {submitting ? "Removing..." : "Remove"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

