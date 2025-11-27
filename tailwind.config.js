/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				// Primary brand colors
				primary: "#0da6f2",
				"primary-dark": "#0b8fd1",
				"primary-light": "#3eb8f5",

				// Secondary/Accent colors
				accent: "#FFA500",
				secondary: "#00A99D",

				// Background colors
				"background-light": "#f5f7f8",
				"background-dark": "#101c22",

				// Card colors
				"card-light": "#ffffff",
				"card-dark": "#1a2831",

				// Text colors
				"text-primary-light": "#0d171c",
				"text-primary-dark": "#f5f7f8",
				"text-secondary-light": "#6C757D",
				"text-secondary-dark": "#A8B5C0",

				// Border colors
				"border-light": "#cee0e8",
				"border-dark": "#334155",

				// Status colors
				"status-reported": "#DC3545",
				"status-acknowledged": "#3A86FF",
				"status-progress": "#FFC107",
				"status-resolved": "#28A745",

				// Urgency colors
				"urgency-low": "#50E3C2",
				"urgency-medium": "#F5A623",
				"urgency-high": "#D0021B",

				// Neutral colors for admin
				"neutral-text": "#424242",
				"neutral-bg": "#F7FAFC",
				"neutral-border": "#E2E8F0",
			},
			fontFamily: {
				display: ["Public Sans", "sans-serif"],
			},
			borderRadius: {
				DEFAULT: "0.5rem",
				lg: "0.75rem",
				xl: "1rem",
				"2xl": "1.25rem",
				full: "9999px",
			},
			boxShadow: {
				card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
				"card-dark":
					"0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)",
			},
			animation: {
				"fade-in": "fadeIn 0.2s ease-in-out",
				"slide-in": "slideIn 0.3s ease-out",
				"slide-up": "slideUp 0.3s ease-out",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideIn: {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(0)" },
				},
				slideUp: {
					"0%": { transform: "translateY(100%)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
			},
		},
	},
	plugins: [],
};
