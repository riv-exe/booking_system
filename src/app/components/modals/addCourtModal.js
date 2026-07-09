"use client";

export default function AddCourtModal({ open, onClose }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[500px]">
                <h2 className="text-xl font-bold mb-4">
                    Add Court
                </h2>

                {/* Form here */}

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="border px-4 py-2 rounded"
                    >
                        Cancel
                    </button>

                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}