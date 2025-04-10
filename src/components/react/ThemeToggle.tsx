"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const systemPref = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const shouldUseDark = stored === "dark" || (!stored && systemPref);
    root.classList.toggle("dark", shouldUseDark);
    setIsDark(shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newIsDark = !isDark;
    root.classList.toggle("dark", newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
    setIsDark(newIsDark);
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="relative w-10 h-10 flex items-center justify-center">
      <Sun className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-200 ${isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-200 ${!isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
