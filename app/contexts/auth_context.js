"use client";

/**
 * Auth Context
 * Manages authentication state across the application
 * Uses cookie-based token storage for SSR compatibility
 */

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import { AuthService, UserService, TokenManager } from "../modules";

const AuthContext = createContext(null);

/**
 * User-friendly error messages for authentication operations
 */
const AUTH_ERROR_MESSAGES = {
	login: {
		default:
			"Unable to sign in. Please check your credentials and try again.",
		network: "Connection failed. Please check your internet and try again.",
		invalid_credentials: "Invalid email or password. Please try again.",
		account_inactive: "Your account is inactive. Please contact support.",
	},
	register: {
		default: "Unable to create account. Please try again.",
		email_exists: "An account with this email already exists.",
		invalid_data: "Please check your information and try again.",
		password_weak: "Password is too weak. Please use a stronger password.",
	},
	fetchUser: {
		default: "Unable to load your profile. Please refresh the page.",
		unauthorized: "Your session has expired. Please sign in again.",
	},
	logout: {
		default:
			"Unable to sign out properly. Your session will expire automatically.",
	},
};

/**
 * Log authentication errors with detailed information for developers
 * @param {string} action - The action being performed (login, register, etc.)
 * @param {any} error - The error object or response
 * @param {Object} context - Additional context information
 */
const logAuthError = (action, error, context = {}) => {
	const timestamp = new Date().toISOString();

	console.group(`🔐 [AuthContext] ${action} Error - ${timestamp}`);
	console.error("Action:", action);
	console.error("Error:", error);

	const status = error?.statusCode || error?.status;
	if (status) console.error("Status:", status);
	if (error?.error_code || error?.errorCode)
		console.error("Error Code:", error.error_code || error.errorCode);
	if (error?.errors) console.error("Validation Errors:", error.errors);
	if (error?.devMessage) console.error("Dev Message:", error.devMessage);

	if (Object.keys(context).length > 0) {
		console.error("Context:", context);
	}

	console.groupEnd();
};

/**
 * Extract user-friendly error message from API response
 * @param {any} error - Error object or string
 * @param {string} action - The action being performed
 * @returns {string} User-friendly error message
 */
const getAuthErrorMessage = (error, action) => {
	const actionMessages = AUTH_ERROR_MESSAGES[action] || {};

	// Handle network errors
	if (
		!error ||
		error === "Network Error" ||
		error?.message === "Network Error"
	) {
		return (
			actionMessages.network ||
			"Connection failed. Please check your internet."
		);
	}

	// Handle string errors
	if (typeof error === "string") {
		// Check if it's a known error type
		const lowerError = error.toLowerCase();
		if (
			lowerError.includes("credential") ||
			lowerError.includes("password")
		) {
			return actionMessages.invalid_credentials || error;
		}
		if (lowerError.includes("email") && lowerError.includes("exist")) {
			return actionMessages.email_exists || error;
		}
		return error;
	}

	// Handle object errors
	if (typeof error === "object") {
		// Check for specific error codes
		if (error.error_code) {
			const codeMessage = actionMessages[error.error_code];
			if (codeMessage) return codeMessage;
		}

		// Check for user-friendly message from API
		if (typeof error.message === "string" && error.message.length < 200) {
			return error.message;
		}
		if (typeof error.detail === "string" && error.detail.length < 200) {
			return error.detail;
		}

		// Handle nested error
		if (error.error) {
			return getAuthErrorMessage(error.error, action);
		}

		// Handle validation errors
		if (error.errors && typeof error.errors === "object") {
			const firstError = Object.values(error.errors)[0];
			if (Array.isArray(firstError) && firstError.length > 0) {
				return firstError[0];
			}
			if (typeof firstError === "string") {
				return firstError;
			}
		}
	}

	return (
		actionMessages.default ||
		"An unexpected error occurred. Please try again."
	);
};

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	/**
	 * Fetch and set current user data
	 */
	const fetchUser = useCallback(async () => {
		try {
			const response = await UserService.getCurrentUser();
			if (response.success) {
				setUser(response.data);
				setError(null);
			} else {
				setUser(null);
				// Don't set error or log for 401 - just means not logged in
				// Check response.statusCode (from ApiResponse), response.status, and error.status for 401
				const status =
					response.statusCode ||
					response.status ||
					response.error?.status;
				if (status !== 401 && status !== "401") {
					logAuthError("fetchUser", response, {
						status: status,
					});
					const errorMsg = getAuthErrorMessage(
						response.error,
						"fetchUser"
					);
					setError(errorMsg);
				}
			}
		} catch (err) {
			// Don't log 401 errors as they just mean user is not logged in
			const errStatus =
				err?.statusCode || err?.status || err?.response?.status;
			if (errStatus !== 401) {
				logAuthError("fetchUser", err, { isUnexpected: true });
				console.error("Failed to fetch user:", err);
			}
			setUser(null);
		}
	}, []);

	/**
	 * Initialize auth state on mount
	 */
	useEffect(() => {
		const initAuth = async () => {
			setLoading(true);

			if (TokenManager.getAccessToken()) {
				await fetchUser();
			}

			setLoading(false);
		};

		initAuth();
	}, [fetchUser]);

	/**
	 * Login user
	 * @param {string} email
	 * @param {string} password
	 * @returns {Promise<{success: boolean, error?: string}>}
	 */
	const login = useCallback(
		async (email, password) => {
			setLoading(true);
			setError(null);

			try {
				const response = await AuthService.login(email, password);

				if (response.success) {
					await fetchUser();
					return { success: true };
				}

				logAuthError("login", response, { email });
				const errorMsg = getAuthErrorMessage(response.error, "login");
				setError(errorMsg);
				return { success: false, error: errorMsg };
			} catch (err) {
				logAuthError("login", err, { email, isUnexpected: true });
				const errorMsg = getAuthErrorMessage(err, "login");
				setError(errorMsg);
				return { success: false, error: errorMsg };
			} finally {
				setLoading(false);
			}
		},
		[fetchUser]
	);

	/**
	 * Register new user
	 * @param {Object} userData
	 * @returns {Promise<{success: boolean, error?: string}>}
	 */
	const register = useCallback(
		async (userData) => {
			setLoading(true);
			setError(null);

			try {
				const response = await AuthService.register(userData);

				if (response.success) {
					// Auto-login after registration if tokens are returned
					if (response.data?.tokens) {
						await fetchUser();
					}
					return { success: true, data: response.data };
				}

				logAuthError("register", response, { email: userData?.email });
				const errorMsg = getAuthErrorMessage(
					response.error,
					"register"
				);
				setError(errorMsg);
				return { success: false, error: errorMsg };
			} catch (err) {
				logAuthError("register", err, {
					email: userData?.email,
					isUnexpected: true,
				});
				const errorMsg = getAuthErrorMessage(err, "register");
				setError(errorMsg);
				return { success: false, error: errorMsg };
			} finally {
				setLoading(false);
			}
		},
		[fetchUser]
	);

	/**
	 * Logout user
	 */
	const logout = useCallback(async () => {
		setLoading(true);

		try {
			await AuthService.logout();
		} catch (err) {
			console.error("Logout error:", err);
		} finally {
			setUser(null);
			setError(null);
			setLoading(false);
		}
	}, []);

	/**
	 * Refresh user data
	 */
	const refreshUser = useCallback(async () => {
		if (TokenManager.getAccessToken()) {
			await fetchUser();
		}
	}, [fetchUser]);

	/**
	 * Update user profile locally (after API update)
	 * @param {Object} updates
	 */
	const updateUserLocally = useCallback((updates) => {
		setUser((prev) => (prev ? { ...prev, ...updates } : null));
	}, []);

	/**
	 * Check if user has specific role
	 * @param {string} role - 'admin', 'staff', or 'user'
	 * @returns {boolean}
	 */
	const hasRole = useCallback(
		(role) => {
			if (!user) return false;
			switch (role) {
				case "admin":
					return user.is_admin === true;
				case "staff":
					return user.is_staff === true;
				case "user":
					return !user.is_admin && !user.is_staff;
				default:
					return false;
			}
		},
		[user]
	);

	/**
	 * Check if user is authenticated
	 */
	const isAuthenticated = !!user && TokenManager.getAccessToken();

	/**
	 * Check various role states
	 * Backend uses is_admin and is_staff boolean fields
	 */
	const isAdmin = user?.is_admin === true;
	const isStaff = user?.is_staff === true;
	const isResolver = user?.is_staff === true; // Alias for staff
	const isCitizen = !isAdmin && !isStaff;
	const isActive = user?.is_active !== false;

	const value = {
		user,
		loading,
		error,
		isAuthenticated,
		isAdmin,
		isStaff,
		isResolver,
		isCitizen,
		isActive,
		login,
		logout,
		register,
		refreshUser,
		updateUserLocally,
		hasRole,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

/**
 * Hook to access auth context
 * @returns {AuthContextValue}
 */
export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}

export default AuthContext;
