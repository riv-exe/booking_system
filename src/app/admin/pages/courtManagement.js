"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import AddCourtModal from "@/app/components/modals/addCourtModal";
import EditCourtModal from "@/app/components/modals/editCourtModal";
import DeleteCourtModal from "@/app/components/modals/deleteCourtModal";

export default function CourtManagement() {
    const [courts, setCourts] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedCourt, setSelectedCourt] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);;
    

    async function fetchCourts() {
            setLoading(true);
        try{
            const res = await fetch("/api/admin/court-management");
            const data = await res.json();
            
            if (!res.ok) {
                console.error("Failed to fetch bookings");
                return;
            }

            setCourts(data.courts);
        }catch(error){
            console.error(error)
        }finally{
            setLoading(false);
        }
    }

    useEffect(function () {
        fetchCourts();
    }, []);

    function handleEdit(court) {
        setSelectedCourt(court);
        setShowEditModal(true);
    }

    function handleDelete(court) {
        setSelectedCourt(court);
        setShowDeleteModal(true);
    }

    const filteredCourts = courts.filter(function (court) {
        const matchesSearch = court.name
            .toLowerCase()
            .includes(search.toLowerCase());

        let matchesStatus = true;

        if (statusFilter === "active") {
            matchesStatus = court.is_active;
        } else if (statusFilter === "inactive") {
            matchesStatus = !court.is_active;
        }

        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <div className="p-6 pb-0">
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
                            value={search}
                            onChange={function (e) {
                                setSearch(e.target.value);
                            }}
                            className="border border-(--border-color) px-3 py-2 rounded-lg"
                        />

                        <select
                            className="border border-(--border-color) rounded-lg px-3 py-2"
                            value={statusFilter}
                            onChange={function (e) {
                                setStatusFilter(e.target.value);
                            }}
                        >
                            <option value="all">All Courts</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <button
                            onClick={function () {
                                setSearch("");
                                setStatusFilter("all");
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div className="my-6 overflow-y-auto border border-(--border-color) rounded-xl">
                    <table className="w-full">
                        <thead className="bg-(--secondary)">
                            <tr>
                                <th className="p-4 text-center">Image</th>
                                <th className="p-4 text-center">Name</th>
                                <th className="p-4 text-center">Location</th>
                                <th className="p-4 text-center">Price</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center py-6"
                                    >
                                        Loading courts...
                                    </td>
                                </tr>
                            ) : (
                                filteredCourts.length > 0 ? (
                                    filteredCourts.map(function (court) {
                                        return (
                                            <tr key={court.id} className="border-t border-(--border-color)">
                                                <td className="p-2 text-center align-middle">
                                                    <Image
                                                        src={court.img_url}
                                                        alt={court.name}
                                                        width={100}
                                                        height={100}
                                                        className="mx-auto rounded h-auto w-auto"
                                                    />
                                                </td>

                                                <td className="p-2 text-center align-middle">
                                                    {court.name}
                                                </td>

                                                <td className="p-2 text-center align-middle">
                                                    {court.address}
                                                </td>

                                                <td className="p-2 text-center align-middle">
                                                    ₱{court.price}
                                                </td>

                                                <td className="p-2 text-center align-middle">
                                                    {court.is_active ? "Active" : "Inactive"}
                                                </td>

                                                <td className="p-2 text-center align-middle">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={function () {
                                                                handleEdit(court);
                                                            }}
                                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={function () {
                                                                handleDelete(court);
                                                            }}
                                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center py-6"
                                        >
                                            No courts found.
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddCourtModal
                open={showAddModal}
                onClose={function () {
                    setShowAddModal(false);
                }}
                onSuccess={fetchCourts}
            />

            <EditCourtModal
                open={showEditModal}
                court={selectedCourt}
                onClose={function () {
                    setShowEditModal(false);
                }}
                onSuccess={fetchCourts}
            />

            <DeleteCourtModal
                open={showDeleteModal}
                court={selectedCourt}
                onClose={function () {
                    setShowDeleteModal(false);
                }}
                onSuccess={fetchCourts}
            />
        </>
    );
}