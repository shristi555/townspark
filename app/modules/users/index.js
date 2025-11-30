/**
 * User Service
 * Handles all user-related API calls
 *
 * Backend Endpoints:
 * - GET /auth/users/me/ - Get current user profile
 * - PUT/PATCH /auth/users/me/ - Update current user profile
 *
 * User Fields: id, email, full_name, phone_number, address, profile_image, is_active, is_staff, is_admin
 * Public Fields (for other users): full_name, address, profile_image
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
	 * @param {string} [userData.full_name]
	 * @param {string} [userData.phone_number] - 7-13 digits
	 * @param {string} [userData.address]
	 * @param {File} [profileImage]
	 * @returns {Promise<ApiResponse>}
	 */
	async updateProfile(userData, profileImage = null) {
		const payload = {};

		// Map common frontend field names to backend field names
		if (userData.full_name) payload.full_name = userData.full_name;
		if (userData.name) payload.full_name = userData.name;
		if (userData.phone_number) payload.phone_number = userData.phone_number;
		if (userData.phone) payload.phone_number = userData.phone;
		if (userData.address) payload.address = userData.address;

		const files = profileImage ? { profile_image: profileImage } : null;

		return httpClient.patch(API_ROUTES.users.me, payload, {
			auth: true,
			files,
		});
	},
};

export default UserService;
