/**
 * Comment Service
 * Handles all comment-related API calls
 */

import httpClient from "../api/http_client";
import { API_ROUTES } from "../api/config";

export const CommentService = {
	/**
	 * Get comments for an issue
	 * @param {number|string} issueId
	 * @param {Object} [params]
	 * @returns {Promise<ApiResponse>}
	 */
	async getComments(issueId, params = {}) {
		return httpClient.get(API_ROUTES.comments.byIssue(issueId), { params });
	},

	/**
	 * Create a comment on an issue
	 * @param {number|string} issueId
	 * @param {string} content
	 * @param {number|string} [parentId] - For replies
	 * @returns {Promise<ApiResponse>}
	 */
	async createComment(issueId, content, parentId = null) {
		const payload = {
			issue: issueId,
			content,
		};

		if (parentId) {
			payload.parent = parentId;
		}

		return httpClient.post(API_ROUTES.comments.create, payload, {
			auth: true,
		});
	},

	/**
	 * Update a comment
	 * @param {number|string} commentId
	 * @param {string} content
	 * @returns {Promise<ApiResponse>}
	 */
	async updateComment(commentId, content) {
		return httpClient.patch(
			API_ROUTES.comments.byId(commentId),
			{ content },
			{ auth: true }
		);
	},

	/**
	 * Delete a comment
	 * @param {number|string} commentId
	 * @returns {Promise<ApiResponse>}
	 */
	async deleteComment(commentId) {
		return httpClient.delete(API_ROUTES.comments.byId(commentId), {
			auth: true,
		});
	},

	/**
	 * Get replies to a comment
	 * @param {number|string} commentId
	 * @returns {Promise<ApiResponse>}
	 */
	async getReplies(commentId) {
		return httpClient.get(API_ROUTES.comments.replies(commentId));
	},
};

export default CommentService;
