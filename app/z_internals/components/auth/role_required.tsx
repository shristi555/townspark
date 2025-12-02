"use client";

import React, { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../controllers/auth";
import type { UserInfo } from "../../models/user_info";

type RoleCheckFn = (user: UserInfo) => boolean;

interface RoleRequiredProps {
	children: ReactNode;
	/** Role check function - receives UserInfo and returns boolean */
	roleCheck: RoleCheckFn;
	/** Title to show when access is denied */
	title?: string;
	/** Custom message to show when access is denied */
	message?: string;
	/** Icon name from Material Symbols */
	icon?: string;
	/** Icon color class */
	iconColorClass?: string;
	/** Redirect path for primary button */
	primaryPath?: string;
	/** Primary button text */
	primaryButtonText?: string;
	/** Custom handler for primary button click */
	onPrimaryClick?: () => void;
	/** Custom handler for logout click */
	onLogoutClick?: () => void;
	/** Custom loading component */
	loadingComponent?: ReactNode;
	/** Fallback component when role check fails */
	fallback?: ReactNode;
	/** Require login first (default: true) */
	requireLogin?: boolean;
}

/**
 * RoleRequired - Flexible wrapper for custom role-based access control
 *
 * Accepts a custom role check function for maximum flexibility.
 *
 * @example
 * ```tsx
 * // Check if user is admin or staff
 * <RoleRequired
 *   roleCheck={(user) => user.isAdmin || user.isStaff}
 *   title="Authorized Personnel Only"
 *   message="This area is restricted to authorized personnel."
 * >
 *   <SensitiveContent />
 * </RoleRequired>
 *
 * // Check by email domain
 * <RoleRequired
 *   roleCheck={(user) => user.email.endsWith('@company.com')}
 *   title="Company Access Required"
 * >
 *   <InternalContent />
 * </RoleRequired>
 * ```
 */
export function RoleRequired({
	children,
	roleCheck,
	title = "Access Denied",
	message = "You don't have permission to access this section.",
	icon = "block",
	iconColorClass = "text-red-500",
	primaryPath = "/",
	primaryButtonText = "Go to Dashboard",
	onPrimaryClick,
	onLogoutClick,
	loadingComponent,
	fallback,
	requireLogin = true,
}: RoleRequiredProps) {
	const router = useRouter();
	const { isLoggedIn, isInitialized, isLoading, userInfo, logout } =
		useAuthStore();

	const handlePrimaryClick = () => {
		if (onPrimaryClick) {
			onPrimaryClick();
		} else {
			router.push(primaryPath);
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

	// Not logged in
	if (!isLoggedIn) {
		if (requireLogin) {
			return <LoginRequiredUI />;
		}
		// If login not required, check fails
		if (fallback) return <>{fallback}</>;
		return (
			<AccessDeniedUI
				{...{
					title,
					message,
					icon,
					iconColorClass,
					primaryButtonText,
					handlePrimaryClick,
					handleLogoutClick,
					userInfo,
					showLogout: false,
				}}
			/>
		);
	}

	// User is logged in, check role
	if (userInfo && roleCheck(userInfo)) {
		return <>{children}</>;
	}

	// Custom fallback if provided
	if (fallback) {
		return <>{fallback}</>;
	}

	// Show access denied UI
	return (
		<AccessDeniedUI
			title={title}
			message={message}
			icon={icon}
			iconColorClass={iconColorClass}
			primaryButtonText={primaryButtonText}
			handlePrimaryClick={handlePrimaryClick}
			handleLogoutClick={handleLogoutClick}
			userInfo={userInfo}
			showLogout={true}
		/>
	);
}

interface AccessDeniedUIProps {
	title: string;
	message: string;
	icon: string;
	iconColorClass: string;
	primaryButtonText: string;
	handlePrimaryClick: () => void;
	handleLogoutClick: () => void;
	userInfo: UserInfo | null;
	showLogout: boolean;
}

function AccessDeniedUI({
	title,
	message,
	icon,
	iconColorClass,
	primaryButtonText,
	handlePrimaryClick,
	handleLogoutClick,
	userInfo,
	showLogout,
}: AccessDeniedUIProps) {
	return (
		<div className='relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden'>
			<div className='flex min-h-screen w-full grow flex-col items-center justify-center p-4'>
				<div className='flex w-full max-w-md flex-col items-center justify-center text-center'>
					{/* Icon */}
					<div
						className={`flex items-center justify-center w-20 h-20 mb-6 rounded-full ${iconColorClass}/20`}
					>
						<span
							className={`material-symbols-outlined ${iconColorClass}`}
							style={{ fontSize: "48px" }}
						>
							{icon}
						</span>
					</div>

					{/* Headline */}
					<h1 className='text-slate-900 dark:text-white tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-2'>
						{title}
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
								onClick={handlePrimaryClick}
								className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full hover:opacity-90 transition-opacity'
							>
								<span className='truncate'>
									{primaryButtonText}
								</span>
							</button>
							{showLogout && (
								<button
									onClick={handleLogoutClick}
									className='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold leading-normal tracking-[0.015em] w-full hover:opacity-90 transition-opacity'
								>
									<span className='truncate'>Log Out</span>
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Simple login required UI
 */
function LoginRequiredUI() {
	const router = useRouter();

	return (
		<div className='relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden'>
			<div className='flex min-h-screen w-full grow flex-col items-center justify-center p-4'>
				<div className='flex w-full max-w-md flex-col items-center justify-center text-center'>
					<div className='flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-primary/20'>
						<span
							className='material-symbols-outlined text-primary'
							style={{ fontSize: "48px" }}
						>
							lock
						</span>
					</div>
					<h1 className='text-slate-900 dark:text-white tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-2'>
						Login Required
					</h1>
					<p className='text-slate-600 dark:text-slate-300 text-base font-normal leading-normal pb-3 pt-1 px-4 text-center max-w-sm'>
						You must be logged in to access this content.
					</p>
					<div className='h-8'></div>
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

function AuthLoadingSpinner() {
	return (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
		</div>
	);
}

export default RoleRequired;
