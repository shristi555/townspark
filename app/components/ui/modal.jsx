"use client";

import { useEffect } from "react";

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
	footer,
	size = "md",
	showCloseButton = true,
}) {
	const sizes = {
		sm: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-lg",
		xl: "max-w-xl",
		full: "max-w-4xl",
	};

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
			{/* Backdrop */}
			<div
				className='absolute inset-0 bg-black/50 animate-fade-in'
				onClick={onClose}
			/>
			{/* Modal */}
			<div
				className={`
					relative w-full ${sizes[size]}
					bg-card-light dark:bg-card-dark
					rounded-xl shadow-xl
					animate-slide-up
					max-h-[90vh] overflow-hidden flex flex-col
				`}
			>
				{/* Header */}
				{(title || showCloseButton) && (
					<div className='flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark'>
						{title && (
							<h2 className='text-lg font-bold text-text-primary-light dark:text-text-primary-dark'>
								{title}
							</h2>
						)}
						{showCloseButton && (
							<button
								onClick={onClose}
								className='flex items-center justify-center size-8 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark'
							>
								<span className='material-symbols-outlined'>
									close
								</span>
							</button>
						)}
					</div>
				)}
				{/* Content */}
				<div className='flex-1 overflow-y-auto p-4'>{children}</div>
				{/* Footer */}
				{footer && (
					<div className='p-4 border-t border-border-light dark:border-border-dark'>
						{footer}
					</div>
				)}
			</div>
		</div>
	);
}

// Bottom Sheet variant
export function BottomSheet({ isOpen, onClose, title, children }) {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-end'>
			{/* Backdrop */}
			<div
				className='absolute inset-0 bg-black/50 animate-fade-in'
				onClick={onClose}
			/>
			{/* Sheet */}
			<div className='relative w-full bg-card-light dark:bg-card-dark rounded-t-xl animate-slide-up'>
				{/* Handle */}
				<div className='flex justify-center py-2'>
					<div className='w-10 h-1 bg-border-light dark:bg-border-dark rounded-full' />
				</div>
				{/* Title */}
				{title && (
					<div className='text-center pb-4'>
						<p className='text-lg font-bold text-text-primary-light dark:text-text-primary-dark'>
							{title}
						</p>
					</div>
				)}
				{/* Content */}
				<div className='p-4 pt-0 max-h-[70vh] overflow-y-auto'>
					{children}
				</div>
			</div>
		</div>
	);
}
