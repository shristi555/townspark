"use client";

export default function StatCard({
	label,
	value,
	icon,
	trend,
	variant = "default",
	className = "",
}) {
	const variants = {
		default:
			"bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark",
		primary:
			"bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30",
		accent: "bg-accent/10 dark:bg-accent/20 border border-accent/20 dark:border-accent/30",
	};

	return (
		<div
			className={`
				flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl p-4 shadow-sm
				${variants[variant]}
				${className}
			`}
		>
			<div className='flex items-center justify-between'>
				<p className='text-sm font-medium leading-normal text-text-secondary-light dark:text-text-secondary-dark'>
					{label}
				</p>
				{icon && (
					<span className='material-symbols-outlined text-primary text-xl'>
						{icon}
					</span>
				)}
			</div>
			<div className='flex items-baseline gap-2'>
				<p className='tracking-tight text-2xl font-bold leading-tight text-text-primary-light dark:text-text-primary-dark'>
					{value}
				</p>
				{trend && (
					<span
						className={`text-sm font-medium ${
							trend.startsWith("+")
								? "text-status-resolved"
								: trend.startsWith("-")
									? "text-status-reported"
									: "text-text-secondary-light dark:text-text-secondary-dark"
						}`}
					>
						{trend}
					</span>
				)}
			</div>
		</div>
	);
}
