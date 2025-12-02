"use client";

import React, { type ReactNode } from "react";
import { useAuthStore } from "../../controllers/auth";
import type { UserInfo } from "../../models/user_info";

interface AuthConditionalProps {
	/** Content to show when user is logged in */
	authenticated?: ReactNode;
	/** Content to show when user is not logged in */
	unauthenticated?: ReactNode;
	/** Content to show while checking auth status */
	loading?: ReactNode;
}

/**
 * AuthConditional - Renders different content based on authentication state
 *
 * Unlike guard components, this doesn't show access denied UI,
 * it just conditionally renders different content.
 *
 * @example
 * ```tsx
 * <AuthConditional
 *   authenticated={<UserMenu />}
 *   unauthenticated={<LoginButton />}
 *   loading={<Skeleton />}
 * />
 * ```
 */
export function AuthConditional({
	authenticated,
	unauthenticated,
	loading,
}: AuthConditionalProps) {
	const { isLoggedIn, isInitialized, isLoading } = useAuthStore();

	if (!isInitialized || isLoading) {
		return <>{loading ?? null}</>;
	}

	if (isLoggedIn) {
		return <>{authenticated ?? null}</>;
	}

	return <>{unauthenticated ?? null}</>;
}

interface RoleConditionalProps {
	/** Function to check if user has required role */
	check: (user: UserInfo) => boolean;
	/** Content to show when check passes */
	allowed?: ReactNode;
	/** Content to show when check fails */
	denied?: ReactNode;
	/** Content to show while checking */
	loading?: ReactNode;
	/** Content to show when not logged in */
	unauthenticated?: ReactNode;
}

/**
 * RoleConditional - Renders different content based on user role
 *
 * @example
 * ```tsx
 * <RoleConditional
 *   check={(user) => user.isAdmin}
 *   allowed={<AdminPanel />}
 *   denied={<RegularUserPanel />}
 * />
 * ```
 */
export function RoleConditional({
	check,
	allowed,
	denied,
	loading,
	unauthenticated,
}: RoleConditionalProps) {
	const { isLoggedIn, isInitialized, isLoading, userInfo } = useAuthStore();

	if (!isInitialized || isLoading) {
		return <>{loading ?? null}</>;
	}

	if (!isLoggedIn) {
		return <>{unauthenticated ?? denied ?? null}</>;
	}

	if (userInfo && check(userInfo)) {
		return <>{allowed ?? null}</>;
	}

	return <>{denied ?? null}</>;
}

interface ShowIfLoggedInProps {
	children: ReactNode;
	fallback?: ReactNode;
}

/**
 * ShowIfLoggedIn - Simple wrapper that shows children only if logged in
 *
 * @example
 * ```tsx
 * <ShowIfLoggedIn fallback={<LoginPrompt />}>
 *   <UserDashboard />
 * </ShowIfLoggedIn>
 * ```
 */
export function ShowIfLoggedIn({ children, fallback }: ShowIfLoggedInProps) {
	const { isLoggedIn, isInitialized } = useAuthStore();

	if (!isInitialized) {
		return null;
	}

	if (isLoggedIn) {
		return <>{children}</>;
	}

	return <>{fallback ?? null}</>;
}

interface ShowIfAdminProps {
	children: ReactNode;
	fallback?: ReactNode;
}

/**
 * ShowIfAdmin - Simple wrapper that shows children only if user is admin
 *
 * @example
 * ```tsx
 * <ShowIfAdmin>
 *   <DeleteButton />
 * </ShowIfAdmin>
 * ```
 */
export function ShowIfAdmin({ children, fallback }: ShowIfAdminProps) {
	const { isLoggedIn, isInitialized, userInfo } = useAuthStore();

	if (!isInitialized) {
		return null;
	}

	if (isLoggedIn && userInfo?.isAdmin) {
		return <>{children}</>;
	}

	return <>{fallback ?? null}</>;
}

interface ShowIfStaffProps {
	children: ReactNode;
	fallback?: ReactNode;
	/** Also show for admins (default: true) */
	includeAdmin?: boolean;
}

/**
 * ShowIfStaff - Simple wrapper that shows children only if user is staff
 *
 * @example
 * ```tsx
 * <ShowIfStaff>
 *   <StaffControls />
 * </ShowIfStaff>
 * ```
 */
export function ShowIfStaff({
	children,
	fallback,
	includeAdmin = true,
}: ShowIfStaffProps) {
	const { isLoggedIn, isInitialized, userInfo } = useAuthStore();

	if (!isInitialized) {
		return null;
	}

	const hasAccess =
		isLoggedIn &&
		(userInfo?.isStaff || (includeAdmin && userInfo?.isAdmin));

	if (hasAccess) {
		return <>{children}</>;
	}

	return <>{fallback ?? null}</>;
}

interface HideIfLoggedInProps {
	children: ReactNode;
}

/**
 * HideIfLoggedIn - Hides children if user is logged in
 *
 * @example
 * ```tsx
 * <HideIfLoggedIn>
 *   <SignUpBanner />
 * </HideIfLoggedIn>
 * ```
 */
export function HideIfLoggedIn({ children }: HideIfLoggedInProps) {
	const { isLoggedIn, isInitialized } = useAuthStore();

	if (!isInitialized) {
		return null;
	}

	if (isLoggedIn) {
		return null;
	}

	return <>{children}</>;
}

export default {
	AuthConditional,
	RoleConditional,
	ShowIfLoggedIn,
	ShowIfAdmin,
	ShowIfStaff,
	HideIfLoggedIn,
};
