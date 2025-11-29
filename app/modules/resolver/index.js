/**
 * Resolver Service
 * Handles all resolver-related API calls
 */

import httpClient from "../api/http_client";
import { API_ROUTES } from "../api/config";

export const ResolverService = {
	/**
	 * Get resolver dashboard data
	 * @returns {Promise<ApiResponse>}
	 */
	async getDashboard() {
		return httpClient.get(API_ROUTES.resolver.dashboard, { auth: true });
	},

	/**
	 * Get issues assigned to resolver
	 * @param {Object} [params]
	 * @param {string} [params.status] - Filter by status
	 * @param {number} [params.page] - Page number
	 * @returns {Promise<ApiResponse>}
	 */
	async getAssignedIssues(params = {}) {
		return httpClient.get(API_ROUTES.resolver.assignedIssues, {
			auth: true,
			params,
		});
	},

	/**
	 * Claim an issue for resolution
	 * @param {number|string} issueId
	 * @returns {Promise<ApiResponse>}
	 */
	async claimIssue(issueId) {
		return httpClient.post(
			API_ROUTES.resolver.claimIssue(issueId),
			{},
			{ auth: true }
		);
	},

	/**
	 * Update issue status (resolver action)
	 * @param {number|string} issueId
	 * @param {Object} data
	 * @param {string} data.status - New status
	 * @param {string} [data.resolution_notes] - Notes about resolution
	 * @param {File[]} [images] - Resolution images
	 * @returns {Promise<ApiResponse>}
	 */
	async updateIssueStatus(issueId, data, images = []) {
		const files = {};
		if (images && images.length > 0) {
			images.forEach((image, index) => {
				files[`resolution_images[${index}]`] = image;
			});
		}

		return httpClient.post(
			API_ROUTES.resolver.updateStatus(issueId),
			{
				status: data.status,
				resolution_notes: data.resolution_notes || data.notes,
			},
			{
				auth: true,
				files: Object.keys(files).length > 0 ? files : null,
			}
		);
	},

	/**
	 * Add resolution timeline update
	 * @param {number|string} issueId
	 * @param {Object} data
	 * @returns {Promise<ApiResponse>}
	 */
	async addTimelineUpdate(issueId, data) {
		return httpClient.post(API_ROUTES.resolver.addTimeline(issueId), data, {
			auth: true,
		});
	},

	/**
	 * Get resolver statistics
	 * @returns {Promise<ApiResponse>}
	 */
	async getStats() {
		return httpClient.get(API_ROUTES.resolver.stats, { auth: true });
	},

	/**
	 * Get available issues in resolver's department/area
	 * @param {Object} [params]
	 * @returns {Promise<ApiResponse>}
	 */
	async getAvailableIssues(params = {}) {
		return httpClient.get(API_ROUTES.resolver.availableIssues, {
			auth: true,
			params,
		});
	},
};

export default ResolverService;
