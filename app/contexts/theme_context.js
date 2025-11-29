"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
	theme: "light",
	darkMode: false,
	isDarkMode: false,
	toggleTheme: () => {},
	toggleDarkMode: () => {},
});

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState("light");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		// Get theme from localStorage or system preference
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme) {
			setTheme(savedTheme);
		} else {
			const systemTheme = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches
				? "dark"
				: "light";
			setTheme(systemTheme);
		}
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const root = document.documentElement;
		if (theme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
		localStorage.setItem("theme", theme);
	}, [theme, mounted]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

	// Computed values for convenience
	const darkMode = theme === "dark";
	const isDarkMode = theme === "dark";

	return (
		<ThemeContext.Provider
			value={{
				theme,
				darkMode,
				isDarkMode,
				toggleTheme,
				toggleDarkMode: toggleTheme,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within ThemeProvider");
	}
	return context;
}
