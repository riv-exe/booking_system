"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import ThemeToggle from "../theme/ThemeToggle";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function go(path) {
    setMenuOpen(false);
    router.push(path);
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-50 h-16 sm:h-19 px-3 sm:px-6 md:px-10 flex items-center justify-between md:bg-background/80 bg-background backdrop-blur-xl border-b transition-colors duration-300 ${
          atTop && !menuOpen ? "border-(--line-color)" : "border-transparent"
        }`}
      >
        <button
          onClick={() => go("/")}
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

        <div className="hidden sm:flex items-center gap-2">
          <ThemeToggle />

          {loading ? null : user ? (
            <>
              <span className="hidden lg:inline text-sm text-(--foreground)/60">
                Hi, {user.name}
              </span>

              <button
                onClick={() => go("/my-bookings")}
                className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm border border-(--line-color) rounded-full cursor-pointer hover:border-(--foreground)/40 transition-colors"
              >
                My Bookings
              </button>

              <button
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  setUser(null);
                  go("/");
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
                  go(`/signin?redirect=${encodeURIComponent(pathname)}`)
                }
                className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm border border-(--line-color) rounded-full cursor-pointer hover:border-(--foreground)/40 transition-colors"
              >
                Sign In
              </button>

              <button
                onClick={() => go("/signup")}
                className="hidden sm:block px-4 py-1.5 text-sm rounded-full bg-(--primary) text-(--white) cursor-pointer hover:opacity-90 transition-opacity"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        <div className="flex sm:hidden items-center gap-1">
          <ThemeToggle />

          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="relative w-9 h-9 flex items-center justify-center cursor-pointer"
          >
            <Menu
              size={22}
              className={`absolute transition-all duration-300 ${
                menuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
              }`}
            />
            <X
              size={22}
              className={`absolute transition-all duration-300 ${
                menuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
              }`}
            />
          </button>
        </div>
      </nav>

      <div
        onClick={() => setMenuOpen(false)}
        className={`sm:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`sm:hidden fixed top-16 left-0 right-0 z-40 bg-background rounded-b-md border-b border-(--line-color) shadow-xl transition-all duration-300 origin-top ${
          menuOpen
            ? "opacity-100 translate-y-0 scale-y-100"
            : "opacity-0 -translate-y-2 scale-y-95 pointer-events-none"
        }`}
      >
        <div className="p-4 flex flex-col gap-2">
          {loading ? null : user ? (
            <>
              <div className="px-3 py-2 text-sm text-(--foreground)/60">
                Hi, {user.name}
              </div>

              <button
                onClick={() => go("/my-bookings")}
                className="w-full text-left px-4 py-3 text-sm rounded-xl border border-(--line-color) cursor-pointer hover:border-(--foreground)/40 transition-colors"
              >
                My Bookings
              </button>

              <button
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  setUser(null);
                  go("/");
                }}
                className="w-full text-left px-4 py-3 text-sm rounded-xl border border-(--line-color) cursor-pointer hover:border-(--foreground)/40 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() =>
                  go(`/signin?redirect=${encodeURIComponent(pathname)}`)
                }
                className="w-full text-left px-4 py-3 text-sm rounded-xl border border-(--line-color) cursor-pointer hover:border-(--foreground)/40 transition-colors"
              >
                Sign In
              </button>

              <button
                onClick={() => go("/signup")}
                className="w-full px-4 py-3 text-sm rounded-xl bg-(--primary) text-(--white) cursor-pointer hover:opacity-90 transition-opacity"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}