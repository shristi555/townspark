"use client";

import { useState, useEffect } from "react";

const toastVariants = {
	success: {
		bg: "bg-status-resolved",
		icon: "check_circle",
	},
	error: {
		bg: "bg-status-reported",
		icon: "error",
	},
	warning: {
		bg: "bg-status-progress",
		icon: "warning",
	},
	info: {
		bg: "bg-primary",
		icon: "info",
	},
};

export default function Toast({
	message,
	variant = "info",
	duration = 3000,
	onClose,
	isVisible,
}) {
	useEffect(() => {
		if (isVisible && duration > 0) {
			const timer = setTimeout(() => {
				onClose?.();
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [isVisible, duration, onClose]);

	if (!isVisible) return null;

	const { bg, icon } = toastVariants[variant] || toastVariants.info;

	return (
		<div className='fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up'>
			<div
				className={`
					${bg} text-white
					px-4 py-3 rounded-full
					flex items-center gap-2
					shadow-lg
					text-sm font-medium
				`}
			>
				<span className='material-symbols-outlined text-xl'>
					{icon}
				</span>
				{message}
			</div>
		</div>
	);
}

// Toast container and hook for managing multiple toasts
export function useToast() {
	const [toasts, setToasts] = useState([]);

	const showToast = (message, variant = "info", duration = 3000) => {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, message, variant, duration }]);
	};

	const hideToast = (id) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	};

	const ToastContainer = () => (
		<>
			{toasts.map((toast, index) => (
				<div
					key={toast.id}
					style={{ bottom: `${(index + 1) * 60}px` }}
					className='fixed left-1/2 -translate-x-1/2 z-50'
				>
					<Toast
						message={toast.message}
						variant={toast.variant}
						duration={toast.duration}
						isVisible={true}
						onClose={() => hideToast(toast.id)}
					/>
				</div>
			))}
		</>
	);

	return { showToast, ToastContainer };
}
