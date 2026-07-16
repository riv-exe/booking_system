"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalBookings: 0,
        todayBookings: 0,
        totalCourts: 0,
        totalRevenue: 0,
        pendingBookings: 0,
        upcomingBookings: 0,
        confirmedBookings: 0,
        newMembers: 0
    });

    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadDashboardData = async () => {
        setLoading(true);
        try{
            const res = await fetch("/api/admin/dashboard");
            const data = await res.json();

            setStats(data.stats);
            setRecentActivities(data.recentActivities || []);
        }catch(error){
            console.error(error);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);
    
    return (
        <div className="p-6 flex flex-col gap-6">

            <h1 className="text-2xl font-bold">
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-4 gap-4">

                <div className="p-4 rounded-xl bg-(--secondary) border border-(--border-color)">
                    <p className="text-sm opacity-70">Total Bookings</p>
                    <p className="text-2xl font-bold">{stats.totalBookings ?? 0}</p>
                </div>

                <div className="p-4 rounded-xl bg-(--secondary) border border-(--border-color)">
                    <p className="text-sm opacity-70">Today&apos;s Bookings</p>
                    <p className="text-2xl font-bold">{stats.todayBookings ?? 0}</p>
                </div>

                <div className="p-4 rounded-xl bg-(--secondary) border border-(--border-color)">
                    <p className="text-sm opacity-70">Active Courts</p>
                    <p className="text-2xl font-bold">{stats.totalCourts ?? 0}</p>
                </div>

                <div className="p-4 rounded-xl bg-(--secondary) border border-(--border-color)">
                    <p className="text-sm opacity-70">Monthly Revenue</p>
                    <p className="text-2xl font-bold">₱{stats.totalRevenue ?? 0}</p>
                </div>

            </div>

            <div className="grid grid-cols-4 gap-4">

                <div className="p-4 rounded-xl bg-(--secondary) border border-(--border-color)">
                    <p className="text-sm opacity-70">Pending Bookings</p>
                    <p className="text-2xl font-bold">{stats.pendingBookings ?? 0}</p>
                </div>

                <div className="p-4 rounded-xl bg-(--secondary) border border-(--border-color)">
                    <p className="text-sm opacity-70">Upcoming Bookings</p>
                    <p className="text-2xl font-bold">{stats.upcomingBookings ?? 0}</p>
                </div>

                <div className="p-4 rounded-xl bg-(--secondary) border border-(--border-color)">
                    <p className="text-sm opacity-70">Monthly Confirmed Bookings</p>
                    <p className="text-2xl font-bold">{stats.confirmedBookings ?? 0}</p>
                </div>

                <div className="p-4 rounded-xl bg-(--secondary) border border-(--border-color)">
                    <p className="text-sm opacity-70">Monthly New Members</p>
                    <p className="text-2xl font-bold">{stats.newMembers ?? 0}</p>
                </div>


            </div>

            <div className="bg-(--secondary) border border-(--border-color) rounded-xl p-4">
                <h2 className="text-lg font-semibold pb-2 border-b border-(--border-color) mb-2">
                        Recent Activities
                    </h2>
                {loading ? (
                        <div className='text-center p-4'>Loading activities...</div>
                    ) : (
                        recentActivities ? (
                            recentActivities.map((a) => (
                                <div className="flex justify-between py-2 px-5" key={a.id}>
                                    <span>{a.activity}</span>

                                    <span>
                                        {new Date(a.created_at).toLocaleString("en-PH", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className='text-center p-4'>No recent activities...</div>
                        )
                    )

                }
            </div>

        </div>
    );
}