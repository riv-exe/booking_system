"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function EditCourtModal({
    open,
    court,
    onClose,
    onSuccess,
}) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [price, setPrice] = useState("");
    const [status, setStatus] = useState("");
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(function () {
        if (court) {
            setName(court.name);
            setAddress(court.address);
            setPrice(court.price);
            setStatus(court.is_active ? "available" : "unavailable");
            setPreviewUrl(court.img_url);
            setImage(null);
        }
    }, [court]);

    if (!open || !court) return null;

    function handleImageChange(e) {
        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, PNG, and WebP images are allowed.");
            e.target.value = "";
            return;
        }

        setImage(file);

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", name);
        formData.append("address", address);
        formData.append("price", price);
        formData.append("status", status);

        if (image) {
            formData.append("image", image);
        }

        const res = await fetch(`/api/admin/court-management/${court.id}`, {
            method: "PUT",
            body: formData,
        });

        const data = await res.json();

        if (data.success) {
            onSuccess();
            handleClose();
        }
    }

    function handleClose() {
        setName("");
        setAddress("");
        setPrice("");
        setStatus("");
        setImage(null);
        setPreviewUrl("");
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--background)] p-6 rounded-lg w-[500px]">
                <h2 className="text-xl font-bold mb-4">
                    Edit Court
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Court Name"
                        className="w-full p-2 mb-4 border rounded"
                        value={name}
                        onChange={function (e) {
                            setName(e.target.value);
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Court Location"
                        className="w-full p-2 mb-4 border rounded"
                        value={address}
                        onChange={function (e) {
                            setAddress(e.target.value);
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Court Price"
                        className="w-full p-2 mb-4 border rounded"
                        value={price}
                        onChange={function (e) {
                            setPrice(e.target.value);
                        }}
                    />

                    <select
                        className="w-full p-2 mb-4 border rounded"
                        value={status}
                        onChange={function (e) {
                            setStatus(e.target.value);
                        }}
                    >
                        <option value="">Select Status</option>
                        <option value="available">Active</option>
                        <option value="unavailable">Inactive</option>
                    </select>

                    <div className="flex justify-between">
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="w-60 h-10 p-2 border rounded"
                        />

                        {previewUrl && (
                            <Image
                                src={previewUrl}
                                alt="Preview"
                                width={160}
                                height={160}
                                className="rounded object-cover"
                                unoptimized
                            />
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="border px-4 py-2 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}