"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "./auth_store";
import React from "react";

interface AuthProviderProps {
	children: ReactNode;
}

/**
 * AuthProvider component that initializes auth state on app load.
 * Wrap your app or layout with this component to enable automatic
 * token verification and user session restoration.
 *
 * @example
 * ```tsx
 * // In layout.tsx or _app.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <AuthProvider>
 *       {children}
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export function AuthProvider({ children }: AuthProviderProps) {
	const checkLoginStatus = useAuthStore((state) => state.checkLoginStatus);
	const isInitialized = useAuthStore((state) => state.isInitialized);

	useEffect(() => {
		// Check login status on mount
		checkLoginStatus();
	}, [checkLoginStatus]);

	return <>{children}</>;
}

/**
 * AuthGuard component that protects routes requiring authentication.
 * Redirects to login page if user is not authenticated.
 *
 * @example
 * ```tsx
 * // In a protected page
 * export default function DashboardPage() {
 *   return (
 *     <AuthGuard redirectTo="/login">
 *       <Dashboard />
 *     </AuthGuard>
 *   );
 * }
 * ```
 */
interface AuthGuardProps {
	children: ReactNode;
	redirectTo?: string;
	fallback?: ReactNode;
}

export function AuthGuard({
	children,
	redirectTo = "/login",
	fallback,
}: AuthGuardProps) {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
	const isInitialized = useAuthStore((state) => state.isInitialized);
	const isLoading = useAuthStore((state) => state.isLoading);

	useEffect(() => {
		if (isInitialized && !isLoggedIn && typeof window !== "undefined") {
			// Store current path for redirect after login
			const currentPath = window.location.pathname;
			if (currentPath !== redirectTo) {
				sessionStorage.setItem("auth_redirect", currentPath);
			}
			window.location.href = redirectTo;
		}
	}, [isInitialized, isLoggedIn, redirectTo]);

	// Show loading or fallback while checking auth
	if (!isInitialized || isLoading) {
		return fallback ?? <AuthLoadingFallback />;
	}

	// Don't render children if not logged in
	if (!isLoggedIn) {
		return fallback ?? <AuthLoadingFallback />;
	}

	return <>{children}</>;
}

/**
 * GuestGuard component that protects routes that should only be accessible to guests.
 * Redirects to dashboard/home if user is already authenticated.
 *
 * @example
 * ```tsx
 * // In login page
 * export default function LoginPage() {
 *   return (
 *     <GuestGuard redirectTo="/dashboard">
 *       <LoginForm />
 *     </GuestGuard>
 *   );
 * }
 * ```
 */
interface GuestGuardProps {
	children: ReactNode;
	redirectTo?: string;
	fallback?: ReactNode;
}

export function GuestGuard({
	children,
	redirectTo = "/",
	fallback,
}: GuestGuardProps) {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
	const isInitialized = useAuthStore((state) => state.isInitialized);

	useEffect(() => {
		if (isInitialized && isLoggedIn && typeof window !== "undefined") {
			// Check for stored redirect path
			const storedRedirect = sessionStorage.getItem("auth_redirect");
			sessionStorage.removeItem("auth_redirect");
			window.location.href = storedRedirect ?? redirectTo;
		}
	}, [isInitialized, isLoggedIn, redirectTo]);

	// Show loading while checking auth
	if (!isInitialized) {
		return fallback ?? <AuthLoadingFallback />;
	}

	// Don't render children if logged in
	if (isLoggedIn) {
		return fallback ?? <AuthLoadingFallback />;
	}

	return <>{children}</>;
}

/**
 * Default loading fallback component
 */
function AuthLoadingFallback() {
	return (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
		</div>
	);
}

export default AuthProvider;
