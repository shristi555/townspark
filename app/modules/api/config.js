/**
 * API Configuration and Routes
 * Centralized endpoint definitions for the TownSpark API
 */

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export const API_CONFIG = {
	baseUrl: API_BASE_URL,
	timeout: 30000, // 30 seconds
};

export const API_ROUTES = {
	// Authentication
	auth: {
		login: "/auth/login/",
		register: "/auth/users/",
		registerResolver: "/auth/register/resolver/",
		refreshToken: "/auth/token/refresh/",
		resetPassword: "/auth/users/reset_password/",
		resetPasswordConfirm: "/auth/users/reset_password_confirm/",
		changePassword: "/auth/users/set_password/",
	},

	// Users
	users: {
		me: "/users/me/",
		myIssues: "/users/me/issues/",
		myBookmarks: "/users/me/bookmarks/",
		myUpvoted: "/users/me/upvoted/",
		mySettings: "/users/me/settings/",
		byId: (id) => `/users/${id}/`,
	},

	// Issues
	issues: {
		list: "/issues/",
		create: "/issues/",
		detail: (id) => `/issues/${id}/`,
		update: (id) => `/issues/${id}/`,
		delete: (id) => `/issues/${id}/`,
		upvote: (id) => `/issues/${id}/upvote/`,
		bookmark: (id) => `/issues/${id}/bookmark/`,
		share: (id) => `/issues/${id}/share/`,
		updateStatus: (id) => `/issues/${id}/status/`,
		assign: (id) => `/issues/${id}/assign/`,
		officialResponse: (id) => `/issues/${id}/official-response/`,
	},

	// Comments
	comments: {
		list: (issueId) => `/issues/${issueId}/comments/`,
		create: (issueId) => `/issues/${issueId}/comments/`,
		delete: (issueId, commentId) =>
			`/issues/${issueId}/comments/${commentId}/`,
		like: (commentId) => `/comments/${commentId}/like/`,
	},

	// Notifications
	notifications: {
		list: "/notifications/",
		markRead: (id) => `/notifications/${id}/read/`,
		markAllRead: "/notifications/read-all/",
		delete: (id) => `/notifications/${id}/`,
	},

	// Core/Reference Data
	core: {
		categories: "/categories/",
		departments: "/departments/",
		statusOptions: "/status-options/",
		urgencyLevels: "/urgency-levels/",
		platformStats: "/platform/stats/",
	},

	// Resolver
	resolver: {
		dashboard: "/resolver/dashboard/",
		assigned: "/resolver/assigned/",
		pending: "/resolver/pending/",
		accept: (id) => `/resolver/issues/${id}/accept/`,
		complete: (id) => `/resolver/issues/${id}/complete/`,
	},

	// Admin
	admin: {
		dashboard: "/admin/dashboard/",
		users: "/admin/users/",
		userDetail: (id) => `/admin/users/${id}/`,
		toggleUserStatus: (id) => `/admin/users/${id}/toggle-status/`,
		deleteUser: (id) => `/admin/users/${id}/`,
		resolvers: "/admin/resolvers/",
		resolversPending: "/admin/resolvers/pending/",
		verifyResolver: (id) => `/admin/resolvers/${id}/verify/`,
		rejectResolver: (id) => `/admin/resolvers/${id}/reject/`,
		deleteResolver: (id) => `/admin/resolvers/${id}/`,
	},

	// Analytics
	analytics: {
		overview: "/analytics/overview/",
		issues: "/analytics/issues/",
		users: "/analytics/users/",
		resolvers: "/analytics/resolvers/",
	},
};

export default API_ROUTES;
