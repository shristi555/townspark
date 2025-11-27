"use client";

import { forwardRef } from "react";

const Textarea = forwardRef(
	(
		{
			label,
			placeholder,
			error,
			helperText,
			fullWidth = true,
			rows = 4,
			className = "",
			textareaClassName = "",
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
				<textarea
					ref={ref}
					placeholder={placeholder}
					rows={rows}
					className={`
						flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg
						text-text-primary-light dark:text-text-primary-dark
						bg-background-light dark:bg-background-dark
						border border-border-light dark:border-border-dark
						focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
						placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark
						p-4 text-base font-normal leading-normal
						${error ? "border-status-reported focus:ring-status-reported/50" : ""}
						${textareaClassName}
					`}
					{...props}
				/>
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

Textarea.displayName = "Textarea";

export default Textarea;
