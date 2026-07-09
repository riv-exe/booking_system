"use client";

export default function DeleteCourtModal({
    open,
    court,
    onClose,
    onSuccess,
}) {
    if (!open || !court) return null;

    async function handleDelete() {
        const res = await fetch("/api/courts/" + court.id, {
            method: "DELETE",
        });

        const data = await res.json();

        if (data.success) {
            onSuccess();
            onClose();
        } else {
            alert(data.message);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--background)] p-6 rounded-lg w-[400px]">
                <h2 className="text-xl font-bold text-red-500 mb-4">
                    Delete Court
                </h2>

                <p>
                    Are you sure you want to delete{" "}
                    <strong>{court.name}</strong>?
                </p>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="border px-4 py-2 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}