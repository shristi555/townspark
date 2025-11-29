/**
 * API Configuration and Routes
 * Centralized endpoint definitions for the TownSpark API
 */

// Use relative URL to go through Next.js proxy (avoids CORS issues)
// In production, set NEXT_PUBLIC_API_BASE_URL to your actual API domain
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

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
		byId: (id) => `/issues/${id}/`,
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
		byIssue: (issueId) => `/issues/${issueId}/comments/`,
		create: "/comments/",
		byId: (commentId) => `/comments/${commentId}/`,
		delete: (issueId, commentId) =>
			`/issues/${issueId}/comments/${commentId}/`,
		like: (commentId) => `/comments/${commentId}/like/`,
		replies: (commentId) => `/comments/${commentId}/replies/`,
	},

	// Notifications
	notifications: {
		list: "/notifications/",
		byId: (id) => `/notifications/${id}/`,
		markRead: (id) => `/notifications/${id}/read/`,
		markAllRead: "/notifications/read-all/",
		delete: (id) => `/notifications/${id}/`,
		unreadCount: "/notifications/unread-count/",
		clearAll: "/notifications/clear-all/",
	},

	// Core/Reference Data
	core: {
		categories: "/categories/",
		departments: "/departments/",
		areas: "/areas/",
		wards: "/wards/",
		statusOptions: "/status-options/",
		urgencyLevels: "/urgency-levels/",
		platformStats: "/platform/stats/",
	},

	// Resolver
	resolver: {
		dashboard: "/resolver/dashboard/",
		assigned: "/resolver/assigned/",
		assignedIssues: "/resolver/issues/assigned/",
		pending: "/resolver/pending/",
		accept: (id) => `/resolver/issues/${id}/accept/`,
		complete: (id) => `/resolver/issues/${id}/complete/`,
		claimIssue: (id) => `/resolver/issues/${id}/claim/`,
		updateStatus: (id) => `/resolver/issues/${id}/status/`,
		addTimeline: (id) => `/resolver/issues/${id}/timeline/`,
		addOfficialResponse: (id) =>
			`/resolver/issues/${id}/official-response/`,
	},

	// Admin
	admin: {
		dashboard: "/admin/dashboard/",
		users: {
			list: "/admin/users/",
			byId: (id) => `/admin/users/${id}/`,
			ban: (id) => `/admin/users/${id}/ban/`,
			unban: (id) => `/admin/users/${id}/unban/`,
		},
		resolvers: {
			list: "/admin/resolvers/",
			pending: "/admin/resolvers/pending/",
			byId: (id) => `/admin/resolvers/${id}/`,
			verify: (id) => `/admin/resolvers/${id}/verify/`,
			reject: (id) => `/admin/resolvers/${id}/reject/`,
		},
		issues: {
			list: "/admin/issues/",
			byId: (id) => `/admin/issues/${id}/`,
		},
	},

	// Analytics
	analytics: {
		overview: "/analytics/overview/",
		issues: "/analytics/issues/",
		users: "/analytics/users/",
		resolvers: "/analytics/resolvers/",
		byCategory: "/analytics/by-category/",
		byArea: "/analytics/by-area/",
		trends: "/analytics/trends/",
	},
};

export default API_ROUTES;
