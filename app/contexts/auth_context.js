"use client";

/**
 * Auth Context
 * Manages authentication state across the application
 */

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import { AuthService } from "../modules/auth";
import { UserService } from "../modules/users";
import { TokenManager } from "../modules/api/http_client";

const AuthContext = createContext(null);

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
				// Don't set error for 401 - just means not logged in
				if (response.status !== 401) {
					setError(response.error);
				}
			}
		} catch (err) {
			console.error("Failed to fetch user:", err);
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

				setError(response.error);
				return { success: false, error: response.error };
			} catch (err) {
				const errorMsg = "An unexpected error occurred";
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

				setError(response.error);
				return { success: false, error: response.error };
			} catch (err) {
				const errorMsg = "Registration failed";
				setError(errorMsg);
				return { success: false, error: errorMsg };
			} finally {
				setLoading(false);
			}
		},
		[fetchUser]
	);

	/**
	 * Register as resolver
	 * @param {Object} resolverData
	 * @returns {Promise<{success: boolean, error?: string}>}
	 */
	const registerResolver = useCallback(async (resolverData) => {
		setLoading(true);
		setError(null);

		try {
			const response = await AuthService.registerResolver(resolverData);

			if (response.success) {
				return { success: true, data: response.data };
			}

			setError(response.error);
			return { success: false, error: response.error };
		} catch (err) {
			const errorMsg = "Resolver registration failed";
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	}, []);

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
	 * @param {string} role
	 * @returns {boolean}
	 */
	const hasRole = useCallback(
		(role) => {
			return user?.role === role;
		},
		[user]
	);

	/**
	 * Check if user is authenticated
	 */
	const isAuthenticated = !!user && TokenManager.getAccessToken();

	/**
	 * Check various role states
	 */
	const isAdmin = user?.role === "admin";
	const isResolver = user?.role === "resolver";
	const isCitizen = user?.role === "citizen";
	const isVerified = user?.is_verified || false;

	const value = {
		user,
		loading,
		error,
		isAuthenticated,
		isAdmin,
		isResolver,
		isCitizen,
		isVerified,
		login,
		logout,
		register,
		registerResolver,
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
