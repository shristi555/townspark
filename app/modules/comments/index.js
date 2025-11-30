/**
 * Comment Service
 * Handles all comment-related API calls
 *
 * Backend Endpoints:
 * - POST /comments/new/ - Create comment on an issue
 * - GET /comments/list/{issue_id}/ - List comments for an issue
 * - PUT/PATCH /comments/update/{id}/ - Update comment (owner only)
 * - DELETE /comments/delete/{id}/ - Delete comment (owner or admin)
 * - GET /comments/mine/ - Get current user's comments
 * - GET /comments/issue/{issue_id}/ - Alias for list
 * - GET /comments/user/{user_id}/ - Get comments by user (staff/admin only)
 */

import httpClient from "../api/http_client";
import { API_ROUTES } from "../api/config";

export const CommentService = {
	/**
	 * Get comments for an issue
	 * @param {number|string} issueId
	 * @returns {Promise<ApiResponse>}
	 */
	async getComments(issueId) {
		return httpClient.get(API_ROUTES.comments.list(issueId), {
			auth: true,
		});
	},

	/**
	 * Create a comment on an issue
	 * @param {number|string} issueId
	 * @param {string} content
	 * @returns {Promise<ApiResponse>}
	 */
	async createComment(issueId, content) {
		return httpClient.post(
			API_ROUTES.comments.create,
			{
				issue_id: issueId,
				content,
			},
			{ auth: true }
		);
	},

	/**
	 * Update a comment (owner only)
	 * @param {number|string} commentId
	 * @param {string} content
	 * @returns {Promise<ApiResponse>}
	 */
	async updateComment(commentId, content) {
		return httpClient.patch(
			API_ROUTES.comments.update(commentId),
			{ content },
			{ auth: true }
		);
	},

	/**
	 * Delete a comment (owner or admin only)
	 * @param {number|string} commentId
	 * @returns {Promise<ApiResponse>}
	 */
	async deleteComment(commentId) {
		return httpClient.delete(API_ROUTES.comments.delete(commentId), {
			auth: true,
		});
	},

	/**
	 * Get current user's comments
	 * @returns {Promise<ApiResponse>}
	 */
	async getMyComments() {
		return httpClient.get(API_ROUTES.comments.mine, { auth: true });
	},

	/**
	 * Get comments by a specific user (staff/admin only)
	 * @param {number|string} userId
	 * @returns {Promise<ApiResponse>}
	 */
	async getCommentsByUser(userId) {
		return httpClient.get(API_ROUTES.comments.byUser(userId), {
			auth: true,
		});
	},
};

export default CommentService;
