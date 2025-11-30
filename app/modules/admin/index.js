/**
 * Admin Service
 * DEPRECATED: These endpoints no longer exist in the new backend.
 * Stubbed to return empty data to prevent crashes.
 * Admin functionality is now determined by is_admin flag on user.
 */

import { ApiResponse } from "../api/http_client";

export const AdminService = {
	async getDashboard() {
		return ApiResponse.success({
			total_users: 0,
			total_issues: 0,
			pending_verifications: 0,
		});
	},
	async getUsers() {
		return ApiResponse.success({ results: [], count: 0 });
	},
	async getUserById() {
		return ApiResponse.error("Admin user management not available");
	},
	async updateUser() {
		return ApiResponse.error("Admin user management not available");
	},
	async banUser() {
		return ApiResponse.error("Admin user management not available");
	},
	async unbanUser() {
		return ApiResponse.error("Admin user management not available");
	},
	async toggleUserStatus() {
		return ApiResponse.error("Admin user management not available");
	},
	async deleteUser() {
		return ApiResponse.error("Admin user management not available");
	},
	async getPendingResolvers() {
		return ApiResponse.success({ results: [], count: 0 });
	},
	async getPendingVerifications() {
		return ApiResponse.success({ results: [], count: 0 });
	},
	async getResolvers() {
		return ApiResponse.success({ results: [], count: 0 });
	},
	async verifyResolver() {
		return ApiResponse.error("Resolver verification not available");
	},
	async approveResolver() {
		return ApiResponse.error("Resolver approval not available");
	},
	async rejectResolver() {
		return ApiResponse.error("Resolver rejection not available");
	},
	async assignArea() {
		return ApiResponse.error("Area assignment not available");
	},
	async getIssues() {
		return ApiResponse.success({ results: [], count: 0 });
	},
	async assignIssue() {
		return ApiResponse.error("Issue assignment not available");
	},
	async updatePriority() {
		return ApiResponse.error("Priority update not available");
	},
	async deleteIssue() {
		return ApiResponse.error("Issue deletion not available");
	},
	async getCategories() {
		return ApiResponse.success([]);
	},
	async createCategory() {
		return ApiResponse.error("Category management not available");
	},
	async updateCategory() {
		return ApiResponse.error("Category management not available");
	},
	async deleteCategory() {
		return ApiResponse.error("Category management not available");
	},
	async getAreas() {
		return ApiResponse.success([]);
	},
	async createArea() {
		return ApiResponse.error("Area management not available");
	},
	async updateArea() {
		return ApiResponse.error("Area management not available");
	},
	async deleteArea() {
		return ApiResponse.error("Area management not available");
	},
	async getReports() {
		return ApiResponse.success({ results: [], count: 0 });
	},
	async getRecentActivity() {
		return ApiResponse.success({ results: [], count: 0 });
	},
	async handleReport() {
		return ApiResponse.error("Report handling not available");
	},
};

export default AdminService;
