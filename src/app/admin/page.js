"use client";

import { useState } from "react";
import AdminSidebar from "../components/layout/adminSidebar";
import Navbar from "../components/layout/navbar";
import Bookings from "./pages/bookings";
import CourtSchedule from "./pages/courtSchedule";
import Dashboard from "./pages/dashboard";
import POS from "./pages/pos";

export default function AdminLayout() {
    const [page, setPage] = useState(1);

    return (
        <div className="min-h-screen w-full overflow-x-hidden">

            {/* NAVBAR */}
            <div className="h-[75px] w-full fixed top-0 left-0 z-50">
                <Navbar />
            </div>

            {/* MAIN WRAPPER */}
            <div className="flex pt-[75px] w-full min-w-0">

                {/* SIDEBAR */}
                <div className="w-[20%] min-h-[calc(100vh-75px)] bg-(--secondary) fixed left-0 top-[75px] overflow-y-auto">
                    <AdminSidebar page={page} setPage={setPage} />
                </div>

                {/* CONTENT */}
                <div className="ml-[20%] w-[80%] min-w-0 p-4 overflow-x-hidden">

                    {page === 1 && <Dashboard />}
                    {page === 2 && <Bookings />}
                    {page === 3 && <CourtSchedule />}
                    {page === 4 && <POS />}

                </div>
            </div>
        </div>
    );
}