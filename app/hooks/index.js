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

// ==================== Generic Fetch Hook ====================

/**
 * Generic async data fetching hook
 * @param {Function} fetchFn - Async function to call
 * @param {Array} deps - Dependencies array
 * @param {Object} options - Options
 * @returns {Object} { data, loading, error, refetch }
 */
export function useAsyncData(fetchFn, deps = [], options = {}) {
	const { immediate = true, initialData = null } = options;

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
				setError(response.error || "An error occurred");
				return { success: false, error: response.error };
			} catch (err) {
				const errorMsg = err.message || "An unexpected error occurred";
				setError(errorMsg);
				return { success: false, error: errorMsg };
			} finally {
				setLoading(false);
			}
		},
		[fetchFn]
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
					setError(response.error);
				}
			} catch (err) {
				setError(err.message);
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
				setError(response.error);
			}
		} catch (err) {
			setError(err.message);
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
			return response;
		} finally {
			setLoading(false);
		}
	}, []);

	const removeUpvote = useCallback(async (issueId) => {
		setLoading(true);
		try {
			const response = await IssueService.removeUpvote(issueId);
			return response;
		} finally {
			setLoading(false);
		}
	}, []);

	const bookmark = useCallback(async (issueId) => {
		setLoading(true);
		try {
			const response = await IssueService.bookmark(issueId);
			return response;
		} finally {
			setLoading(false);
		}
	}, []);

	const removeBookmark = useCallback(async (issueId) => {
		setLoading(true);
		try {
			const response = await IssueService.removeBookmark(issueId);
			return response;
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
				setError(response.error);
			}
		} catch (err) {
			setError(err.message);
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
	});

	const updateSettings = useCallback(
		async (newSettings) => {
			const response = await UserService.updateSettings(newSettings);
			if (response.success) {
				setData((prev) => ({ ...prev, ...newSettings }));
			}
			return response;
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
				setError(response.error);
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [issueId]);

	useEffect(() => {
		fetchComments();
	}, [fetchComments]);

	const addComment = useCallback(
		async (content, parentId = null) => {
			const response = await CommentService.createComment(
				issueId,
				content,
				parentId
			);
			if (response.success) {
				await fetchComments(); // Refresh comments
			}
			return response;
		},
		[issueId, fetchComments]
	);

	const deleteComment = useCallback(
		async (commentId) => {
			const response = await CommentService.deleteComment(commentId);
			if (response.success) {
				await fetchComments(); // Refresh comments
			}
			return response;
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
			}
			if (countResponse.success) {
				setUnreadCount(
					countResponse.data.count ||
						countResponse.data.unread_count ||
						0
				);
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	const markAsRead = useCallback(async (notificationId) => {
		const response = await NotificationService.markAsRead(notificationId);
		if (response.success) {
			setNotifications((prev) =>
				prev.map((n) =>
					n.id === notificationId ? { ...n, is_read: true } : n
				)
			);
			setUnreadCount((prev) => Math.max(0, prev - 1));
		}
		return response;
	}, []);

	const markAllAsRead = useCallback(async () => {
		const response = await NotificationService.markAllAsRead();
		if (response.success) {
			setNotifications((prev) =>
				prev.map((n) => ({ ...n, is_read: true }))
			);
			setUnreadCount(0);
		}
		return response;
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
	});
}

/**
 * Hook to fetch areas
 */
export function useAreas() {
	return useAsyncData(() => CoreService.getAreas(), [], {
		initialData: [],
	});
}

/**
 * Hook to fetch platform stats
 */
export function usePlatformStats() {
	return useAsyncData(() => CoreService.getPlatformStats(), [], {
		initialData: null,
	});
}

// ==================== Resolver Hooks ====================

/**
 * Hook for resolver dashboard data
 */
export function useResolverDashboard() {
	return useAsyncData(() => ResolverService.getDashboard(), [], {
		initialData: null,
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
				setError(response.error);
			}
		} catch (err) {
			setError(err.message);
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
					setError(response.error);
				}
			} catch (err) {
				setError(err.message);
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

			setData({
				overview: overview.success ? overview.data : null,
				categoryStats: categoryStats.success
					? categoryStats.data
					: null,
				areaStats: areaStats.success ? areaStats.data : null,
				trends: trends.success ? trends.data : null,
			});
		} catch (err) {
			setError(err.message);
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
