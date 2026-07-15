"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import ThemeToggle from "../theme/ThemeToggle";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY <= 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 h-16 sm:h-19 px-3 sm:px-6 md:px-10 flex items-center justify-between bg-background/80 backdrop-blur-xl border-b transition-colors duration-300 ${
        atTop ? "border-(--line-color)" : "border-transparent"
      }`}
    >
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 cursor-pointer min-w-0"
      >
        <Image
          alt="badminton logo"
          src="/logos/badminton-icon.png"
          width={32}
          height={32}
          className="sm:w-10 sm:h-10"
        />

        <span className="font-display text-lg sm:text-2xl font-bold tracking-tight">
          Badminton<span className="text-(--primary)">PH</span>
        </span>
      </button>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {loading ? null : user ? (
          <>
            <span className="hidden lg:inline text-sm text-(--foreground)/60">
              Hi, {user.name}
            </span>

            <button
              onClick={() => router.push("/my-bookings")}
              className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm border border-(--line-color) rounded-full cursor-pointer hover:border-(--foreground)/40 transition-colors"
            >
              My Bookings
            </button>

            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                setUser(null);
                router.push("/");
              }}
              className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm border border-(--line-color) rounded-full cursor-pointer hover:border-(--foreground)/40 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() =>
                router.push(`/signin?redirect=${encodeURIComponent(pathname)}`)
              }
              className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm border border-(--line-color) rounded-full cursor-pointer hover:border-(--foreground)/40 transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={() => router.push("/signup")}
              className="hidden sm:block px-4 py-1.5 text-sm rounded-full bg-(--primary) text-(--white) cursor-pointer hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
}