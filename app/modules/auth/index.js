/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import httpClient, { TokenManager, ApiResponse } from "../api/http_client";
import { API_ROUTES } from "../api/config";

/**
 * Authentication Service
 */
export const AuthService = {
	/**
	 * Login with email and password
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
		}

		return response;
	},

	/**
	 * Register a new citizen
	 * @param {Object} userData
	 * @returns {Promise<ApiResponse>}
	 */
	async register(userData) {
		const response = await httpClient.post(API_ROUTES.auth.register, {
			email: userData.email,
			password: userData.password,
			full_name: userData.full_name,
			phone_number: userData.phone_number,
			address: userData.address,
		});

		return response;
	},

	/**
	 * Register as a resolver
	 * @param {Object} resolverData
	 * @returns {Promise<ApiResponse>}
	 */
	async registerResolver(resolverData) {
		const fileData = {};
		if (resolverData.idDocument) {
			fileData.id_document = resolverData.idDocument;
		}

		const response = await httpClient.post(
			API_ROUTES.auth.registerResolver,
			{
				full_name: resolverData.full_name,
				email: resolverData.email,
				phone_number: resolverData.phone_number,
				password: resolverData.password,
				department: resolverData.department,
				employee_id: resolverData.employee_id,
				designation: resolverData.designation,
			},
			{ files: fileData }
		);

		return response;
	},

	/**
	 * Refresh access token
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

		if (response.success && response.data?.access) {
			TokenManager.setTokens(response.data.access);
		}

		return response;
	},

	/**
	 * Logout - clear tokens
	 */
	logout() {
		TokenManager.clearTokens();
	},

	/**
	 * Request password reset
	 * @param {string} email
	 * @returns {Promise<ApiResponse>}
	 */
	async requestPasswordReset(email) {
		return httpClient.post(API_ROUTES.auth.resetPassword, { email });
	},

	/**
	 * Confirm password reset
	 * @param {string} uid
	 * @param {string} token
	 * @param {string} newPassword
	 * @returns {Promise<ApiResponse>}
	 */
	async confirmPasswordReset(uid, token, newPassword) {
		return httpClient.post(API_ROUTES.auth.resetPasswordConfirm, {
			uid,
			token,
			new_password: newPassword,
			re_new_password: newPassword,
		});
	},

	/**
	 * Change password (authenticated)
	 * @param {string} currentPassword
	 * @param {string} newPassword
	 * @returns {Promise<ApiResponse>}
	 */
	async changePassword(currentPassword, newPassword) {
		return httpClient.post(
			API_ROUTES.auth.changePassword,
			{
				current_password: currentPassword,
				new_password: newPassword,
				re_new_password: newPassword,
			},
			{ auth: true }
		);
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
