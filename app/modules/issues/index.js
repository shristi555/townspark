/**
 * Issue Service
 * Handles all issue-related API calls
 *
 * Backend Endpoints:
 * - POST /issues/new/ - Create new issue
 * - GET /issues/list/ - List issues (user sees own, staff sees all)
 * - GET /issues/detail/{id}/ - Get issue details
 * - PUT/PATCH /issues/update/{id}/ - Update issue
 * - DELETE /issues/delete/{id}/ - Delete issue
 *
 * Status Values: open, in_progress, resolved, closed
 */

import httpClient from "../api/http_client";
import { API_ROUTES } from "../api/config";

export const IssueService = {
	/**
	 * Get all issues with optional status filter
	 * Regular users see only their own issues
	 * Staff/Admin users see all issues
	 * @param {Object} [params] - Query parameters
	 * @param {string} [params.status] - Filter by status (open, in_progress, resolved, closed)
	 * @returns {Promise<ApiResponse>}
	 */
	async getIssues(params = {}) {
		const queryParams = {};
		if (params.status) queryParams.status = params.status;

		return httpClient.get(API_ROUTES.issues.list, {
			auth: true,
			params: queryParams,
		});
	},

	/**
	 * Get issue by ID
	 * @param {number|string} issueId
	 * @returns {Promise<ApiResponse>}
	 */
	async getIssueById(issueId) {
		return httpClient.get(API_ROUTES.issues.detail(issueId), {
			auth: true,
		});
	},

	/**
	 * Create a new issue
	 * @param {Object} issueData
	 * @param {string} issueData.title - Issue title (required)
	 * @param {string} issueData.description - Issue description (required)
	 * @returns {Promise<ApiResponse>}
	 */
	async createIssue(issueData) {
		return httpClient.post(
			API_ROUTES.issues.create,
			{
				title: issueData.title,
				description: issueData.description,
			},
			{ auth: true }
		);
	},

	/**
	 * Update an issue
	 * Regular users can update title/description of their own issues
	 * Staff/Admin can update any issue including status
	 * @param {number|string} issueId
	 * @param {Object} updateData
	 * @param {string} [updateData.title]
	 * @param {string} [updateData.description]
	 * @param {string} [updateData.status] - Staff/Admin only for "resolved"
	 * @returns {Promise<ApiResponse>}
	 */
	async updateIssue(issueId, updateData) {
		const payload = {};
		if (updateData.title) payload.title = updateData.title;
		if (updateData.description)
			payload.description = updateData.description;
		if (updateData.status) payload.status = updateData.status;

		return httpClient.patch(API_ROUTES.issues.update(issueId), payload, {
			auth: true,
		});
	},

	/**
	 * Delete an issue
	 * Regular users can only delete their own issues
	 * Staff/Admin can delete any issue
	 * @param {number|string} issueId
	 * @returns {Promise<ApiResponse>}
	 */
	async deleteIssue(issueId) {
		return httpClient.delete(API_ROUTES.issues.delete(issueId), {
			auth: true,
		});
	},
};

export default IssueService;
