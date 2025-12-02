import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
	useAuthStore,
	type AuthStore,
	type ValidationErrors,
} from "./auth_store";

// ============ Bridge atoms (sync Zustand state to Jotai) ============

/**
 * These atoms bridge the Zustand store to Jotai for components
 * that prefer Jotai's API or need derived/computed atoms
 */

// Base atoms that sync with Zustand store
export const isLoggedInAtom = atom((get) => useAuthStore.getState().isLoggedIn);
export const isLoadingAtom = atom((get) => useAuthStore.getState().isLoading);
export const isInitializedAtom = atom(
	(get) => useAuthStore.getState().isInitialized
);
export const userInfoAtom = atom((get) => useAuthStore.getState().userInfo);
export const errorMessageAtom = atom(
	(get) => useAuthStore.getState().errorMessage
);
export const validationErrorsAtom = atom(
	(get) => useAuthStore.getState().validationErrors
);

// ============ Derived/Computed Atoms ============

/**
 * Check if there are any validation errors
 */
export const hasValidationErrorsAtom = atom((get) => {
	const errors = get(validationErrorsAtom);
	return errors !== null && Object.keys(errors).length > 0;
});

/**
 * Get user's display name
 */
export const userDisplayNameAtom = atom((get) => {
	const userInfo = get(userInfoAtom);
	return userInfo?.displayName ?? "Guest";
});

/**
 * Get user's initials for avatar
 */
export const userInitialsAtom = atom((get) => {
	const userInfo = get(userInfoAtom);
	return userInfo?.initials ?? "?";
});

/**
 * Check if user is authenticated and initialized
 */
export const isAuthenticatedAtom = atom((get) => {
	return get(isLoggedInAtom) && get(isInitializedAtom);
});

/**
 * Check if auth is still loading (initial check)
 */
export const isAuthCheckingAtom = atom((get) => {
	return !get(isInitializedAtom) || get(isLoadingAtom);
});

/**
 * Get user role
 */
export const userRoleAtom = atom((get) => {
	const userInfo = get(userInfoAtom);
	return userInfo?.role ?? null;
});

/**
 * Check if user is admin
 */
export const isAdminAtom = atom((get) => {
	const role = get(userRoleAtom);
	return role === "admin";
});

/**
 * Check if user has a profile image
 */
export const hasProfileImageAtom = atom((get) => {
	const userInfo = get(userInfoAtom);
	return !!userInfo?.profileImage;
});

// ============ Field Error Atoms Factory ============

/**
 * Creates an atom that returns the validation error for a specific field
 */
export function createFieldErrorAtom(fieldName: string) {
	return atom((get) => {
		const errors = get(validationErrorsAtom);
		if (!errors || !(fieldName in errors)) return null;
		return errors[fieldName]?.[0] ?? null;
	});
}

/**
 * Creates an atom that checks if a specific field has an error
 */
export function createFieldHasErrorAtom(fieldName: string) {
	return atom((get) => {
		const errors = get(validationErrorsAtom);
		if (!errors) return false;
		return fieldName in errors;
	});
}

// ============ Common Field Error Atoms ============

export const emailErrorAtom = createFieldErrorAtom("email");
export const passwordErrorAtom = createFieldErrorAtom("password");
export const fullNameErrorAtom = createFieldErrorAtom("fullName");
export const phoneNumberErrorAtom = createFieldErrorAtom("phoneNumber");
export const addressErrorAtom = createFieldErrorAtom("address");
export const confirmPasswordErrorAtom = createFieldErrorAtom("confirmPassword");

// ============ Writable Atoms for Actions ============

/**
 * Atom to trigger login
 */
export const loginAtom = atom(
	null,
	async (
		get,
		set,
		{
			email,
			password,
			redirect,
			rememberMe = false,
		}: {
			email: string;
			password: string;
			redirect?: string;
			rememberMe?: boolean;
		}
	) => {
		await useAuthStore
			.getState()
			.login(email, password, { redirect, rememberMe });
	}
);

/**
 * Atom to trigger logout
 */
export const logoutAtom = atom(null, async (get, set) => {
	await useAuthStore.getState().logout();
});

/**
 * Atom to check login status
 */
export const checkLoginStatusAtom = atom(null, async (get, set) => {
	await useAuthStore.getState().checkLoginStatus();
});

/**
 * Atom to clear errors
 */
export const clearErrorAtom = atom(null, (get, set) => {
	useAuthStore.getState().clearError();
});

// ============ Custom Hooks for easier usage ============

/**
 * Hook to get field error for a specific field
 */
export function useFieldError(fieldName: string): string | null {
	const errors = useAuthStore((state) => state.validationErrors);
	if (!errors || !(fieldName in errors)) return null;
	return errors[fieldName]?.[0] ?? null;
}

/**
 * Hook to check if a field has error
 */
export function useFieldHasError(fieldName: string): boolean {
	const errors = useAuthStore((state) => state.validationErrors);
	if (!errors) return false;
	return fieldName in errors;
}

/**
 * Hook for auth actions
 */
export function useAuthActions() {
	const store = useAuthStore();
	return {
		login: store.login,
		signup: store.signup,
		logout: store.logout,
		getUserInfo: store.getUserInfo,
		updateProfile: store.updateProfile,
		changePassword: store.changePassword,
		checkLoginStatus: store.checkLoginStatus,
		clearError: store.clearError,
	};
}

/**
 * Hook for auth state
 */
export function useAuthState() {
	const store = useAuthStore();
	return {
		isLoggedIn: store.isLoggedIn,
		isLoading: store.isLoading,
		isInitialized: store.isInitialized,
		userInfo: store.userInfo,
		errorMessage: store.errorMessage,
		validationErrors: store.validationErrors,
	};
}

/**
 * Hook for user info only
 */
export function useUserInfo() {
	return useAuthStore((state) => state.userInfo);
}

/**
 * Hook for checking if authenticated
 */
export function useIsAuthenticated() {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
	const isInitialized = useAuthStore((state) => state.isInitialized);
	return isLoggedIn && isInitialized;
}

export default {
	// Atoms
	isLoggedInAtom,
	isLoadingAtom,
	isInitializedAtom,
	userInfoAtom,
	errorMessageAtom,
	validationErrorsAtom,
	hasValidationErrorsAtom,
	userDisplayNameAtom,
	userInitialsAtom,
	isAuthenticatedAtom,
	isAuthCheckingAtom,
	// Hooks
	useFieldError,
	useFieldHasError,
	useAuthActions,
	useAuthState,
	useUserInfo,
	useIsAuthenticated,
};
