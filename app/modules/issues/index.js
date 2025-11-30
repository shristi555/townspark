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
 * - GET /issues/categories/ - Get all categories
 * - GET /issues/category/{category}/ - Get issues by category
 *
 * Status Values: open, in_progress, resolved, closed
 */

import httpClient, { ApiResponse } from "../api/http_client";
import { API_ROUTES } from "../api/config";

// Cache key for localStorage
const CATEGORIES_CACHE_KEY = "townspark_categories";
const CATEGORIES_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get cached categories from localStorage
 * @returns {Array|null} Cached categories or null if expired/missing
 */
function getCachedCategories() {
	if (typeof window === "undefined") return null;

	try {
		const cached = localStorage.getItem(CATEGORIES_CACHE_KEY);
		if (!cached) return null;

		const { data, timestamp } = JSON.parse(cached);
		const isExpired = Date.now() - timestamp > CATEGORIES_CACHE_EXPIRY;

		if (isExpired) {
			localStorage.removeItem(CATEGORIES_CACHE_KEY);
			return null;
		}

		return data;
	} catch {
		return null;
	}
}

/**
 * Save categories to localStorage cache
 * @param {Array} categories
 */
function setCachedCategories(categories) {
	if (typeof window === "undefined") return;

	try {
		localStorage.setItem(
			CATEGORIES_CACHE_KEY,
			JSON.stringify({
				data: categories,
				timestamp: Date.now(),
			})
		);
	} catch {
		// Ignore storage errors
	}
}

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

	/**
	 * Get all issue categories
	 * No authentication required
	 * Results are cached in localStorage for 24 hours
	 * @param {boolean} [forceRefresh=false] - Force refresh from server
	 * @returns {Promise<ApiResponse>}
	 */
	async getCategories(forceRefresh = false) {
		// Check cache first
		if (!forceRefresh) {
			const cached = getCachedCategories();
			if (cached) {
				return ApiResponse.success(cached);
			}
		}

		// Fetch from server
		const response = await httpClient.get(API_ROUTES.issues.categories, {
			auth: false,
		});

		// Cache successful response
		if (response.success && response.data) {
			setCachedCategories(response.data);
		}

		return response;
	},

	/**
	 * Get issues by category
	 * Regular users see only their own issues in the category
	 * Staff/Admin users see all issues in the category
	 * @param {string} category - Category value (e.g., "road_damage")
	 * @param {Object} [params] - Query parameters
	 * @param {string} [params.status] - Filter by status
	 * @returns {Promise<ApiResponse>}
	 */
	async getIssuesByCategory(category, params = {}) {
		const queryParams = {};
		if (params.status) queryParams.status = params.status;

		return httpClient.get(API_ROUTES.issues.byCategory(category), {
			auth: true,
			params: queryParams,
		});
	},

	/**
	 * Get category label by value
	 * Uses cached categories if available
	 * @param {string} categoryValue - Category value (e.g., "road_damage")
	 * @returns {string} Category label or the value itself if not found
	 */
	getCategoryLabel(categoryValue) {
		if (!categoryValue) return "Uncategorized";

		const cached = getCachedCategories();
		if (cached) {
			const category = cached.find((c) => c.value === categoryValue);
			if (category) return category.label;
		}

		// Fallback: convert snake_case to Title Case
		return categoryValue
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	},

	/**
	 * Clear the categories cache
	 */
	clearCategoriesCache() {
		if (typeof window !== "undefined") {
			localStorage.removeItem(CATEGORIES_CACHE_KEY);
		}
	},
};

export default IssueService;
