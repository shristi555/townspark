"use client";

import { forwardRef } from "react";

const buttonVariants = {
	primary: "bg-primary text-white hover:bg-primary-dark shadow-sm",
	secondary:
		"bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800",
	ghost: "bg-transparent text-text-primary-light dark:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5",
	danger: "bg-status-reported text-white hover:bg-red-600 shadow-sm",
	success: "bg-status-resolved text-white hover:bg-green-600 shadow-sm",
	accent: "bg-accent text-white hover:bg-orange-600 shadow-sm",
};

const buttonSizes = {
	sm: "h-9 px-3 text-sm",
	md: "h-11 px-4 text-base",
	lg: "h-14 px-6 text-lg",
	icon: "h-10 w-10",
};

const Button = forwardRef(
	(
		{
			children,
			variant = "primary",
			size = "md",
			icon,
			iconPosition = "left",
			fullWidth = false,
			disabled = false,
			loading = false,
			className = "",
			...props
		},
		ref
	) => {
		const baseStyles =
			"inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed";

		return (
			<button
				ref={ref}
				disabled={disabled || loading}
				className={`${baseStyles} ${buttonVariants[variant]} ${buttonSizes[size]} ${
					fullWidth ? "w-full" : ""
				} ${className}`}
				{...props}
			>
				{loading && (
					<span className='material-symbols-outlined animate-spin text-xl'>
						progress_activity
					</span>
				)}
				{!loading && icon && iconPosition === "left" && (
					<span className='material-symbols-outlined text-xl'>
						{icon}
					</span>
				)}
				{children}
				{!loading && icon && iconPosition === "right" && (
					<span className='material-symbols-outlined text-xl'>
						{icon}
					</span>
				)}
			</button>
		);
	}
);

Button.displayName = "Button";

export default Button;
