/**
 * Authentication Service
 * Handles all authentication-related API calls
 *
 * Backend Endpoints:
 * - POST /auth/signup/ - Register new user
 * - POST /auth/login/ - Login and get tokens
 * - POST /auth/jwt/refresh/ - Refresh access token
 * - POST /auth/jwt/verify/ - Verify token validity
 * - GET /auth/users/me/ - Get current user profile
 * - PATCH /auth/users/me/ - Update current user profile
 */

import httpClient, { TokenManager, ApiResponse } from "../api/http_client";
import { API_ROUTES } from "../api/config";

/**
 * Authentication Service
 */
export const AuthService = {
	/**
	 * Login with email and password
	 * Response: { tokens: { access, refresh }, user: { id, email, full_name, ... } }
	 * @param {string} email
	 * @param {string} password
	 * @returns {Promise<ApiResponse>}
	 */
	async login(email, password) {
		const response = await httpClient.post(API_ROUTES.auth.login, {
			email,
			password,
		});

		if (response.success && response.data) {
			const { tokens, user } = response.data;
			if (tokens) {
				TokenManager.setTokens(tokens.access, tokens.refresh);
			}
			if (user) {
				TokenManager.storeUserData(user);
			}
		}

		return response;
	},

	/**
	 * Register a new user
	 * Request: { email, password, full_name?, phone_number?, address?, profile_image? }
	 * Response: { id, email, full_name, phone_number, address, profile_image }
	 * @param {Object} userData
	 * @returns {Promise<ApiResponse>}
	 */
	async register(userData) {
		const payload = {
			email: userData.email,
			password: userData.password,
		};

		// Add optional fields if provided
		if (userData.full_name) payload.full_name = userData.full_name;
		if (userData.phone_number) payload.phone_number = userData.phone_number;
		if (userData.address) payload.address = userData.address;

		// Handle profile image if provided
		const files = userData.profile_image
			? { profile_image: userData.profile_image }
			: null;

		return httpClient.post(API_ROUTES.auth.signup, payload, { files });
	},

	/**
	 * Refresh access token
	 * Request: { refresh: "token" }
	 * Response: { access: "new_token", refresh: "new_refresh_token" }
	 * @returns {Promise<ApiResponse>}
	 */
	async refreshToken() {
		const refreshToken = TokenManager.getRefreshToken();
		if (!refreshToken) {
			return ApiResponse.failure(
				{ code: "NO_REFRESH_TOKEN", message: "No refresh token" },
				"No refresh token available",
				401
			);
		}

		const response = await httpClient.post(API_ROUTES.auth.refreshToken, {
			refresh: refreshToken,
		});

		if (response.success && response.data) {
			// Update both tokens (backend rotates refresh tokens)
			TokenManager.setTokens(response.data.access, response.data.refresh);
		}

		return response;
	},

	/**
	 * Verify token validity
	 * Request: { token: "access_token" }
	 * Response: {} (empty on success)
	 * @param {string} token - Token to verify (optional, uses stored token if not provided)
	 * @returns {Promise<ApiResponse>}
	 */
	async verifyToken(token = null) {
		const tokenToVerify = token || TokenManager.getAccessToken();
		if (!tokenToVerify) {
			return ApiResponse.failure(
				{ code: "NO_TOKEN", message: "No token to verify" },
				"No token available",
				401
			);
		}

		return httpClient.post(API_ROUTES.auth.verifyToken, {
			token: tokenToVerify,
		});
	},

	/**
	 * Logout - clear tokens and user data
	 */
	logout() {
		TokenManager.clearTokens();
	},

	/**
	 * Check if user is authenticated
	 * @returns {boolean}
	 */
	isAuthenticated() {
		return TokenManager.hasValidToken();
	},

	/**
	 * Get stored tokens
	 * @returns {Object}
	 */
	getTokens() {
		return {
			access: TokenManager.getAccessToken(),
			refresh: TokenManager.getRefreshToken(),
		};
	},
};

export default AuthService;
