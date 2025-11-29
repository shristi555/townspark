/**
 * Issue Service
 * Handles all issue-related API calls
 */

import httpClient from "../api/http_client";
import { API_ROUTES } from "../api/config";

export const IssueService = {
	/**
	 * Get all issues with filtering and pagination
	 * @param {Object} [params] - Query parameters
	 * @param {string} [params.status] - Filter by status
	 * @param {string} [params.category] - Filter by category
	 * @param {string} [params.urgency] - Filter by urgency
	 * @param {string} [params.area] - Filter by area
	 * @param {string} [params.sort] - Sort field (newest, oldest, most_upvoted, most_commented)
	 * @param {number} [params.page] - Page number
	 * @param {string} [params.search] - Search term
	 * @returns {Promise<ApiResponse>}
	 */
	async getIssues(params = {}) {
		// Map frontend params to backend params
		const queryParams = {};

		if (params.status) queryParams.status = params.status;
		if (params.category) queryParams.category = params.category;
		if (params.urgency) queryParams.urgency = params.urgency;
		if (params.area) queryParams.area = params.area;
		if (params.sort) queryParams.sort = params.sort;
		if (params.page) queryParams.page = params.page;
		if (params.search) queryParams.search = params.search;
		if (params.is_public !== undefined)
			queryParams.is_public = params.is_public;

		return httpClient.get(API_ROUTES.issues.list, { params: queryParams });
	},

	/**
	 * Get issue by ID
	 * @param {number|string} issueId
	 * @returns {Promise<ApiResponse>}
	 */
	async getIssueById(issueId) {
		return httpClient.get(API_ROUTES.issues.byId(issueId));
	},

	/**
	 * Create a new issue
	 * @param {Object} issueData
	 * @param {File[]} [images] - Array of image files
	 * @returns {Promise<ApiResponse>}
	 */
	async createIssue(issueData, images = []) {
		const payload = {
			title: issueData.title,
			description: issueData.description,
			category: issueData.category,
			urgency_level: issueData.urgency || issueData.urgency_level,
			location: issueData.location,
			latitude: issueData.latitude,
			longitude: issueData.longitude,
			area: issueData.area,
			is_anonymous: issueData.is_anonymous || false,
			is_public: issueData.is_public !== false,
		};

		// Handle images
		const files = {};
		if (images && images.length > 0) {
			images.forEach((image, index) => {
				files[`images[${index}]`] = image;
			});
		}

		return httpClient.post(API_ROUTES.issues.create, payload, {
			auth: true,
			files: Object.keys(files).length > 0 ? files : null,
		});
	},

	/**
	 * Update an issue
	 * @param {number|string} issueId
	 * @param {Object} updateData
	 * @returns {Promise<ApiResponse>}
	 */
	async updateIssue(issueId, updateData) {
		return httpClient.patch(API_ROUTES.issues.byId(issueId), updateData, {
			auth: true,
		});
	},

	/**
	 * Delete an issue
	 * @param {number|string} issueId
	 * @returns {Promise<ApiResponse>}
	 */
	async deleteIssue(issueId) {
		return httpClient.delete(API_ROUTES.issues.byId(issueId), {
			auth: true,
		});
	},

	/**
	 * Upvote an issue
	 * @param {number|string} issueId
	 * @returns {Promise<ApiResponse>}
	 */
	async upvote(issueId) {
		return httpClient.post(
			API_ROUTES.issues.upvote(issueId),
			{},
			{ auth: true }
		);
	},

	/**
	 * Remove upvote from an issue
	 * @param {number|string} issueId
	 * @returns {Promise<ApiResponse>}
	 */
	async removeUpvote(issueId) {
		return httpClient.delete(API_ROUTES.issues.upvote(issueId), {
			auth: true,
		});
	},

	/**
	 * Bookmark an issue
	 * @param {number|string} issueId
	 * @returns {Promise<ApiResponse>}
	 */
	async bookmark(issueId) {
		return httpClient.post(
			API_ROUTES.issues.bookmark(issueId),
			{},
			{ auth: true }
		);
	},

	/**
	 * Remove bookmark from an issue
	 * @param {number|string} issueId
	 * @returns {Promise<ApiResponse>}
	 */
	async removeBookmark(issueId) {
		return httpClient.delete(API_ROUTES.issues.bookmark(issueId), {
			auth: true,
		});
	},

	/**
	 * Get trending issues
	 * @param {Object} [params]
	 * @returns {Promise<ApiResponse>}
	 */
	async getTrending(params = {}) {
		return httpClient.get(API_ROUTES.issues.trending, { params });
	},

	/**
	 * Get nearby issues (requires lat/long)
	 * @param {number} latitude
	 * @param {number} longitude
	 * @param {number} [radius=5] - Radius in km
	 * @returns {Promise<ApiResponse>}
	 */
	async getNearby(latitude, longitude, radius = 5) {
		return httpClient.get(API_ROUTES.issues.nearby, {
			params: { latitude, longitude, radius },
		});
	},

	/**
	 * Get issue statistics
	 * @returns {Promise<ApiResponse>}
	 */
	async getStats() {
		return httpClient.get(API_ROUTES.issues.stats);
	},
};

export default IssueService;
