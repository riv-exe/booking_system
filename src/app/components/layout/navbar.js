"use client"
import { useRouter } from "next/navigation"

export default function Navbar() {
    const router = useRouter();

    return (
        <nav className="p-5 h-[75px] bg-[var(--secondary)] flex justify-between">
            <button onClick={() => router.push("/")} className="text-3xl font-extrabold flex cursor-pointer">Badminton<span className="text-[var(--primary)]">PH</span></button>

            <div className="flex justify-center items-center gap-3">
                <button onClick={() => router.push("/signin")} className="border-1 border-gray-500 rounded-2xl px-3 py-1 cursor-pointer">Sign In</button>
                <button onClick={() => router.push("/signup")} className="rounded-2xl px-3 py-1 bg-[var(--primary)] cursor-pointer">Get Started</button>
            </div>
        </nav>
    )
}