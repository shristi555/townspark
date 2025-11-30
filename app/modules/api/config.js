/**
 * API Configuration and Routes
 * Centralized endpoint definitions for the TownSpark API
 *
 * Backend API Documentation:
 * - Base URL: /api/v1/
 * - Authentication: JWT Bearer tokens
 * - User Levels: Admin, Staff (Resolver), Regular User (Citizen)
 */

// Use relative URL to go through Next.js proxy (avoids CORS issues)
// In production, set NEXT_PUBLIC_API_BASE_URL to your actual API domain
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

export const API_CONFIG = {
	baseUrl: API_BASE_URL,
	timeout: 30000, // 30 seconds
};

export const API_ROUTES = {
	// Authentication - accounts app
	auth: {
		signup: "/auth/signup/",
		login: "/auth/login/",
		refreshToken: "/auth/jwt/refresh/",
		verifyToken: "/auth/jwt/verify/",
		me: "/auth/users/me/",
		updateProfile: "/auth/users/me/",
	},

	// Users - for profile operations
	users: {
		me: "/auth/users/me/",
		byId: (id) => `/auth/users/${id}/`,
	},

	// Issues - issue app
	issues: {
		create: "/issues/new/",
		list: "/issues/list/",
		detail: (id) => `/issues/detail/${id}/`,
		update: (id) => `/issues/update/${id}/`,
		delete: (id) => `/issues/delete/${id}/`,
		// Convenience aliases
		byId: (id) => `/issues/detail/${id}/`,
	},

	// Comments - comment app
	comments: {
		create: "/comments/new/",
		list: (issueId) => `/comments/list/${issueId}/`,
		byIssue: (issueId) => `/comments/list/${issueId}/`,
		update: (commentId) => `/comments/update/${commentId}/`,
		delete: (commentId) => `/comments/delete/${commentId}/`,
		mine: "/comments/mine/",
		byUser: (userId) => `/comments/user/${userId}/`,
		// Alias
		byId: (commentId) => `/comments/update/${commentId}/`,
	},

	// Progress - progress app (Staff only)
	progress: {
		create: "/progress/new/",
		list: "/progress/list/",
		detail: (id) => `/progress/detail/${id}/`,
		update: (id) => `/progress/update/${id}/`,
		delete: (id) => `/progress/delete/${id}/`,
		byIssue: (issueId) => `/progress/issue/${issueId}/`,
	},

	// Status values for issues
	STATUS: {
		OPEN: "open",
		IN_PROGRESS: "in_progress",
		RESOLVED: "resolved",
		CLOSED: "closed",
	},
};

export default API_ROUTES;
