"use client";

const badgeVariants = {
	reported: "bg-status-reported/20 text-status-reported",
	acknowledged: "bg-status-acknowledged/20 text-status-acknowledged",
	"in-progress": "bg-status-progress/20 text-status-progress",
	progress: "bg-status-progress/20 text-status-progress",
	resolved: "bg-status-resolved/20 text-status-resolved",
	active: "bg-status-resolved/20 text-status-resolved",
	suspended: "bg-status-progress/20 text-status-progress",
	banned: "bg-status-reported/20 text-status-reported",
	pending: "bg-status-progress/20 text-status-progress",
	verified: "bg-status-resolved/20 text-status-resolved",
	low: "bg-urgency-low/20 text-urgency-low",
	medium: "bg-urgency-medium/20 text-urgency-medium",
	high: "bg-urgency-high/20 text-urgency-high",
	default: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
};

const badgeSizes = {
	sm: "px-2 py-0.5 text-xs",
	md: "px-3 py-1 text-xs",
	lg: "px-4 py-1.5 text-sm",
};

export default function Badge({
	children,
	variant = "default",
	size = "md",
	icon,
	dot = false,
	className = "",
}) {
	return (
		<span
			className={`
				inline-flex items-center justify-center gap-1.5 rounded-full font-medium whitespace-nowrap
				${badgeVariants[variant] || badgeVariants.default}
				${badgeSizes[size]}
				${className}
			`}
		>
			{dot && (
				<span
					className={`
						size-2 rounded-full
						${
							variant === "active" ||
							variant === "resolved" ||
							variant === "verified"
								? "bg-status-resolved"
								: variant === "suspended" ||
									  variant === "in-progress" ||
									  variant === "progress" ||
									  variant === "pending" ||
									  variant === "medium"
									? "bg-status-progress"
									: variant === "banned" ||
										  variant === "reported" ||
										  variant === "high"
										? "bg-status-reported"
										: variant === "low"
											? "bg-urgency-low"
											: "bg-gray-500"
						}
					`}
				/>
			)}
			{icon && (
				<span className='material-symbols-outlined text-sm'>
					{icon}
				</span>
			)}
			{children}
		</span>
	);
}
