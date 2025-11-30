/**
 * Resolver Service
 * DEPRECATED: These endpoints no longer exist in the new backend.
 * Resolver functionality now uses IssueService with is_staff user flag.
 * Stubbed to return empty data to prevent crashes.
 */

import { ApiResponse } from "../api/http_client";

export const ResolverService = {
	async getDashboard() {
		return ApiResponse.success({
			assigned_issues: 0,
			resolved_issues: 0,
			pending_issues: 0,
		});
	},
	async getAssignedIssues() {
		return ApiResponse.success({ results: [], count: 0 });
	},
	async getIssueById() {
		return ApiResponse.error("Use IssueService.getById instead");
	},
	async updateIssueStatus() {
		return ApiResponse.error("Use IssueService.updateStatus instead");
	},
	async addProgressUpdate() {
		return ApiResponse.error("Use ProgressService.create instead");
	},
	async resolveIssue() {
		return ApiResponse.error("Use IssueService.updateStatus instead");
	},
	async requestMoreInfo() {
		return ApiResponse.error("Functionality not available");
	},
	async getStats() {
		return ApiResponse.success({
			total_resolved: 0,
			average_resolution_time: 0,
			satisfaction_rating: 0,
		});
	},
	async getPerformanceMetrics() {
		return ApiResponse.success({
			issues_resolved: 0,
			avg_time: 0,
			rating: 0,
		});
	},
};

export default ResolverService;
