"use client";
import {useState} from "react";
export default function Sales() {
    const [filter, setFilter] = useState("This Month");
    const getFilterData = async (e) => {
        e.preventDefault();
        try{
            const res = await fetch(`/api/sales?filter=${filter}`);
            const data = await res.json();
        }catch(err){
            console.error(err);
        }
    };
    return (
        <div className="p-6 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Sales Report</h1>

                <div className="flex gap-2">
                    <select 
                        className="border rounded-lg px-3 py-2" 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option>This Month</option>
                        <option>This Week</option>
                        <option>Today</option>
                        <option>This Year</option>
                    </select>

                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        Export PDF
                    </button>

                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                        Export Excel
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="border rounded-xl p-5">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <h2 className="text-3xl font-bold mt-2">₱0.00</h2>
                </div>

                <div className="border rounded-xl p-5">
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <h2 className="text-3xl font-bold mt-2">0</h2>
                </div>

                <div className="border rounded-xl p-5">
                    <p className="text-sm text-gray-500">Average Booking</p>
                    <h2 className="text-3xl font-bold mt-2">₱0.00</h2>
                </div>

                <div className="border rounded-xl p-5">
                    <p className="text-sm text-gray-500">Best Performing Court</p>
                    <h2 className="text-2xl font-bold mt-2">-</h2>
                </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border rounded-xl p-5">
                    <h2 className="text-lg font-semibold mb-4">
                        Revenue by Court
                    </h2>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Court 1</span>
                            <span>₱0.00</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Court 2</span>
                            <span>₱0.00</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Court 3</span>
                            <span>₱0.00</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Court 4</span>
                            <span>₱0.00</span>
                        </div>
                    </div>
                </div>

                <div className="border rounded-xl p-5">
                    <h2 className="text-lg font-semibold mb-4">
                        Peak Hours
                    </h2>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>8:00 AM - 10:00 AM</span>
                            <span>0 Bookings</span>
                        </div>

                        <div className="flex justify-between">
                            <span>10:00 AM - 12:00 PM</span>
                            <span>0 Bookings</span>
                        </div>

                        <div className="flex justify-between">
                            <span>1:00 PM - 3:00 PM</span>
                            <span>0 Bookings</span>
                        </div>

                        <div className="flex justify-between">
                            <span>6:00 PM - 8:00 PM</span>
                            <span>0 Bookings</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                        Recent Transactions
                    </h2>

                    <input
                        type="text"
                        placeholder="Search..."
                        className="border rounded-lg px-3 py-2"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-3">Date</th>
                                <th className="text-left p-3">Reference</th>
                                <th className="text-left p-3">Customer</th>
                                <th className="text-left p-3">Court</th>
                                <th className="text-left p-3">Hours</th>
                                <th className="text-left p-3">Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-8 text-gray-500"
                                >
                                    No transactions found.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}