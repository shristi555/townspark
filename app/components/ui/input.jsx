"use client";

import { forwardRef } from "react";

const Input = forwardRef(
	(
		{
			label,
			type = "text",
			placeholder,
			icon,
			error,
			helperText,
			fullWidth = true,
			className = "",
			inputClassName = "",
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
				<div className='relative flex w-full items-center'>
					{icon && (
						<div className='absolute left-3 flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark'>
							<span className='material-symbols-outlined text-xl'>
								{icon}
							</span>
						</div>
					)}
					<input
						ref={ref}
						type={type}
						placeholder={placeholder}
						className={`
							flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg
							text-text-primary-light dark:text-text-primary-dark
							bg-background-light dark:bg-background-dark
							border border-border-light dark:border-border-dark
							focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
							h-14 placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark
							p-4 text-base font-normal leading-normal
							${icon ? "pl-10" : ""}
							${error ? "border-status-reported focus:ring-status-reported/50" : ""}
							${inputClassName}
						`}
						{...props}
					/>
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

Input.displayName = "Input";

export default Input;
