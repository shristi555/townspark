"use client";

export default function Toggle({
	checked = false,
	onChange,
	disabled = false,
	label,
	description,
	className = "",
}) {
	return (
		<div className={`flex items-center justify-between ${className}`}>
			{(label || description) && (
				<div className='flex-1'>
					{label && (
						<p className='text-text-primary-light dark:text-text-primary-dark text-base font-medium'>
							{label}
						</p>
					)}
					{description && (
						<p className='text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1'>
							{description}
						</p>
					)}
				</div>
			)}
			<button
				type='button'
				role='switch'
				aria-checked={checked}
				disabled={disabled}
				onClick={() => onChange?.(!checked)}
				className={`
					relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
					border-2 border-transparent transition-colors duration-200 ease-in-out
					focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
					focus:ring-offset-background-light dark:focus:ring-offset-background-dark
					disabled:opacity-50 disabled:cursor-not-allowed
					${checked ? "bg-primary" : "bg-border-light dark:bg-border-dark"}
				`}
			>
				<span
					className={`
						pointer-events-none inline-block h-5 w-5 transform rounded-full
						bg-white shadow ring-0 transition duration-200 ease-in-out
						${checked ? "translate-x-5" : "translate-x-0"}
					`}
				/>
			</button>
		</div>
	);
}
