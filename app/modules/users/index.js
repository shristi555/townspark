/**
 * User Service
 * Handles all user-related API calls
 */

import httpClient from "../api/http_client";
import { API_ROUTES } from "../api/config";

export const UserService = {
	/**
	 * Get current user profile
	 * @returns {Promise<ApiResponse>}
	 */
	async getCurrentUser() {
		return httpClient.get(API_ROUTES.users.me, { auth: true });
	},

	/**
	 * Update current user profile
	 * @param {Object} userData
	 * @param {File} [profileImage]
	 * @returns {Promise<ApiResponse>}
	 */
	async updateProfile(userData, profileImage = null) {
		const files = profileImage ? { profile_image: profileImage } : null;

		return httpClient.patch(
			API_ROUTES.users.me,
			{
				full_name: userData.name,
				phone_number: userData.phone,
				address: userData.address,
				ward: userData.ward,
				bio: userData.bio,
				location: userData.location,
			},
			{ auth: true, files }
		);
	},

	/**
	 * Get user by ID
	 * @param {number|string} userId
	 * @returns {Promise<ApiResponse>}
	 */
	async getUserById(userId) {
		return httpClient.get(API_ROUTES.users.byId(userId));
	},

	/**
	 * Get current user's issues
	 * @param {Object} [params]
	 * @returns {Promise<ApiResponse>}
	 */
	async getMyIssues(params = {}) {
		return httpClient.get(API_ROUTES.users.myIssues, {
			auth: true,
			params,
		});
	},

	/**
	 * Get current user's bookmarked issues
	 * @param {Object} [params]
	 * @returns {Promise<ApiResponse>}
	 */
	async getMyBookmarks(params = {}) {
		return httpClient.get(API_ROUTES.users.myBookmarks, {
			auth: true,
			params,
		});
	},

	/**
	 * Get current user's upvoted issues
	 * @param {Object} [params]
	 * @returns {Promise<ApiResponse>}
	 */
	async getMyUpvoted(params = {}) {
		return httpClient.get(API_ROUTES.users.myUpvoted, {
			auth: true,
			params,
		});
	},

	/**
	 * Get user settings
	 * @returns {Promise<ApiResponse>}
	 */
	async getSettings() {
		return httpClient.get(API_ROUTES.users.mySettings, { auth: true });
	},

	/**
	 * Update user settings
	 * @param {Object} settings
	 * @returns {Promise<ApiResponse>}
	 */
	async updateSettings(settings) {
		return httpClient.patch(API_ROUTES.users.mySettings, settings, {
			auth: true,
		});
	},
};

export default UserService;
