"use client";

import { useEffect } from "react";

export default function ThemeSetter() {
  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    const theme = stored === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);


  return null;
}

