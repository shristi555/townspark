// Auth Store (Zustand)
export {
	useAuthStore,
	type AuthState,
	type AuthActions,
	type AuthStore,
	type ValidationErrors,
	// Selectors
	selectIsLoggedIn,
	selectIsLoading,
	selectUserInfo,
	selectErrorMessage,
	selectValidationErrors,
	selectIsInitialized,
} from "./auth_store";

// Auth Atoms (Jotai)
export {
	// Base atoms
	isLoggedInAtom,
	isLoadingAtom,
	isInitializedAtom,
	userInfoAtom,
	errorMessageAtom,
	validationErrorsAtom,
	// Derived atoms
	hasValidationErrorsAtom,
	userDisplayNameAtom,
	userInitialsAtom,
	isAuthenticatedAtom,
	isAuthCheckingAtom,
	userRoleAtom,
	isAdminAtom,
	hasProfileImageAtom,
	// Field error atoms
	emailErrorAtom,
	passwordErrorAtom,
	fullNameErrorAtom,
	phoneNumberErrorAtom,
	addressErrorAtom,
	confirmPasswordErrorAtom,
	// Factories
	createFieldErrorAtom,
	createFieldHasErrorAtom,
	// Action atoms
	loginAtom,
	logoutAtom,
	checkLoginStatusAtom,
	clearErrorAtom,
	// Hooks
	useFieldError,
	useFieldHasError,
	useAuthActions,
	useAuthState,
	useUserInfo,
	useIsAuthenticated,
} from "./auth_atoms";

// Auth Provider Components
export { AuthProvider, AuthGuard, GuestGuard } from "./auth_provider";

// Re-export models
export { UserInfo, type IUserInfo } from "../models/user_info";
