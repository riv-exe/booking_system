"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import AddCourtModal from "@/app/components/modals/addCourtModal";
import EditCourtModal from "@/app/components/modals/editCourtModal";
import DeleteCourtModal from "@/app/components/modals/deleteCourtModal";

export default function CourtManagement() {
    const [courts, setCourts] = useState([]);

    const [selectedCourt, setSelectedCourt] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(function () {
        fetchCourts();
    }, []);

    async function fetchCourts() {
        const res = await fetch("/api/courts");
        const data = await res.json();
        setCourts(data.courts);
    }

    function handleEdit(court) {
        setSelectedCourt(court);
        setShowEditModal(true);
    }

    function handleDelete(court) {
        setSelectedCourt(court);
        setShowDeleteModal(true);
    }

    return (
        <>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Court Management
                </h1>

                <div className="flex justify-between">
                    <button
                        onClick={function () {
                            setShowAddModal(true);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Add New Court
                    </button>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search courts..."
                            className="border px-3 py-2 rounded-lg"
                        />

                        <select className="border rounded-lg px-3 py-2">
                            <option>All Courts</option>
                        </select>

                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                            Clear
                        </button>
                    </div>
                </div>

                <table className="w-full mt-6">
                    <thead>
                        <tr>
                            <th className="border p-2">Image</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Location</th>
                            <th className="border p-2">Price</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {courts.map(function (court) {
                            return (
                                <tr key={court.id}>
                                    <td className="border p-2">
                                        <Image
                                            src={court.img_url}
                                            alt={court.name}
                                            width={100}
                                            height={100}
                                        />
                                    </td>

                                    <td className="border p-2">
                                        {court.name}
                                    </td>

                                    <td className="border p-2">
                                        {court.address}
                                    </td>

                                    <td className="border p-2">
                                        ₱{court.price}
                                    </td>

                                    <td className="border p-2">
                                        {court.is_active
                                            ? "Active"
                                            : "Inactive"}
                                    </td>

                                    <td className="border p-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={function () {
                                                    handleEdit(court);
                                                }}
                                                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={function () {
                                                    handleDelete(court);
                                                }}
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <AddCourtModal
                open={showAddModal}
                onClose={function () {
                    setShowAddModal(false);
                }}
            />

            <EditCourtModal
                open={showEditModal}
                court={selectedCourt}
                onClose={function () {
                    setShowEditModal(false);
                }}
            />

            <DeleteCourtModal
                open={showDeleteModal}
                court={selectedCourt}
                onClose={function () {
                    setShowDeleteModal(false);
                }}
            />
        </>
    );
}