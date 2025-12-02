"use client";

import React, { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../controllers/auth";

interface LoginRequiredProps {
	children: ReactNode;
	/** Custom message to show when login is required */
	message?: string;
	/** Whether to show the login required UI or just hide content */
	showWarning?: boolean;
	/** Redirect path for login button */
	loginPath?: string;
	/** Redirect path for signup button */
	signupPath?: string;
	/** Custom handler for login click */
	onLoginClick?: () => void;
	/** Custom handler for signup click */
	onSignupClick?: () => void;
	/** Custom handler for cancel click */
	onCancelClick?: () => void;
	/** Show cancel button */
	showCancel?: boolean;
	/** Custom loading component */
	loadingComponent?: ReactNode;
}

/**
 * LoginRequired - Wraps content that requires authentication
 *
 * Shows the children if the user is logged in.
 * Shows a login prompt UI if the user is not logged in.
 *
 * @example
 * ```tsx
 * <LoginRequired message="Please login to view your profile">
 *   <ProfileContent />
 * </LoginRequired>
 * ```
 */
export default function LoginRequired({
	children,
	message = "You must be logged in to access this section of TownSpark.",
	showWarning = true,
	loginPath = "/login",
	signupPath = "/register",
	onLoginClick,
	onSignupClick,
	onCancelClick,
	showCancel = true,
	loadingComponent,
}: LoginRequiredProps) {
	const router = useRouter();
	const { isLoggedIn, isInitialized, isLoading } = useAuthStore();

	const handleLoginClick = () => {
		if (onLoginClick) {
			onLoginClick();
		} else {
			// Store current path for redirect after login
			if (typeof window !== "undefined") {
				sessionStorage.setItem(
					"auth_redirect",
					window.location.pathname
				);
			}
			router.push(loginPath);
		}
	};

	const handleSignupClick = () => {
		if (onSignupClick) {
			onSignupClick();
		} else {
			if (typeof window !== "undefined") {
				sessionStorage.setItem(
					"auth_redirect",
					window.location.pathname
				);
			}
			router.push(signupPath);
		}
	};

	const handleCancelClick = () => {
		if (onCancelClick) {
			onCancelClick();
		} else {
			router.back();
		}
	};

	// Show loading state while checking auth
	if (!isInitialized || isLoading) {
		return loadingComponent ?? <AuthLoadingSpinner />;
	}

	// User is logged in, show children
	if (isLoggedIn) {
		return <>{children}</>;
	}

	// Not logged in and showWarning is false, show nothing
	if (!showWarning) {
		return null;
	}

	// Show login required UI
	return (
		<div className='relative flex h-auto min-h-screen w-full flex-col font-display group/design-root overflow-x-hidden'>
			{/* Header with Cancel */}
			{showCancel && (
				<div className='flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between'>
					<div className='flex size-12 shrink-0 items-center justify-start'></div>
					<div className='flex w-12 items-center justify-end'>
						<button
							onClick={handleCancelClick}
							className='text-primary text-base font-bold leading-normal tracking-[0.015em] shrink-0 cursor-pointer hover:opacity-80 transition-opacity'
						>
							Cancel
						</button>
					</div>
				</div>
			)}

			{/* Content */}
			<div className='flex flex-col items-center justify-center p-4 pt-12 text-center flex-grow'>
				{/* Icon */}
				<div className='flex items-center justify-center rounded-full bg-primary/20 h-20 w-20 mb-6'>
					<span
						className='material-symbols-outlined text-primary'
						style={{ fontSize: "48px" }}
					>
						lock
					</span>
				</div>

				{/* Headline */}
				<h1 className='text-slate-900 dark:text-white tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-2'>
					Login Required
				</h1>

				{/* Message */}
				<p className='text-slate-600 dark:text-slate-300 text-base font-normal leading-normal pb-3 pt-1 px-4 text-center max-w-md'>
					{message}
				</p>

				{/* Spacer */}
				<div className='flex-grow min-h-8'></div>

				{/* Buttons */}
				<div className='flex justify-center w-full'>
					<div className='flex flex-1 gap-3 max-w-[480px] flex-col items-stretch px-4 py-3'>
						<button
							onClick={handleLoginClick}
							className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full hover:opacity-90 transition-opacity'
						>
							<span className='truncate'>Log In</span>
						</button>
						<button
							onClick={handleSignupClick}
							className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold leading-normal tracking-[0.015em] w-full hover:opacity-90 transition-opacity'
						>
							<span className='truncate'>Sign Up</span>
						</button>
					</div>
				</div>
			</div>

			<div className='h-5 bg-background-light dark:bg-background-dark'></div>
		</div>
	);
}

/**
 * Default loading spinner component
 */
function AuthLoadingSpinner() {
	return (
		<div className='flex items-center justify-center min-h-[200px]'>
			<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
		</div>
	);
}
