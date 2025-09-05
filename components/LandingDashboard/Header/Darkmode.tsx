"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative cursor-pointer border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors focus:outline-none"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 transition-transform duration-200 ease-in-out dark:scale-0 dark:-rotate-90 dark:text-yellow-300" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] text-indigo-500 scale-0 rotate-90 transition-transform duration-200 ease-in-out dark:scale-100 dark:rotate-0 dark:text-indigo-300" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}