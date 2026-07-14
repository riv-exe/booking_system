"use client";

import { useMemo, useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  const label = useMemo(() => {
    return theme === "light" ? "Switch to dark" : "Switch to light";
  }, [theme]);

  useEffect(() => {
    function SetCurrentTheme() {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(current);
    }
    SetCurrentTheme();
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    window.localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };




  return (
    <button
      type="button"

      onClick={toggle}
      aria-label={label}
      className="px-3 py-1.5 text-sm border border-(--line-color) rounded-full cursor-pointer hover:border-(--foreground)/40 transition-colors bg-background/30"
    >
      {theme === "light" ? "Light" : "Dark"}
    </button>
  );
}


