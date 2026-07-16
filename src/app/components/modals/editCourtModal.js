"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getAdminInfo, addActivity } from "@/app/services/activity";

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
    const [openingTime, setOpeningTime] = useState("");
    const [closingTime, setClosingTime] = useState("");
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(function () {
        if (open && court) {
            setName(court.name);
            setAddress(court.address);
            setPrice(court.price);
            setStatus(court.is_active ? "available" : "unavailable");
            setOpeningTime(court.opening_time ? court.opening_time.slice(0, 5) : "");
            setClosingTime(court.closing_time ? court.closing_time.slice(0, 5) : "");
            setPreviewUrl(court.img_url);
            setImage(null);
        }
    }, [open, court]);

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

    const editCourt = async () =>{
        const formData = new FormData();

        formData.append("name", name);
        formData.append("address", address);
        formData.append("price", price);
        formData.append("status", status);
        formData.append("opening_time", openingTime);
        formData.append("closing_time", closingTime);

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

    async function handleSubmit(e) {
        e.preventDefault();

        const adminInfo = await getAdminInfo();
        const activityMessage = `Court (${name}) has been edited.`;

        if(adminInfo){
            addActivity(adminInfo.id, activityMessage);
        }
        editCourt();
    }

    function handleClose() {
        setName("");
        setAddress("");
        setPrice("");
        setStatus("");
        setOpeningTime("");
        setClosingTime("");
        setImage(null);
        setPreviewUrl("");
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg w-125">
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

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">
                                Opening Time
                            </label>
                            <select
                                className="w-full p-2 border rounded"
                                value={openingTime}
                                onChange={function (e) {
                                    setOpeningTime(e.target.value);
                                }}
                            >
                                <option value="">Select Time</option>
                                {HOUR_OPTIONS.map(function (opt) {
                                    return (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-1">
                                Closing Time
                            </label>
                            <select
                                className="w-full p-2 border rounded"
                                value={closingTime}
                                onChange={function (e) {
                                    setClosingTime(e.target.value);
                                }}
                            >
                                <option value="">Select Time</option>
                                {HOUR_OPTIONS.map(function (opt) {
                                    return (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

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