/**
 * Admin Service
 * Handles all admin-related API calls
 */

import httpClient from "../api/http_client";
import { API_ROUTES } from "../api/config";

export const AdminService = {
	// ==================== Dashboard ====================

	/**
	 * Get admin dashboard data
	 * @returns {Promise<ApiResponse>}
	 */
	async getDashboard() {
		return httpClient.get(API_ROUTES.admin.dashboard, { auth: true });
	},

	// ==================== Users ====================

	/**
	 * Get all users with filters
	 * @param {Object} [params]
	 * @param {string} [params.role] - Filter by role
	 * @param {boolean} [params.is_active] - Filter by active status
	 * @param {string} [params.search] - Search term
	 * @param {number} [params.page] - Page number
	 * @returns {Promise<ApiResponse>}
	 */
	async getUsers(params = {}) {
		return httpClient.get(API_ROUTES.admin.users.list, {
			auth: true,
			params,
		});
	},

	/**
	 * Get user by ID (admin view)
	 * @param {number|string} userId
	 * @returns {Promise<ApiResponse>}
	 */
	async getUserById(userId) {
		return httpClient.get(API_ROUTES.admin.users.byId(userId), {
			auth: true,
		});
	},

	/**
	 * Update user (admin action)
	 * @param {number|string} userId
	 * @param {Object} data
	 * @returns {Promise<ApiResponse>}
	 */
	async updateUser(userId, data) {
		return httpClient.patch(API_ROUTES.admin.users.byId(userId), data, {
			auth: true,
		});
	},

	/**
	 * Ban a user
	 * @param {number|string} userId
	 * @param {Object} data
	 * @param {string} [data.reason] - Ban reason
	 * @returns {Promise<ApiResponse>}
	 */
	async banUser(userId, data = {}) {
		return httpClient.post(API_ROUTES.admin.users.ban(userId), data, {
			auth: true,
		});
	},

	/**
	 * Unban a user
	 * @param {number|string} userId
	 * @returns {Promise<ApiResponse>}
	 */
	async unbanUser(userId) {
		return httpClient.post(
			API_ROUTES.admin.users.unban(userId),
			{},
			{ auth: true }
		);
	},

	// ==================== Resolvers ====================

	/**
	 * Get pending resolver verifications
	 * @param {Object} [params]
	 * @returns {Promise<ApiResponse>}
	 */
	async getPendingResolvers(params = {}) {
		return httpClient.get(API_ROUTES.admin.resolvers.pending, {
			auth: true,
			params,
		});
	},

	/**
	 * Get all resolvers
	 * @param {Object} [params]
	 * @returns {Promise<ApiResponse>}
	 */
	async getResolvers(params = {}) {
		return httpClient.get(API_ROUTES.admin.resolvers.list, {
			auth: true,
			params,
		});
	},

	/**
	 * Verify a resolver
	 * @param {number|string} resolverId
	 * @param {Object} data
	 * @param {boolean} data.approved - Whether to approve
	 * @param {string} [data.rejection_reason] - Reason if rejected
	 * @returns {Promise<ApiResponse>}
	 */
	async verifyResolver(resolverId, data) {
		return httpClient.post(
			API_ROUTES.admin.resolvers.verify(resolverId),
			data,
			{ auth: true }
		);
	},

	/**
	 * Assign area to resolver
	 * @param {number|string} resolverId
	 * @param {Object} data
	 * @param {string[]} data.areas - Area IDs
	 * @returns {Promise<ApiResponse>}
	 */
	async assignArea(resolverId, data) {
		return httpClient.post(
			API_ROUTES.admin.resolvers.assignArea(resolverId),
			data,
			{ auth: true }
		);
	},

	// ==================== Issues ====================

	/**
	 * Get all issues (admin view)
	 * @param {Object} [params]
	 * @returns {Promise<ApiResponse>}
	 */
	async getIssues(params = {}) {
		return httpClient.get(API_ROUTES.admin.issues.list, {
			auth: true,
			params,
		});
	},

	/**
	 * Assign issue to resolver
	 * @param {number|string} issueId
	 * @param {Object} data
	 * @param {number|string} data.resolver_id - Resolver to assign
	 * @returns {Promise<ApiResponse>}
	 */
	async assignIssue(issueId, data) {
		return httpClient.post(API_ROUTES.admin.issues.assign(issueId), data, {
			auth: true,
		});
	},

	/**
	 * Update issue priority
	 * @param {number|string} issueId
	 * @param {Object} data
	 * @param {string} data.priority - New priority
	 * @returns {Promise<ApiResponse>}
	 */
	async updatePriority(issueId, data) {
		return httpClient.post(
			API_ROUTES.admin.issues.priority(issueId),
			data,
			{ auth: true }
		);
	},

	/**
	 * Delete an issue (admin action)
	 * @param {number|string} issueId
	 * @returns {Promise<ApiResponse>}
	 */
	async deleteIssue(issueId) {
		return httpClient.delete(API_ROUTES.admin.issues.delete(issueId), {
			auth: true,
		});
	},

	// ==================== Categories ====================

	/**
	 * Get all categories
	 * @returns {Promise<ApiResponse>}
	 */
	async getCategories() {
		return httpClient.get(API_ROUTES.admin.categories.list, { auth: true });
	},

	/**
	 * Create a category
	 * @param {Object} data
	 * @returns {Promise<ApiResponse>}
	 */
	async createCategory(data) {
		return httpClient.post(API_ROUTES.admin.categories.create, data, {
			auth: true,
		});
	},

	/**
	 * Update a category
	 * @param {number|string} categoryId
	 * @param {Object} data
	 * @returns {Promise<ApiResponse>}
	 */
	async updateCategory(categoryId, data) {
		return httpClient.patch(
			API_ROUTES.admin.categories.byId(categoryId),
			data,
			{ auth: true }
		);
	},

	/**
	 * Delete a category
	 * @param {number|string} categoryId
	 * @returns {Promise<ApiResponse>}
	 */
	async deleteCategory(categoryId) {
		return httpClient.delete(API_ROUTES.admin.categories.byId(categoryId), {
			auth: true,
		});
	},

	// ==================== Areas ====================

	/**
	 * Get all areas
	 * @returns {Promise<ApiResponse>}
	 */
	async getAreas() {
		return httpClient.get(API_ROUTES.admin.areas.list, { auth: true });
	},

	/**
	 * Create an area
	 * @param {Object} data
	 * @returns {Promise<ApiResponse>}
	 */
	async createArea(data) {
		return httpClient.post(API_ROUTES.admin.areas.create, data, {
			auth: true,
		});
	},

	/**
	 * Update an area
	 * @param {number|string} areaId
	 * @param {Object} data
	 * @returns {Promise<ApiResponse>}
	 */
	async updateArea(areaId, data) {
		return httpClient.patch(API_ROUTES.admin.areas.byId(areaId), data, {
			auth: true,
		});
	},

	/**
	 * Delete an area
	 * @param {number|string} areaId
	 * @returns {Promise<ApiResponse>}
	 */
	async deleteArea(areaId) {
		return httpClient.delete(API_ROUTES.admin.areas.byId(areaId), {
			auth: true,
		});
	},

	// ==================== Reports & Analytics ====================

	/**
	 * Get user reports
	 * @param {Object} [params]
	 * @returns {Promise<ApiResponse>}
	 */
	async getReports(params = {}) {
		return httpClient.get(API_ROUTES.admin.reports, {
			auth: true,
			params,
		});
	},

	/**
	 * Handle a report
	 * @param {number|string} reportId
	 * @param {Object} data
	 * @param {string} data.action - Action to take
	 * @returns {Promise<ApiResponse>}
	 */
	async handleReport(reportId, data) {
		return httpClient.post(API_ROUTES.admin.handleReport(reportId), data, {
			auth: true,
		});
	},
};

export default AdminService;
