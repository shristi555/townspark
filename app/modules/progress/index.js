/**
 * Progress Service
 * Handles all progress-related API calls (Staff/Admin only)
 *
 * Backend Endpoints:
 * - POST /progress/new/ - Create progress update (Staff only)
 * - GET /progress/list/ - List progress updates
 * - GET /progress/detail/{id}/ - Get progress details
 * - PUT/PATCH /progress/update/{id}/ - Update progress (Staff only)
 * - DELETE /progress/delete/{id}/ - Delete progress (Staff only)
 * - GET /progress/issue/{issue_id}/ - Get progress for specific issue
 *
 * Status Values: open, in_progress, resolved, closed
 */

import httpClient from "../api/http_client";
import { API_ROUTES } from "../api/config";

export const ProgressService = {
	/**
	 * Create a progress update (Staff/Admin only)
	 * When created, the related issue's status is automatically updated
	 * @param {Object} progressData
	 * @param {number|string} progressData.issue_id - ID of the issue
	 * @param {string} progressData.status - New status (open, in_progress, resolved, closed)
	 * @param {string} [progressData.notes] - Notes about this progress update
	 * @param {File[]} [images] - Images documenting the progress
	 * @returns {Promise<ApiResponse>}
	 */
	async createProgress(progressData, images = []) {
		const payload = {
			issue_id: progressData.issue_id,
			status: progressData.status,
		};

		if (progressData.notes) {
			payload.notes = progressData.notes;
		}

		// Handle images
		const files = {};
		if (images && images.length > 0) {
			images.forEach((image, index) => {
				files[`images`] = image;
			});
		}

		return httpClient.post(API_ROUTES.progress.create, payload, {
			auth: true,
			files: Object.keys(files).length > 0 ? files : null,
		});
	},

	/**
	 * Get all progress updates
	 * Regular users see progress for their own issues only
	 * Staff/Admin users see all progress updates
	 * @param {Object} [params]
	 * @param {number|string} [params.issue_id] - Filter by issue ID
	 * @param {string} [params.status] - Filter by status
	 * @returns {Promise<ApiResponse>}
	 */
	async getProgressList(params = {}) {
		const queryParams = {};
		if (params.issue_id) queryParams.issue_id = params.issue_id;
		if (params.status) queryParams.status = params.status;

		return httpClient.get(API_ROUTES.progress.list, {
			auth: true,
			params: queryParams,
		});
	},

	/**
	 * Get progress update by ID
	 * @param {number|string} progressId
	 * @returns {Promise<ApiResponse>}
	 */
	async getProgressById(progressId) {
		return httpClient.get(API_ROUTES.progress.detail(progressId), {
			auth: true,
		});
	},

	/**
	 * Get all progress updates for a specific issue
	 * @param {number|string} issueId
	 * @returns {Promise<ApiResponse>}
	 */
	async getProgressByIssue(issueId) {
		return httpClient.get(API_ROUTES.progress.byIssue(issueId), {
			auth: true,
		});
	},

	/**
	 * Update a progress update (Staff/Admin only)
	 * @param {number|string} progressId
	 * @param {Object} updateData
	 * @param {string} [updateData.status] - Updated status
	 * @param {string} [updateData.notes] - Updated notes
	 * @param {File[]} [images] - Additional images to add
	 * @returns {Promise<ApiResponse>}
	 */
	async updateProgress(progressId, updateData, images = []) {
		const payload = {};
		if (updateData.status) payload.status = updateData.status;
		if (updateData.notes) payload.notes = updateData.notes;

		// Handle images
		const files = {};
		if (images && images.length > 0) {
			images.forEach((image, index) => {
				files[`images`] = image;
			});
		}

		return httpClient.patch(
			API_ROUTES.progress.update(progressId),
			payload,
			{
				auth: true,
				files: Object.keys(files).length > 0 ? files : null,
			}
		);
	},

	/**
	 * Delete a progress update (Staff/Admin only)
	 * @param {number|string} progressId
	 * @returns {Promise<ApiResponse>}
	 */
	async deleteProgress(progressId) {
		return httpClient.delete(API_ROUTES.progress.delete(progressId), {
			auth: true,
		});
	},
};

export default ProgressService;
