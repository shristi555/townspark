/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}", // If using the `app` directory
	],
	theme: {
		extend: {
			darkMode: "class",
			theme: {
				extend: {
					colors: {
						primary: "#4A90E2",
						"background-light": "#f6f7f8",
						"background-dark": "#101822",
					},
					fontFamily: {
						display: ["Public Sans"],
					},
					borderRadius: {
						DEFAULT: "0.25rem",
						lg: "0.5rem",
						xl: "0.75rem",
						full: "9999px",
					},
				},
			},
		},
	},
	plugins: [],
};
