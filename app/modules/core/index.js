/**
 * Core Service
 * DEPRECATED: These endpoints no longer exist in the new backend.
 * Stubbed to return empty data to prevent crashes.
 */

import { ApiResponse } from "../api/http_client";

export const CoreService = {
	async getCategories() {
		return ApiResponse.success([
			"Road issue",
			"Garbage issue",
			"Sewage issue",
			"Street light issue",
			"Water supply issue",
			"Drainage problem",
			"Pothole",
			"Illegal construction",
			"Noise pollution",
			"Air pollution",
			"Public toilet maintenance",
			"Stray animals",
			"Traffic signal malfunction",
			"Footpath damage",
			"Tree fallen",
			"Electricity issue",
			"Public park maintenance",
			"Illegal parking",
			"Open manhole",
			"Waterlogging",
		]);
	},
	async getAreas() {
		return ApiResponse.success([]);
	},
	async getStats() {
		return ApiResponse.success({
			total_issues: 0,
			resolved_issues: 0,
			pending_issues: 0,
		});
	},
	async getDashboard() {
		return ApiResponse.success({
			recent_issues: [],
			stats: {},
		});
	},
};

export const AnalyticsService = {
	async getDashboardStats() {
		return ApiResponse.success({
			total_users: 0,
			total_issues: 0,
			resolved_issues: 0,
			pending_issues: 0,
		});
	},
	async getIssueStats() {
		return ApiResponse.success({
			by_category: [],
			by_status: [],
			by_area: [],
		});
	},
	async getUserStats() {
		return ApiResponse.success({
			active_users: 0,
			new_users: 0,
		});
	},
	async getResolverStats() {
		return ApiResponse.success({
			total_resolvers: 0,
			issues_resolved: 0,
		});
	},
	async getTrends() {
		return ApiResponse.success({
			issues: [],
			resolutions: [],
		});
	},
};

export default CoreService;
