import { create } from "zustand";
import {
	subscribeWithSelector,
	persist,
	createJSONStorage,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { AuthService } from "../../services/auth/auth_service";
import { RegisterModel } from "../../services/auth/register_model";
import { ClientTokenStorage } from "../../services/auth/client_token_storage";
import { BackendResponse } from "../../services/backend_response";
import { UserInfo } from "../../models/user_info";

// ============ Types ============

export type ValidationErrors = Record<string, string[]>;

export interface AuthState {
	// Auth status
	isLoggedIn: boolean;
	isLoading: boolean;
	isInitialized: boolean;

	// User data
	userInfo: UserInfo | null;

	// Tokens
	accessToken: string | null;
	refreshToken: string | null;

	// Error handling
	errorMessage: string | null;
	validationErrors: ValidationErrors | null;
}

export interface AuthActions {
	// Auth operations
	login: (
		email: string,
		password: string,
		options?: { redirect?: string; rememberMe?: boolean }
	) => Promise<void>;
	signup: (
		data: RegisterModel,
		options?: { redirect?: string; autoLogin?: boolean }
	) => Promise<void>;
	logout: () => Promise<void>;

	// Profile operations
	getUserInfo: () => Promise<void>;
	updateProfile: (
		data: Record<string, any>,
		profileImage?: File | null
	) => Promise<void>;
	changePassword: (
		currentPassword: string,
		newPassword: string
	) => Promise<void>;

	// Token operations
	checkLoginStatus: () => Promise<void>;

	// Utility
	clearError: () => void;
	setLoading: (loading: boolean) => void;

	// Validation helpers
	fieldHasError: (fieldName: string) => boolean;
	getValidationErrorForField: (fieldName: string) => string | null;
}

export type AuthStore = AuthState & AuthActions;

// ============ Initial State ============

const initialState: AuthState = {
	isLoggedIn: false,
	isLoading: false,
	isInitialized: false,
	userInfo: null,
	accessToken: null,
	refreshToken: null,
	errorMessage: null,
	validationErrors: null,
};

// ============ Auth Service Instance ============

const authService = AuthService.getInstance();

// ============ Store Creation ============

export const useAuthStore = create<AuthStore>()(
	subscribeWithSelector(
		immer((set, get) => ({
			...initialState,

			// ============ Auth Operations ============

			login: async (email, password, options = {}) => {
				const { redirect, rememberMe = false } = options;

				set((state) => {
					state.isLoading = true;
					state.errorMessage = null;
					state.validationErrors = null;
				});

				try {
					const result = await authService.login(
						email,
						password,
						rememberMe
					);

					if (!result.success) {
						handleBackendError(set, result);
						return;
					}

					if (
						result.response &&
						typeof result.response === "object"
					) {
						const tokens = result.response.tokens;
						const user = result.response.user;

						if (tokens) {
							await saveTokens(
								set,
								tokens.access,
								tokens.refresh
							);
						}

						if (user) {
							const userInfo = UserInfo.fromJson(user);
							set((state) => {
								state.userInfo = userInfo;
							});
							ClientTokenStorage.setUserInfo(userInfo.toJson());
						}

						set((state) => {
							state.isLoggedIn = true;
						});
					}

					if (redirect) {
						handleRedirect(redirect);
					}
				} catch (e) {
					handleException(set, e);
				} finally {
					set((state) => {
						state.isLoading = false;
					});
				}
			},

			signup: async (data, options = {}) => {
				const { redirect, autoLogin = true } = options;

				set((state) => {
					state.isLoading = true;
					state.errorMessage = null;
					state.validationErrors = null;
				});

				try {
					const result = await authService.signup(data);

					if (!result.success) {
						handleBackendError(set, result);
						return;
					}

					// Auto login after signup
					if (autoLogin) {
						await get().login(data.email, data.password, {
							redirect,
							rememberMe: true,
						});
						return;
					}

					if (redirect) {
						handleRedirect(redirect);
					}
				} catch (e) {
					handleException(set, e);
				} finally {
					set((state) => {
						state.isLoading = false;
					});
				}
			},

			logout: async () => {
				set((state) => {
					state.isLoading = true;
					state.errorMessage = null;
					state.validationErrors = null;
				});

				try {
					const result = await authService.logout();

					if (!result.success) {
						// Log error but continue with local logout
						console.warn("Backend logout failed:", result.error);
					}
				} catch (e) {
					console.warn("Logout exception:", e);
				} finally {
					// Always clear local state
					await clearTokens(set);
					set((state) => {
						state.isLoggedIn = false;
						state.userInfo = null;
						state.isLoading = false;
					});
				}
			},

			// ============ Profile Operations ============

			getUserInfo: async () => {
				set((state) => {
					state.isLoading = true;
					state.errorMessage = null;
				});

				try {
					const result = await authService.getProfile();

					if (!result.success) {
						handleBackendError(set, result);
						return;
					}

					if (result.response) {
						const userInfo = UserInfo.fromJson(result.response);
						set((state) => {
							state.userInfo = userInfo;
						});
						ClientTokenStorage.setUserInfo(userInfo.toJson());
					}
				} catch (e) {
					handleException(set, e);
				} finally {
					set((state) => {
						state.isLoading = false;
					});
				}
			},

			updateProfile: async (data, profileImage) => {
				set((state) => {
					state.isLoading = true;
					state.errorMessage = null;
					state.validationErrors = null;
				});

				try {
					const result = await authService.updateProfile(
						data,
						profileImage
					);

					if (!result.success) {
						handleBackendError(set, result);
						return;
					}

					if (result.response) {
						const userInfo = UserInfo.fromJson(result.response);
						set((state) => {
							state.userInfo = userInfo;
						});
						ClientTokenStorage.setUserInfo(userInfo.toJson());
					}
				} catch (e) {
					handleException(set, e);
				} finally {
					set((state) => {
						state.isLoading = false;
					});
				}
			},

			changePassword: async (currentPassword, newPassword) => {
				set((state) => {
					state.isLoading = true;
					state.errorMessage = null;
					state.validationErrors = null;
				});

				try {
					const result = await authService.changePassword(
						currentPassword,
						newPassword
					);

					if (!result.success) {
						handleBackendError(set, result);
						return;
					}

					// Success - could show toast here
				} catch (e) {
					handleException(set, e);
				} finally {
					set((state) => {
						state.isLoading = false;
					});
				}
			},

			// ============ Token Operations ============

			checkLoginStatus: async () => {
				set((state) => {
					state.isLoading = true;
				});

				try {
					// Load tokens from storage
					const access = ClientTokenStorage.getAccessToken();
					const refresh = ClientTokenStorage.getRefreshToken();

					if (!access || !refresh) {
						set((state) => {
							state.isLoggedIn = false;
							state.isInitialized = true;
						});
						return;
					}

					// Set tokens temporarily
					set((state) => {
						state.accessToken = access;
						state.refreshToken = refresh;
					});

					// Verify token
					const verifyResult = await authService.verifyToken(access);

					if (!verifyResult.success) {
						console.log("Token invalid, attempting refresh...");

						const refreshResult =
							await authService.refreshToken(refresh);

						if (
							refreshResult.success &&
							refreshResult.response &&
							typeof refreshResult.response === "object"
						) {
							const newAccess = refreshResult.response.access;
							const newRefresh =
								refreshResult.response.refresh ?? refresh;
							await saveTokens(set, newAccess, newRefresh);
						} else {
							console.log("Refresh failed, logging out.");
							await clearTokens(set);
							set((state) => {
								state.isLoggedIn = false;
								state.isInitialized = true;
							});
							return;
						}
					}

					// Try to load cached user first
					const cachedUser = ClientTokenStorage.getUserInfo();
					if (cachedUser) {
						set((state) => {
							state.userInfo = UserInfo.fromJson(cachedUser);
						});
					}

					// Fetch fresh profile
					const profileResult = await authService.getProfile();

					if (profileResult.success && profileResult.response) {
						const userInfo = UserInfo.fromJson(
							profileResult.response
						);
						set((state) => {
							state.userInfo = userInfo;
							state.isLoggedIn = true;
							state.isInitialized = true;
						});
						ClientTokenStorage.setUserInfo(userInfo.toJson());
					} else if (get().userInfo) {
						// Fallback to cached user if API fails
						set((state) => {
							state.isLoggedIn = true;
							state.isInitialized = true;
						});
					} else {
						set((state) => {
							state.isLoggedIn = false;
							state.isInitialized = true;
						});
					}
				} catch (e) {
					handleException(set, e);
					set((state) => {
						state.isLoggedIn = false;
						state.isInitialized = true;
					});
				} finally {
					set((state) => {
						state.isLoading = false;
					});
				}
			},

			// ============ Utility ============

			clearError: () => {
				set((state) => {
					state.errorMessage = null;
					state.validationErrors = null;
				});
			},

			setLoading: (loading) => {
				set((state) => {
					state.isLoading = loading;
				});
			},

			fieldHasError: (fieldName) => {
				const errors = get().validationErrors;
				if (!errors) return false;
				return fieldName in errors;
			},

			getValidationErrorForField: (fieldName) => {
				const errors = get().validationErrors;
				if (!errors || !(fieldName in errors)) return null;
				return errors[fieldName]?.[0] ?? null;
			},
		}))
	)
);

// ============ Helper Functions ============

async function saveTokens(
	set: (fn: (state: AuthState) => void) => void,
	access: string,
	refresh: string
) {
	ClientTokenStorage.saveTokens(access, refresh);
	set((state) => {
		state.accessToken = access;
		state.refreshToken = refresh;
	});
}

async function clearTokens(set: (fn: (state: AuthState) => void) => void) {
	ClientTokenStorage.clearAll();
	set((state) => {
		state.accessToken = null;
		state.refreshToken = null;
		state.userInfo = null;
	});
}

function handleRedirect(path: string) {
	// Using window.location for now, can be replaced with router
	if (typeof window !== "undefined") {
		window.location.href = path;
	}
}

function handleBackendError(
	set: (fn: (state: AuthState) => void) => void,
	response: BackendResponse
) {
	if (!response.error) return;

	const error = response.error;
	const message = (error.message as string) ?? "An error occurred";
	const details = error.details;

	console.error("Backend error details:", response.toJson());

	if (details && typeof details === "object" && !Array.isArray(details)) {
		// Field-level validation errors
		const fieldErrors: ValidationErrors = {};
		let hasFieldErrors = false;

		Object.entries(details).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				fieldErrors[key] = value.map((e) => String(e));
				hasFieldErrors = true;
			} else if (typeof value === "string") {
				fieldErrors[key] = [value];
				hasFieldErrors = true;
			}
		});

		if (hasFieldErrors) {
			const errorList = Object.entries(fieldErrors)
				.map(([k, v]) => `${k}: ${v[0]}`)
				.join("\n");

			set((state) => {
				state.validationErrors = fieldErrors;
				state.errorMessage = errorList;
			});
			return;
		}
	}

	set((state) => {
		state.errorMessage = details
			? `${message}\n${JSON.stringify(details)}`
			: message;
	});
}

function handleException(
	set: (fn: (state: AuthState) => void) => void,
	e: unknown
) {
	const message =
		e instanceof Error ? e.message : "An unexpected error occurred";

	set((state) => {
		state.errorMessage = message;
	});

	console.error("Auth exception:", e);
}

// ============ Selectors (for performance optimization) ============

export const selectIsLoggedIn = (state: AuthStore) => state.isLoggedIn;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectUserInfo = (state: AuthStore) => state.userInfo;
export const selectErrorMessage = (state: AuthStore) => state.errorMessage;
export const selectValidationErrors = (state: AuthStore) =>
	state.validationErrors;
export const selectIsInitialized = (state: AuthStore) => state.isInitialized;

// ============ Subscriptions (like GetX's ever()) ============

// Subscribe to login state changes
if (typeof window !== "undefined") {
	useAuthStore.subscribe(
		(state) => state.isLoggedIn,
		(isLoggedIn, previousIsLoggedIn) => {
			if (previousIsLoggedIn && !isLoggedIn) {
				// User logged out - cleanup actions
				console.log("User logged out");
				// Call other controller cleanups here if needed
			} else if (!previousIsLoggedIn && isLoggedIn) {
				// User logged in - initialization actions
				console.log("User logged in");
				// Call other controller initializations here if needed
			}
		}
	);

	// Subscribe to error messages
	useAuthStore.subscribe(
		(state) => ({
			errorMessage: state.errorMessage,
			validationErrors: state.validationErrors,
		}),
		({ errorMessage, validationErrors }) => {
			if (errorMessage) {
				console.error("Auth error:", errorMessage);
			}
			if (validationErrors) {
				console.error(
					"Validation errors:",
					JSON.stringify(validationErrors)
				);
			}
			// Could trigger toast notification here
		}
	);
}

export default useAuthStore;
