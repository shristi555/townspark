/**
 * Notification Service
 * Handles all notification-related API calls
 */

import httpClient from "../api/http_client";
import { API_ROUTES } from "../api/config";

export const NotificationService = {
	/**
	 * Get all notifications for current user
	 * @param {Object} [params]
	 * @param {number} [params.page] - Page number
	 * @param {boolean} [params.is_read] - Filter by read status
	 * @returns {Promise<ApiResponse>}
	 */
	async getNotifications(params = {}) {
		return httpClient.get(API_ROUTES.notifications.list, {
			auth: true,
			params,
		});
	},

	/**
	 * Get unread notification count
	 * @returns {Promise<ApiResponse>}
	 */
	async getUnreadCount() {
		return httpClient.get(API_ROUTES.notifications.unreadCount, {
			auth: true,
		});
	},

	/**
	 * Mark a notification as read
	 * @param {number|string} notificationId
	 * @returns {Promise<ApiResponse>}
	 */
	async markAsRead(notificationId) {
		return httpClient.post(
			API_ROUTES.notifications.markRead(notificationId),
			{},
			{ auth: true }
		);
	},

	/**
	 * Mark all notifications as read
	 * @returns {Promise<ApiResponse>}
	 */
	async markAllAsRead() {
		return httpClient.post(
			API_ROUTES.notifications.markAllRead,
			{},
			{ auth: true }
		);
	},

	/**
	 * Delete a notification
	 * @param {number|string} notificationId
	 * @returns {Promise<ApiResponse>}
	 */
	async deleteNotification(notificationId) {
		return httpClient.delete(
			API_ROUTES.notifications.byId(notificationId),
			{ auth: true }
		);
	},

	/**
	 * Clear all notifications
	 * @returns {Promise<ApiResponse>}
	 */
	async clearAll() {
		return httpClient.delete(API_ROUTES.notifications.clearAll, {
			auth: true,
		});
	},
};

export default NotificationService;
