"use client";

export default function EmptyState({
	icon = "inbox",
	title = "No data found",
	description = "There's nothing here yet.",
	action,
	className = "",
}) {
	return (
		<div
			className={`
				flex flex-col items-center justify-center text-center py-12 px-4
				${className}
			`}
		>
			<div className='flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-4'>
				<span className='material-symbols-outlined text-4xl'>
					{icon}
				</span>
			</div>
			<h3 className='text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-2'>
				{title}
			</h3>
			<p className='text-text-secondary-light dark:text-text-secondary-dark mb-4 max-w-sm'>
				{description}
			</p>
			{action}
		</div>
	);
}
