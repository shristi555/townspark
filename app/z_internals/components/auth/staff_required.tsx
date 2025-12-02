"use client";

import React, { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../controllers/auth";

interface StaffRequiredProps {
	children: ReactNode;
	/** Custom message to show when staff access is required */
	message?: string;
	/** Redirect path for dashboard/home button */
	dashboardPath?: string;
	/** Custom handler for dashboard click */
	onDashboardClick?: () => void;
	/** Custom handler for logout click */
	onLogoutClick?: () => void;
	/** Custom loading component */
	loadingComponent?: ReactNode;
	/** Fallback component when not staff (instead of default UI) */
	fallback?: ReactNode;
	/** Also allow admins (default: true) */
	allowAdmin?: boolean;
}

/**
 * StaffRequired - Wraps content that requires staff or admin privileges
 *
 * Shows the children if the user is logged in AND is staff (or admin if allowAdmin is true).
 * Shows a login prompt if the user is not logged in.
 * Shows an access denied UI if the user is logged in but not staff.
 *
 * @example
 * ```tsx
 * <StaffRequired message="Only staff can resolve issues">
 *   <IssueResolutionPanel />
 * </StaffRequired>
 * ```
 */
export function StaffRequired({
	children,
	message = "You must be a staff member to access this section of TownSpark.",
	dashboardPath = "/",
	onDashboardClick,
	onLogoutClick,
	loadingComponent,
	fallback,
	allowAdmin = true,
}: StaffRequiredProps) {
	const router = useRouter();
	const { isLoggedIn, isInitialized, isLoading, userInfo, logout } =
		useAuthStore();

	const handleDashboardClick = () => {
		if (onDashboardClick) {
			onDashboardClick();
		} else {
			router.push(dashboardPath);
		}
	};

	const handleLogoutClick = async () => {
		if (onLogoutClick) {
			onLogoutClick();
		} else {
			await logout();
			router.push("/login");
		}
	};

	// Show loading state while checking auth
	if (!isInitialized || isLoading) {
		return loadingComponent ?? <AuthLoadingSpinner />;
	}

	// Not logged in - show login required
	if (!isLoggedIn) {
		return <LoginRequiredUI />;
	}

	// User is staff or admin (if allowed), show children
	const hasAccess = userInfo?.isStaff || (allowAdmin && userInfo?.isAdmin);
	if (hasAccess) {
		return <>{children}</>;
	}

	// Custom fallback if provided
	if (fallback) {
		return <>{fallback}</>;
	}

	// Show staff access required UI
	return (
		<div className='relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display group/design-root overflow-x-hidden'>
			<div className='flex min-h-screen w-full grow flex-col items-center justify-center p-4'>
				<div className='flex w-full max-w-md flex-col items-center justify-center text-center'>
					{/* Icon */}
					<div className='flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-orange-500/20'>
						<span
							className='material-symbols-outlined text-orange-500'
							style={{ fontSize: "48px" }}
						>
							badge
						</span>
					</div>

					{/* Headline */}
					<h1 className='text-slate-900 dark:text-white tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-2'>
						Staff Access Required
					</h1>

					{/* Message */}
					<p className='text-slate-600 dark:text-slate-300 text-base font-normal leading-normal pb-3 pt-1 px-4 text-center max-w-sm'>
						{message}
					</p>

					{/* Current user info */}
					{userInfo && (
						<p className='text-slate-500 dark:text-slate-400 text-sm font-normal pb-3 px-4 text-center'>
							Logged in as: {userInfo.displayName}
						</p>
					)}

					{/* Spacer */}
					<div className='h-8'></div>

					{/* Buttons */}
					<div className='w-full'>
						<div className='flex flex-1 gap-3 max-w-[480px] flex-col items-stretch px-4 py-3'>
							<button
								onClick={handleDashboardClick}
								className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full hover:opacity-90 transition-opacity'
							>
								<span className='truncate'>
									Go to Dashboard
								</span>
							</button>
							<button
								onClick={handleLogoutClick}
								className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold leading-normal tracking-[0.015em] w-full hover:opacity-90 transition-opacity'
							>
								<span className='truncate'>Log Out</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Simple login required UI for when user is not logged in at all
 */
function LoginRequiredUI() {
	const router = useRouter();

	return (
		<div className='relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden'>
			<div className='flex min-h-screen w-full grow flex-col items-center justify-center p-4'>
				<div className='flex w-full max-w-md flex-col items-center justify-center text-center'>
					{/* Icon */}
					<div className='flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-primary/20'>
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
					<p className='text-slate-600 dark:text-slate-300 text-base font-normal leading-normal pb-3 pt-1 px-4 text-center max-w-sm'>
						You must be logged in to access staff features.
					</p>

					{/* Spacer */}
					<div className='h-8'></div>

					{/* Buttons */}
					<div className='w-full'>
						<div className='flex flex-1 gap-3 max-w-[480px] flex-col items-stretch px-4 py-3'>
							<button
								onClick={() => router.push("/login")}
								className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full hover:opacity-90 transition-opacity'
							>
								<span className='truncate'>Log In</span>
							</button>
							<button
								onClick={() => router.push("/")}
								className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold leading-normal tracking-[0.015em] w-full hover:opacity-90 transition-opacity'
							>
								<span className='truncate'>Go Home</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Default loading spinner component
 */
function AuthLoadingSpinner() {
	return (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
		</div>
	);
}

export default StaffRequired;
