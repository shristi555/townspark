"use client";

import { forwardRef } from "react";

const Select = forwardRef(
	(
		{
			label,
			options = [],
			placeholder = "Select an option",
			error,
			helperText,
			fullWidth = true,
			className = "",
			selectClassName = "",
			...props
		},
		ref
	) => {
		return (
			<label
				className={`flex flex-col ${fullWidth ? "w-full" : ""} ${className}`}
			>
				{label && (
					<p className='text-text-primary-light dark:text-text-primary-dark text-base font-medium leading-normal pb-2'>
						{label}
					</p>
				)}
				<div className='relative'>
					<select
						ref={ref}
						className={`
							flex w-full min-w-0 flex-1 appearance-none rounded-lg
							text-text-primary-light dark:text-text-primary-dark
							bg-background-light dark:bg-background-dark
							border border-border-light dark:border-border-dark
							focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
							h-14 p-4 pr-10 text-base font-normal leading-normal
							cursor-pointer
							${error ? "border-status-reported focus:ring-status-reported/50" : ""}
							${selectClassName}
						`}
						{...props}
					>
						<option value='' disabled>
							{placeholder}
						</option>
						{options.map((option) => (
							<option
								key={option.value || option.id || option}
								value={option.value || option.id || option}
							>
								{option.label || option.name || option}
							</option>
						))}
					</select>
					<div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary-light dark:text-text-secondary-dark'>
						<span className='material-symbols-outlined'>
							expand_more
						</span>
					</div>
				</div>
				{(error || helperText) && (
					<p
						className={`text-sm mt-1 ${
							error
								? "text-status-reported"
								: "text-text-secondary-light dark:text-text-secondary-dark"
						}`}
					>
						{error || helperText}
					</p>
				)}
			</label>
		);
	}
);

Select.displayName = "Select";

export default Select;
