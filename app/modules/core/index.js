/**
 * Core Service
 * Handles core/shared API calls like categories, areas, analytics
 */

import httpClient from "../api/http_client";
import { API_ROUTES } from "../api/config";

export const CoreService = {
	/**
	 * Get all categories (public)
	 * @returns {Promise<ApiResponse>}
	 */
	async getCategories() {
		return httpClient.get(API_ROUTES.core.categories);
	},

	/**
	 * Get all areas (public)
	 * @returns {Promise<ApiResponse>}
	 */
	async getAreas() {
		return httpClient.get(API_ROUTES.core.areas);
	},

	/**
	 * Get platform statistics (public)
	 * @returns {Promise<ApiResponse>}
	 */
	async getPlatformStats() {
		return httpClient.get(API_ROUTES.core.platformStats);
	},

	/**
	 * Get ward list
	 * @returns {Promise<ApiResponse>}
	 */
	async getWards() {
		return httpClient.get(API_ROUTES.core.wards);
	},

	/**
	 * Get departments
	 * @returns {Promise<ApiResponse>}
	 */
	async getDepartments() {
		return httpClient.get(API_ROUTES.core.departments);
	},
};

export const AnalyticsService = {
	/**
	 * Get analytics overview
	 * @param {Object} [params]
	 * @param {string} [params.period] - Time period (week, month, year)
	 * @returns {Promise<ApiResponse>}
	 */
	async getOverview(params = {}) {
		return httpClient.get(API_ROUTES.analytics.overview, {
			auth: true,
			params,
		});
	},

	/**
	 * Get category-wise analytics
	 * @param {Object} [params]
	 * @returns {Promise<ApiResponse>}
	 */
	async getCategoryStats(params = {}) {
		return httpClient.get(API_ROUTES.analytics.byCategory, {
			auth: true,
			params,
		});
	},

	/**
	 * Get area-wise analytics
	 * @param {Object} [params]
	 * @returns {Promise<ApiResponse>}
	 */
	async getAreaStats(params = {}) {
		return httpClient.get(API_ROUTES.analytics.byArea, {
			auth: true,
			params,
		});
	},

	/**
	 * Get trend data
	 * @param {Object} [params]
	 * @param {string} [params.period] - Time period
	 * @returns {Promise<ApiResponse>}
	 */
	async getTrends(params = {}) {
		return httpClient.get(API_ROUTES.analytics.trends, {
			auth: true,
			params,
		});
	},

	/**
	 * Get resolver performance analytics
	 * @param {Object} [params]
	 * @returns {Promise<ApiResponse>}
	 */
	async getResolverPerformance(params = {}) {
		return httpClient.get(API_ROUTES.analytics.resolverPerformance, {
			auth: true,
			params,
		});
	},

	/**
	 * Get resolution time analytics
	 * @param {Object} [params]
	 * @returns {Promise<ApiResponse>}
	 */
	async getResolutionTime(params = {}) {
		return httpClient.get(API_ROUTES.analytics.resolutionTime, {
			auth: true,
			params,
		});
	},

	/**
	 * Export analytics report
	 * @param {Object} params
	 * @param {string} params.format - Export format (csv, pdf)
	 * @param {string} [params.period] - Time period
	 * @returns {Promise<Blob>}
	 */
	async exportReport(params) {
		const response = await httpClient.get(API_ROUTES.analytics.export, {
			auth: true,
			params,
		});
		return response;
	},
};

export default { CoreService, AnalyticsService };
