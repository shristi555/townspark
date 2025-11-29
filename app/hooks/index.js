"use client";

/**
 * Custom hooks for data fetching with loading and error states
 */

import { useState, useEffect, useCallback } from "react";
import { IssueService } from "../modules/issues";
import { UserService } from "../modules/users";
import { NotificationService } from "../modules/notifications";
import { CommentService } from "../modules/comments";
import { CoreService, AnalyticsService } from "../modules/core";
import { ResolverService } from "../modules/resolver";
import { AdminService } from "../modules/admin";

// ==================== Error Handling Utilities ====================

/**
 * Context-specific error messages for better UX
 */
const CONTEXT_ERROR_MESSAGES = {
	issues: {
		fetch: "Unable to load issues. Please refresh the page or try again later.",
		fetchSingle:
			"Unable to load this issue. It may have been removed or you don't have access.",
		create: "Failed to submit your report. Please check your input and try again.",
		update: "Failed to update the issue. Please try again.",
		delete: "Failed to delete the issue. Please try again.",
		upvote: "Unable to upvote this issue. Please try again.",
		bookmark: "Unable to bookmark this issue. Please try again.",
	},
	users: {
		fetch: "Unable to load user information. Please try again.",
		fetchProfile: "Unable to load profile. Please refresh the page.",
		update: "Failed to update your profile. Please check your input and try again.",
	},
	comments: {
		fetch: "Unable to load comments. Please refresh the page.",
		create: "Failed to post your comment. Please try again.",
		delete: "Failed to delete the comment. Please try again.",
	},
	notifications: {
		fetch: "Unable to load notifications. Please try again.",
		markRead: "Failed to mark notification as read. Please try again.",
	},
	auth: {
		login: "Login failed. Please check your credentials and try again.",
		register:
			"Registration failed. Please check your information and try again.",
		logout: "Logout failed. Please try again.",
		fetchUser:
			"Unable to load your account information. Please refresh the page.",
	},
	categories: {
		fetch: "Unable to load categories. Some features may be limited.",
	},
	areas: {
		fetch: "Unable to load areas. Some features may be limited.",
	},
	resolver: {
		fetch: "Unable to load resolver data. Please try again.",
		updateStatus: "Failed to update issue status. Please try again.",
	},
	admin: {
		fetch: "Unable to load admin data. Please try again.",
		fetchUsers: "Unable to load user list. Please try again.",
	},
	analytics: {
		fetch: "Unable to load analytics data. Please try again.",
	},
	generic: {
		fetch: "Unable to load data. Please try again.",
		submit: "Failed to submit. Please try again.",
		network: "Network error. Please check your connection and try again.",
		unknown: "An unexpected error occurred. Please try again.",
	},
};

/**
 * Helper function to extract and format error message from various formats
 * @param {any} error - Error from API response
 * @param {string} context - Context key for specific error message
 * @param {string} action - Action key for specific error message
 * @returns {string}
 */
function getErrorMessage(error, context = "generic", action = "fetch") {
	// Get context-specific default message
	const contextMessages =
		CONTEXT_ERROR_MESSAGES[context] || CONTEXT_ERROR_MESSAGES.generic;
	const defaultMessage =
		contextMessages[action] ||
		contextMessages.fetch ||
		CONTEXT_ERROR_MESSAGES.generic.unknown;

	if (!error) return defaultMessage;

	// If it's a string, check if it's a useful message
	if (typeof error === "string") {
		// If it's a generic/unhelpful message, use our context-specific one
		const genericMessages = [
			"An error occurred",
			"Request failed",
			"Error",
			"Unknown error",
		];
		if (
			genericMessages.some((msg) =>
				error.toLowerCase().includes(msg.toLowerCase())
			)
		) {
			return defaultMessage;
		}
		return error;
	}

	// Try to extract field-specific errors for validation
	if (error.fieldErrors && typeof error.fieldErrors === "object") {
		const fieldNames = Object.keys(error.fieldErrors);
		if (fieldNames.length > 0) {
			const firstField = fieldNames[0];
			const fieldError = Array.isArray(error.fieldErrors[firstField])
				? error.fieldErrors[firstField][0]
				: error.fieldErrors[firstField];
			return `${formatFieldName(firstField)}: ${fieldError}`;
		}
	}

	// Try various error message formats
	if (error.message && typeof error.message === "string")
		return error.message;
	if (error.detail && typeof error.detail === "string") return error.detail;
	if (error.error) return getErrorMessage(error.error, context, action);

	return defaultMessage;
}

/**
 * Format field name for display (snake_case to Title Case)
 */
function formatFieldName(fieldName) {
	return fieldName
		.replace(/_/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Log error details for developers
 */
function logHookError(hookName, action, error, additionalInfo = {}) {
	const timestamp = new Date().toISOString();
	console.group(`🔴 Hook Error [${timestamp}] - ${hookName}`);
	console.error("Action:", action);
	console.error("Error:", error);
	if (error?.errorCode) console.error("Error Code:", error.errorCode);
	if (error?.developerMessage)
		console.error("Dev Message:", error.developerMessage);
	if (error?.statusCode) console.error("Status Code:", error.statusCode);
	if (Object.keys(additionalInfo).length > 0) {
		console.error("Additional Info:", additionalInfo);
	}
	console.groupEnd();
}

// ==================== Generic Fetch Hook ====================

/**
 * Generic async data fetching hook
 * @param {Function} fetchFn - Async function to call
 * @param {Array} deps - Dependencies array
 * @param {Object} options - Options
 * @returns {Object} { data, loading, error, refetch }
 */
export function useAsyncData(fetchFn, deps = [], options = {}) {
	const {
		immediate = true,
		initialData = null,
		context = "generic",
		action = "fetch",
		hookName = "useAsyncData",
	} = options;

	const [data, setData] = useState(initialData);
	const [loading, setLoading] = useState(immediate);
	const [error, setError] = useState(null);

	const execute = useCallback(
		async (...args) => {
			setLoading(true);
			setError(null);

			try {
				const response = await fetchFn(...args);

				if (response.success) {
					setData(response.data);
					return { success: true, data: response.data };
				}

				// Log detailed error for developers
				logHookError(hookName, action, response, { args });

				const errorMsg =
					response.errorMessage ||
					getErrorMessage(response.error, context, action);
				setError(errorMsg);
				return { success: false, error: errorMsg };
			} catch (err) {
				// Log unexpected error for developers
				logHookError(hookName, action, err, {
					args,
					isUnexpected: true,
					stack: err.stack,
				});

				const errorMsg = getErrorMessage(err, context, action);
				setError(errorMsg);
				return { success: false, error: errorMsg };
			} finally {
				setLoading(false);
			}
		},
		[fetchFn, context, action, hookName]
	);

	useEffect(() => {
		if (immediate) {
			execute();
		}
	}, deps);

	return { data, loading, error, refetch: execute, setData };
}

// ==================== Issue Hooks ====================

/**
 * Hook to fetch issues with filtering
 * @param {Object} initialParams - Initial filter parameters
 */
export function useIssues(initialParams = {}) {
	const [params, setParams] = useState(initialParams);
	const [issues, setIssues] = useState([]);
	const [pagination, setPagination] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchIssues = useCallback(
		async (newParams = params) => {
			setLoading(true);
			setError(null);

			try {
				const response = await IssueService.getIssues(newParams);

				if (response.success) {
					setIssues(response.data.results || response.data);
					setPagination({
						count: response.data.count,
						next: response.data.next,
						previous: response.data.previous,
						currentPage: newParams.page || 1,
					});
				} else {
					logHookError("useIssues", "fetch", response, {
						params: newParams,
					});
					setError(
						getErrorMessage(response.error, "issues", "fetch")
					);
				}
			} catch (err) {
				logHookError("useIssues", "fetch", err, {
					params: newParams,
					isUnexpected: true,
				});
				setError(getErrorMessage(err, "issues", "fetch"));
			} finally {
				setLoading(false);
			}
		},
		[params]
	);

	useEffect(() => {
		fetchIssues(params);
	}, [params]);

	const updateFilters = useCallback((newFilters) => {
		setParams((prev) => ({ ...prev, ...newFilters, page: 1 }));
	}, []);

	const goToPage = useCallback((page) => {
		setParams((prev) => ({ ...prev, page }));
	}, []);

	return {
		issues,
		loading,
		error,
		pagination,
		params,
		updateFilters,
		goToPage,
		refetch: fetchIssues,
	};
}

/**
 * Hook to fetch a single issue by ID
 * @param {number|string} issueId
 */
export function useIssue(issueId) {
	const [issue, setIssue] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchIssue = useCallback(async () => {
		if (!issueId) return;

		setLoading(true);
		setError(null);

		try {
			const response = await IssueService.getIssueById(issueId);

			if (response.success) {
				setIssue(response.data);
			} else {
				logHookError("useIssue", "fetchSingle", response, { issueId });
				setError(
					getErrorMessage(response.error, "issues", "fetchSingle")
				);
			}
		} catch (err) {
			logHookError("useIssue", "fetchSingle", err, {
				issueId,
				isUnexpected: true,
			});
			setError(getErrorMessage(err, "issues", "fetchSingle"));
		} finally {
			setLoading(false);
		}
	}, [issueId]);

	useEffect(() => {
		fetchIssue();
	}, [fetchIssue]);

	return { issue, loading, error, refetch: fetchIssue, setIssue };
}

/**
 * Hook to fetch trending issues
 */
export function useTrendingIssues() {
	return useAsyncData(() => IssueService.getTrending(), [], {
		initialData: [],
		context: "issues",
		action: "fetch",
		hookName: "useTrendingIssues",
	});
}

/**
 * Hook for issue mutations (upvote, bookmark)
 */
export function useIssueMutations() {
	const [loading, setLoading] = useState(false);

	const upvote = useCallback(async (issueId) => {
		setLoading(true);
		try {
			const response = await IssueService.upvote(issueId);
			if (!response.success) {
				logHookError("useIssueMutations", "upvote", response, {
					issueId,
				});
			}
			return response;
		} catch (err) {
			logHookError("useIssueMutations", "upvote", err, {
				issueId,
				isUnexpected: true,
			});
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const removeUpvote = useCallback(async (issueId) => {
		setLoading(true);
		try {
			const response = await IssueService.removeUpvote(issueId);
			if (!response.success) {
				logHookError("useIssueMutations", "removeUpvote", response, {
					issueId,
				});
			}
			return response;
		} catch (err) {
			logHookError("useIssueMutations", "removeUpvote", err, {
				issueId,
				isUnexpected: true,
			});
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const bookmark = useCallback(async (issueId) => {
		setLoading(true);
		try {
			const response = await IssueService.bookmark(issueId);
			if (!response.success) {
				logHookError("useIssueMutations", "bookmark", response, {
					issueId,
				});
			}
			return response;
		} catch (err) {
			logHookError("useIssueMutations", "bookmark", err, {
				issueId,
				isUnexpected: true,
			});
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const removeBookmark = useCallback(async (issueId) => {
		setLoading(true);
		try {
			const response = await IssueService.removeBookmark(issueId);
			if (!response.success) {
				logHookError("useIssueMutations", "removeBookmark", response, {
					issueId,
				});
			}
			return response;
		} catch (err) {
			logHookError("useIssueMutations", "removeBookmark", err, {
				issueId,
				isUnexpected: true,
			});
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	return { upvote, removeUpvote, bookmark, removeBookmark, loading };
}

// ==================== User Hooks ====================

/**
 * Hook to fetch user's own issues
 */
export function useMyIssues(params = {}) {
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchMyIssues = useCallback(async () => {
		setLoading(true);
		try {
			const response = await UserService.getMyIssues(params);
			if (response.success) {
				setIssues(response.data.results || response.data);
			} else {
				logHookError("useMyIssues", "fetchMyIssues", response, {
					params,
				});
				setError(
					getErrorMessage(response.error, "users", "fetchProfile")
				);
			}
		} catch (err) {
			logHookError("useMyIssues", "fetchMyIssues", err, {
				params,
				isUnexpected: true,
			});
			setError(getErrorMessage(err, "users", "fetchProfile"));
		} finally {
			setLoading(false);
		}
	}, [params]);

	useEffect(() => {
		fetchMyIssues();
	}, [fetchMyIssues]);

	return { issues, loading, error, refetch: fetchMyIssues };
}

/**
 * Hook to fetch user's bookmarked issues
 */
export function useMyBookmarks() {
	return useAsyncData(() => UserService.getMyBookmarks(), [], {
		initialData: [],
		context: "users",
		action: "fetchProfile",
		hookName: "useMyBookmarks",
	});
}

/**
 * Hook to fetch user settings
 */
export function useUserSettings() {
	const {
		data: settings,
		loading,
		error,
		refetch,
		setData,
	} = useAsyncData(() => UserService.getSettings(), [], {
		initialData: null,
		context: "users",
		action: "fetchProfile",
		hookName: "useUserSettings",
	});

	const updateSettings = useCallback(
		async (newSettings) => {
			try {
				const response = await UserService.updateSettings(newSettings);
				if (response.success) {
					setData((prev) => ({ ...prev, ...newSettings }));
				} else {
					logHookError(
						"useUserSettings",
						"updateSettings",
						response,
						{ newSettings }
					);
				}
				return response;
			} catch (err) {
				logHookError("useUserSettings", "updateSettings", err, {
					newSettings,
					isUnexpected: true,
				});
				throw err;
			}
		},
		[setData]
	);

	return { settings, loading, error, refetch, updateSettings };
}

// ==================== Comment Hooks ====================

/**
 * Hook to fetch comments for an issue
 * @param {number|string} issueId
 */
export function useComments(issueId) {
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchComments = useCallback(async () => {
		if (!issueId) return;

		setLoading(true);
		try {
			const response = await CommentService.getComments(issueId);
			if (response.success) {
				setComments(response.data.results || response.data);
			} else {
				logHookError("useComments", "fetchComments", response, {
					issueId,
				});
				setError(getErrorMessage(response.error, "comments", "fetch"));
			}
		} catch (err) {
			logHookError("useComments", "fetchComments", err, {
				issueId,
				isUnexpected: true,
			});
			setError(getErrorMessage(err, "comments", "fetch"));
		} finally {
			setLoading(false);
		}
	}, [issueId]);

	useEffect(() => {
		fetchComments();
	}, [fetchComments]);

	const addComment = useCallback(
		async (content, parentId = null) => {
			try {
				const response = await CommentService.createComment(
					issueId,
					content,
					parentId
				);
				if (response.success) {
					await fetchComments(); // Refresh comments
				} else {
					logHookError("useComments", "addComment", response, {
						issueId,
						parentId,
					});
				}
				return response;
			} catch (err) {
				logHookError("useComments", "addComment", err, {
					issueId,
					parentId,
					isUnexpected: true,
				});
				throw err;
			}
		},
		[issueId, fetchComments]
	);

	const deleteComment = useCallback(
		async (commentId) => {
			try {
				const response = await CommentService.deleteComment(commentId);
				if (response.success) {
					await fetchComments(); // Refresh comments
				} else {
					logHookError("useComments", "deleteComment", response, {
						commentId,
					});
				}
				return response;
			} catch (err) {
				logHookError("useComments", "deleteComment", err, {
					commentId,
					isUnexpected: true,
				});
				throw err;
			}
		},
		[fetchComments]
	);

	return {
		comments,
		loading,
		error,
		refetch: fetchComments,
		addComment,
		deleteComment,
	};
}

// ==================== Notification Hooks ====================

/**
 * Hook to fetch notifications
 */
export function useNotifications() {
	const [notifications, setNotifications] = useState([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchNotifications = useCallback(async () => {
		setLoading(true);
		try {
			const [notifResponse, countResponse] = await Promise.all([
				NotificationService.getNotifications(),
				NotificationService.getUnreadCount(),
			]);

			if (notifResponse.success) {
				setNotifications(
					notifResponse.data.results || notifResponse.data
				);
			} else {
				logHookError(
					"useNotifications",
					"fetchNotifications",
					notifResponse,
					{}
				);
				setError(
					getErrorMessage(
						notifResponse.error,
						"notifications",
						"fetch"
					)
				);
			}
			if (countResponse.success) {
				setUnreadCount(
					countResponse.data.count ||
						countResponse.data.unread_count ||
						0
				);
			}
		} catch (err) {
			logHookError("useNotifications", "fetchNotifications", err, {
				isUnexpected: true,
			});
			setError(getErrorMessage(err, "notifications", "fetch"));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	const markAsRead = useCallback(async (notificationId) => {
		try {
			const response =
				await NotificationService.markAsRead(notificationId);
			if (response.success) {
				setNotifications((prev) =>
					prev.map((n) =>
						n.id === notificationId ? { ...n, is_read: true } : n
					)
				);
				setUnreadCount((prev) => Math.max(0, prev - 1));
			} else {
				logHookError("useNotifications", "markAsRead", response, {
					notificationId,
				});
			}
			return response;
		} catch (err) {
			logHookError("useNotifications", "markAsRead", err, {
				notificationId,
				isUnexpected: true,
			});
			throw err;
		}
	}, []);

	const markAllAsRead = useCallback(async () => {
		try {
			const response = await NotificationService.markAllAsRead();
			if (response.success) {
				setNotifications((prev) =>
					prev.map((n) => ({ ...n, is_read: true }))
				);
				setUnreadCount(0);
			} else {
				logHookError("useNotifications", "markAllAsRead", response, {});
			}
			return response;
		} catch (err) {
			logHookError("useNotifications", "markAllAsRead", err, {
				isUnexpected: true,
			});
			throw err;
		}
	}, []);

	return {
		notifications,
		unreadCount,
		loading,
		error,
		refetch: fetchNotifications,
		markAsRead,
		markAllAsRead,
	};
}

// ==================== Core Data Hooks ====================

/**
 * Hook to fetch categories
 */
export function useCategories() {
	return useAsyncData(() => CoreService.getCategories(), [], {
		initialData: [],
		context: "core",
		action: "fetch",
		hookName: "useCategories",
	});
}

/**
 * Hook to fetch areas
 */
export function useAreas() {
	return useAsyncData(() => CoreService.getAreas(), [], {
		initialData: [],
		context: "core",
		action: "fetch",
		hookName: "useAreas",
	});
}

/**
 * Hook to fetch platform stats
 */
export function usePlatformStats() {
	return useAsyncData(() => CoreService.getPlatformStats(), [], {
		initialData: null,
		context: "core",
		action: "fetch",
		hookName: "usePlatformStats",
	});
}

// ==================== Resolver Hooks ====================

/**
 * Hook for resolver dashboard data
 */
export function useResolverDashboard() {
	return useAsyncData(() => ResolverService.getDashboard(), [], {
		initialData: null,
		context: "resolver",
		action: "fetch",
		hookName: "useResolverDashboard",
	});
}

/**
 * Hook for resolver's assigned issues
 */
export function useAssignedIssues(params = {}) {
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchAssignedIssues = useCallback(async () => {
		setLoading(true);
		try {
			const response = await ResolverService.getAssignedIssues(params);
			if (response.success) {
				setIssues(response.data.results || response.data);
			} else {
				logHookError(
					"useAssignedIssues",
					"fetchAssignedIssues",
					response,
					{ params }
				);
				setError(getErrorMessage(response.error, "resolver", "fetch"));
			}
		} catch (err) {
			logHookError("useAssignedIssues", "fetchAssignedIssues", err, {
				params,
				isUnexpected: true,
			});
			setError(getErrorMessage(err, "resolver", "fetch"));
		} finally {
			setLoading(false);
		}
	}, [params]);

	useEffect(() => {
		fetchAssignedIssues();
	}, [fetchAssignedIssues]);

	return { issues, loading, error, refetch: fetchAssignedIssues };
}

// ==================== Admin Hooks ====================

/**
 * Hook for admin dashboard data
 */
export function useAdminDashboard() {
	return useAsyncData(() => AdminService.getDashboard(), [], {
		initialData: null,
		context: "admin",
		action: "fetch",
		hookName: "useAdminDashboard",
	});
}

/**
 * Hook to fetch users (admin)
 */
export function useUsers(params = {}) {
	const [users, setUsers] = useState([]);
	const [pagination, setPagination] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchUsers = useCallback(
		async (newParams = params) => {
			setLoading(true);
			try {
				const response = await AdminService.getUsers(newParams);
				if (response.success) {
					setUsers(response.data.results || response.data);
					setPagination({
						count: response.data.count,
						next: response.data.next,
						previous: response.data.previous,
					});
				} else {
					logHookError("useUsers", "fetchUsers", response, {
						newParams,
					});
					setError(getErrorMessage(response.error, "admin", "fetch"));
				}
			} catch (err) {
				logHookError("useUsers", "fetchUsers", err, {
					newParams,
					isUnexpected: true,
				});
				setError(getErrorMessage(err, "admin", "fetch"));
			} finally {
				setLoading(false);
			}
		},
		[params]
	);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	return { users, pagination, loading, error, refetch: fetchUsers };
}

/**
 * Hook to fetch pending resolvers (admin)
 */
export function usePendingResolvers() {
	return useAsyncData(() => AdminService.getPendingResolvers(), [], {
		initialData: [],
		context: "admin",
		action: "fetch",
		hookName: "usePendingResolvers",
	});
}

// ==================== Analytics Hooks ====================

/**
 * Hook for analytics overview
 */
export function useAnalytics(period = "month") {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchAnalytics = useCallback(async () => {
		setLoading(true);
		try {
			const [overview, categoryStats, areaStats, trends] =
				await Promise.all([
					AnalyticsService.getOverview({ period }),
					AnalyticsService.getCategoryStats({ period }),
					AnalyticsService.getAreaStats({ period }),
					AnalyticsService.getTrends({ period }),
				]);

			// Check for errors in any of the responses
			const errors = [];
			if (!overview.success) errors.push("overview");
			if (!categoryStats.success) errors.push("category stats");
			if (!areaStats.success) errors.push("area stats");
			if (!trends.success) errors.push("trends");

			if (errors.length > 0) {
				logHookError(
					"useAnalytics",
					"fetchAnalytics",
					{ errors, overview, categoryStats, areaStats, trends },
					{ period }
				);
			}

			setData({
				overview: overview.success ? overview.data : null,
				categoryStats: categoryStats.success
					? categoryStats.data
					: null,
				areaStats: areaStats.success ? areaStats.data : null,
				trends: trends.success ? trends.data : null,
			});
		} catch (err) {
			logHookError("useAnalytics", "fetchAnalytics", err, {
				period,
				isUnexpected: true,
			});
			setError(getErrorMessage(err, "admin", "fetch"));
		} finally {
			setLoading(false);
		}
	}, [period]);

	useEffect(() => {
		fetchAnalytics();
	}, [fetchAnalytics]);

	return { data, loading, error, refetch: fetchAnalytics };
}

export default {
	useAsyncData,
	useIssues,
	useIssue,
	useTrendingIssues,
	useIssueMutations,
	useMyIssues,
	useMyBookmarks,
	useUserSettings,
	useComments,
	useNotifications,
	useCategories,
	useAreas,
	usePlatformStats,
	useResolverDashboard,
	useAssignedIssues,
	useAdminDashboard,
	useUsers,
	usePendingResolvers,
	useAnalytics,
};
