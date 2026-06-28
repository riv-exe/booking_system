"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, []);

  return (
    <nav className="p-5 h-[75px] bg-[var(--secondary)] flex justify-between items-center">
      
      <button
        onClick={() => router.push("/")}
        className="text-3xl font-extrabold flex cursor-pointer"
      >
        Badminton<span className="text-[var(--primary)]">PH</span>
      </button>

      <div className="flex items-center gap-3">
        {loading ? null : user ? (
          <>
            <span className="text-sm text-gray-600">
              Hi, {user.name}
            </span>

            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });

                setUser(null);
                setLoading(false);

                router.refresh();
              }}
              className="px-3 py-1 border rounded-2xl"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/signin")}
              className="border border-gray-500 rounded-2xl px-3 py-1 cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={() => router.push("/signup")}
              className="rounded-2xl px-3 py-1 bg-[var(--primary)] cursor-pointer"
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
}