"use client"
import { useState } from "react"

export default function AdminSidebar({ page, setPage }) {
   
    return (
        <div className="bg-(--secondary) w-full h-full p-7">
            <p className="font-bold opacity-50">Menu</p>
            <div className="flex flex-col items-start my-3 gap-3">
                <button className={`px-3 py-2 cursor-pointer w-full text-start rounded-lg ${page === 1 && "font-bold bg-gray-50/20"}`} onClick={() => setPage(1)}>Dashboard</button>
                <button className={`px-3 py-2 cursor-pointer w-full text-start rounded-lg ${page === 2 && "font-bold bg-gray-50/20"}`} onClick={() => setPage(2)}>Bookings</button>
                <button className={`px-3 py-2 cursor-pointer w-full text-start rounded-lg ${page === 3 && "font-bold bg-gray-50/20"}`} onClick={() => setPage(3)}>Court Schedule</button>
                <button className={`px-3 py-2 cursor-pointer w-full text-start rounded-lg ${page === 4 && "font-bold bg-gray-50/20"}`} onClick={() => setPage(4)}>Court Management</button>
                {/* <button className={`px-3 py-2 cursor-pointer w-full text-start rounded-lg ${page === 4 && "font-bold bg-gray-50/20"}`} onClick={() => setPage(4)}>POS (Point of Sale)</button> */}
            </div>
        </div>
    )
}
