"use client";

export default function EditCourtModal({
    open,
    court,
    onClose,
}) {
    if (!open || !court) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[500px]">
                <h2 className="text-xl font-bold mb-4">
                    Edit Court
                </h2>

                <p>{court.name}</p>

                {/* Pre-filled form */}

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="border px-4 py-2 rounded"
                    >
                        Cancel
                    </button>

                    <button className="bg-green-500 text-white px-4 py-2 rounded">
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}