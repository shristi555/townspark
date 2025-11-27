"use client";

export default function FilterChip({
	label,
	icon,
	isActive = false,
	hasDropdown = false,
	onClick,
	className = "",
}) {
	return (
		<button
			onClick={onClick}
			className={`
				flex h-9 shrink-0 items-center justify-center gap-2 rounded-full px-4 transition-colors
				${
					isActive
						? "bg-primary text-white"
						: "bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5"
				}
				${className}
			`}
		>
			{icon && (
				<span className='material-symbols-outlined text-base'>
					{icon}
				</span>
			)}
			<span className='text-sm font-medium leading-normal'>{label}</span>
			{hasDropdown && (
				<span className='material-symbols-outlined text-base'>
					arrow_drop_down
				</span>
			)}
		</button>
	);
}

export function FilterChipGroup({ children, className = "" }) {
	return (
		<div
			className={`flex gap-2 overflow-x-auto scrollbar-hide pb-1 ${className}`}
		>
			{children}
		</div>
	);
}
