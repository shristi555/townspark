"use client";

import React, { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../controllers/auth";

interface GuestOnlyProps {
	children: ReactNode;
	/** Redirect path when user is already logged in */
	redirectTo?: string;
	/** Custom loading component */
	loadingComponent?: ReactNode;
	/** If true, will not redirect but just hide content */
	noRedirect?: boolean;
}

/**
 * GuestOnly - Wraps content that should only be visible to non-authenticated users
 *
 * Use this for login, register, forgot password pages, etc.
 * Redirects authenticated users to the specified path.
 *
 * @example
 * ```tsx
 * // In login page
 * <GuestOnly redirectTo="/dashboard">
 *   <LoginForm />
 * </GuestOnly>
 * ```
 */
export function GuestOnly({
	children,
	redirectTo = "/",
	loadingComponent,
	noRedirect = false,
}: GuestOnlyProps) {
	const router = useRouter();
	const { isLoggedIn, isInitialized, isLoading } = useAuthStore();

	useEffect(() => {
		if (isInitialized && isLoggedIn && !noRedirect) {
			// Check for stored redirect path from before login
			const storedRedirect = sessionStorage.getItem("auth_redirect");
			sessionStorage.removeItem("auth_redirect");
			router.push(storedRedirect ?? redirectTo);
		}
	}, [isInitialized, isLoggedIn, redirectTo, noRedirect, router]);

	// Show loading state while checking auth
	if (!isInitialized || isLoading) {
		return loadingComponent ?? <AuthLoadingSpinner />;
	}

	// User is logged in, show nothing (will redirect)
	if (isLoggedIn) {
		if (noRedirect) {
			return null;
		}
		// Show loading while redirecting
		return loadingComponent ?? <AuthLoadingSpinner />;
	}

	// User is not logged in, show children
	return <>{children}</>;
}

function AuthLoadingSpinner() {
	return (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
		</div>
	);
}

export default GuestOnly;
