"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalBookings: 0,
        todayBookings: 0,
        totalCourts: 0,
        totalRevenue: 0
    });

    const [recentBookings, setRecentBookings] = useState([]);

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/admin/dashboard");
            const data = await res.json();

            setStats(data.stats);
            setRecentBookings(data.recentBookings || []);
        }

        load();
    }, []);

    return (
        <div className="p-6 flex flex-col gap-6">

            <h1 className="text-2xl font-bold">
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-4 gap-4">

                <div className="p-4 rounded-xl bg-(--secondary) border">
                    <p className="text-sm opacity-70">Total Bookings</p>
                    <p className="text-2xl font-bold">{stats.totalBookings}</p>
                </div>

                <div className="p-4 rounded-xl bg-(--secondary) border">
                    <p className="text-sm opacity-70">Today&apos;s Bookings</p>
                    <p className="text-2xl font-bold">{stats.todayBookings}</p>
                </div>

                <div className="p-4 rounded-xl bg-(--secondary) border">
                    <p className="text-sm opacity-70">Courts</p>
                    <p className="text-2xl font-bold">{stats.totalCourts}</p>
                </div>

                <div className="p-4 rounded-xl bg-(--secondary) border">
                    <p className="text-sm opacity-70">Revenue (not done)</p>
                    <p className="text-2xl font-bold">₱{stats.totalRevenue}</p>
                </div>

            </div>

            <div className="bg-(--secondary) border rounded-xl p-4">

                <h2 className="font-bold mb-4">
                    Recent Bookings
                </h2>

                <div className="flex flex-col gap-2">

                    {recentBookings.map((b) => (
                        <div
                            key={b.id}
                            className="flex justify-between p-3 bg-background rounded-lg border"
                        >
                            <div>
                                <p className="font-semibold">{b.booker_name}</p>
                                <p className="text-xs opacity-70">{b.court_name}</p>
                            </div>

                            <div className="text-right">
                                <p className="text-sm">{b.booking_date}</p>
                                <p className="text-xs opacity-70">
                                    {b.start_time.slice(0,5)} - {b.end_time.slice(0,5)}
                                </p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

        </div>
    );
}