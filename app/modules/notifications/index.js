/**
 * Notification Service
 * DEPRECATED: These endpoints no longer exist in the new backend.
 * Stubbed to return empty data to prevent crashes.
 */

import { ApiResponse } from "../api/http_client";

export const NotificationService = {
	async getNotifications() {
		return ApiResponse.success({ results: [], count: 0 });
	},
	async getUnreadCount() {
		return ApiResponse.success({ count: 0 });
	},
	async markAsRead() {
		return ApiResponse.success({ success: true });
	},
	async markAllAsRead() {
		return ApiResponse.success({ success: true });
	},
	async deleteNotification() {
		return ApiResponse.success({ success: true });
	},
	async getPreferences() {
		return ApiResponse.success({
			email_notifications: true,
			push_notifications: true,
		});
	},
	async updatePreferences() {
		return ApiResponse.error("Notification preferences not available");
	},
};

export default NotificationService;
