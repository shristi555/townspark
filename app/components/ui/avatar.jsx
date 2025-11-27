"use client";

export default function Avatar({
	src,
	alt = "Avatar",
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

	if (!src && fallback) {
		return (
			<div
				className={`
					${sizes[size]}
					rounded-full bg-primary/20 text-primary
					flex items-center justify-center font-bold
					${fallbackSizes[size]}
					${className}
				`}
			>
				{fallback}
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
