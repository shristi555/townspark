"use client";

export default function Loader({ size = "md", className = "" }) {
	const sizes = {
		sm: "size-5",
		md: "size-8",
		lg: "size-12",
	};

	return (
		<div className={`flex items-center justify-center ${className}`}>
			<span
				className={`
					material-symbols-outlined animate-spin text-primary
					${sizes[size]}
				`}
				style={{
					fontSize:
						size === "sm"
							? "20px"
							: size === "lg"
								? "48px"
								: "32px",
				}}
			>
				progress_activity
			</span>
		</div>
	);
}

export function PageLoader() {
	return (
		<div className='flex items-center justify-center min-h-[50vh]'>
			<Loader size='lg' />
		</div>
	);
}

export function FullPageLoader() {
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-background-light dark:bg-background-dark'>
			<div className='flex flex-col items-center gap-4'>
				<Loader size='lg' />
				<p className='text-text-secondary-light dark:text-text-secondary-dark'>
					Loading...
				</p>
			</div>
		</div>
	);
}
