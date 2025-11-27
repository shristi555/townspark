"use client";

export default function Card({
	children,
	className = "",
	padding = true,
	hover = false,
	onClick,
}) {
	return (
		<div
			className={`
				rounded-xl bg-card-light dark:bg-card-dark
				border border-border-light dark:border-border-dark
				shadow-card dark:shadow-card-dark
				${padding ? "p-4" : ""}
				${hover ? "hover:shadow-md dark:hover:shadow-lg transition-shadow cursor-pointer" : ""}
				${className}
			`}
			onClick={onClick}
		>
			{children}
		</div>
	);
}

export function CardHeader({ children, className = "" }) {
	return (
		<div className={`flex items-center justify-between mb-3 ${className}`}>
			{children}
		</div>
	);
}

export function CardContent({ children, className = "" }) {
	return <div className={`${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
	return (
		<div
			className={`border-t border-border-light dark:border-border-dark mt-3 pt-3 ${className}`}
		>
			{children}
		</div>
	);
}
