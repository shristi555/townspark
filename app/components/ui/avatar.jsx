"use client";

/**
 * Get initials from a name string
 * @param {string} name - Full name
 * @returns {string} - Up to 2 initials (e.g., "John Doe" -> "JD")
 */
const getInitials = (name) => {
	if (!name || typeof name !== "string") return "?";

	const words = name.trim().split(/\s+/).filter(Boolean);
	if (words.length === 0) return "?";

	if (words.length === 1) {
		return words[0].charAt(0).toUpperCase();
	}

	return (
		words[0].charAt(0) + words[words.length - 1].charAt(0)
	).toUpperCase();
};

/**
 * Generate a consistent color based on the name
 * @param {string} name - Name to generate color for
 * @returns {string} - Tailwind background and text color classes
 */
const getColorFromName = (name) => {
	const colors = [
		{ bg: "bg-blue-500", text: "text-white" },
		{ bg: "bg-green-500", text: "text-white" },
		{ bg: "bg-purple-500", text: "text-white" },
		{ bg: "bg-orange-500", text: "text-white" },
		{ bg: "bg-pink-500", text: "text-white" },
		{ bg: "bg-teal-500", text: "text-white" },
		{ bg: "bg-indigo-500", text: "text-white" },
		{ bg: "bg-red-500", text: "text-white" },
		{ bg: "bg-cyan-500", text: "text-white" },
		{ bg: "bg-amber-500", text: "text-white" },
	];

	if (!name) return colors[0];

	// Generate a consistent hash from the name
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}

	return colors[Math.abs(hash) % colors.length];
};

export default function Avatar({
	src,
	alt = "Avatar",
	name,
	size = "md",
	fallback,
	className = "",
}) {
	const sizes = {
		xs: "size-6",
		sm: "size-8",
		md: "size-10",
		lg: "size-12",
		xl: "size-16",
		"2xl": "size-20",
	};

	const fallbackSizes = {
		xs: "text-xs",
		sm: "text-sm",
		md: "text-base",
		lg: "text-lg",
		xl: "text-xl",
		"2xl": "text-2xl",
	};

	// Determine the fallback text - use provided fallback, or generate from name
	const fallbackText = fallback || (name ? getInitials(name) : null);

	// Get color based on name for consistent avatar colors
	const colorClasses = getColorFromName(name || fallback || "");

	// Show fallback if no src or if src is empty/invalid
	if (!src && fallbackText) {
		return (
			<div
				className={`
					${sizes[size]}
					rounded-full ${colorClasses.bg} ${colorClasses.text}
					flex items-center justify-center font-semibold
					${fallbackSizes[size]}
					shadow-sm
					${className}
				`}
				title={name || alt}
			>
				{fallbackText}
			</div>
		);
	}

	// If no src and no fallback, show a default placeholder
	if (!src) {
		return (
			<div
				className={`
					${sizes[size]}
					rounded-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300
					flex items-center justify-center
					${fallbackSizes[size]}
					${className}
				`}
			>
				<span
					className='material-symbols-outlined'
					style={{ fontSize: "inherit" }}
				>
					person
				</span>
			</div>
		);
	}

	return (
		<div
			className={`
				${sizes[size]}
				rounded-full bg-center bg-no-repeat bg-cover shrink-0
				${className}
			`}
			style={{ backgroundImage: `url("${src}")` }}
			role='img'
			aria-label={alt}
		/>
	);
}
