/**
 * Common Models
 * Reusable data models for the application
 */

/**
 * Base Model class with common utilities
 */
export class BaseModel {
	/**
	 * Create instance from JSON data
	 * @param {Object} data
	 * @returns {BaseModel}
	 */
	static fromJson(data) {
		return new this(data);
	}

	/**
	 * Convert to JSON
	 * @returns {Object}
	 */
	toJson() {
		return { ...this };
	}
}

/**
 * User Model
 */
export class UserModel extends BaseModel {
	constructor(data = {}) {
		super();
		this.id = data.id || null;
		this.email = data.email || "";
		this.fullName = data.full_name || data.fullName || "";
		this.firstName = data.first_name || data.firstName || "";
		this.lastName = data.last_name || data.lastName || "";
		this.phone = data.phone_number || data.phone || "";
		this.address = data.address || "";
		this.ward = data.ward || "";
		this.bio = data.bio || "";
		this.role = data.role || "citizen";
		this.avatar = data.profile_image || data.avatar || null;
		this.isVerified = data.is_verified || false;
		this.isActive = data.is_active || true;
		this.dateJoined = data.date_joined || null;
	}

	get displayName() {
		return (
			this.fullName ||
			`${this.firstName} ${this.lastName}`.trim() ||
			this.email
		);
	}

	get initials() {
		const name = this.displayName;
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	}

	toJson() {
		return {
			full_name: this.fullName,
			phone_number: this.phone,
			address: this.address,
			ward: this.ward,
			bio: this.bio,
		};
	}
}

/**
 * Issue Model
 */
export class IssueModel extends BaseModel {
	constructor(data = {}) {
		super();
		this.id = data.id || null;
		this.title = data.title || "";
		this.description = data.description || "";
		this.category = data.category || null;
		this.categoryName = data.category_name || data.categoryName || "";
		this.urgencyLevel = data.urgency_level || data.urgencyLevel || "medium";
		this.status = data.status || "pending";
		this.location = data.location || "";
		this.latitude = data.latitude || null;
		this.longitude = data.longitude || null;
		this.area = data.area || null;
		this.areaName = data.area_name || data.areaName || "";
		this.isAnonymous = data.is_anonymous || false;
		this.isPublic = data.is_public !== false;
		this.images = data.images || [];
		this.upvoteCount = data.upvote_count || data.upvoteCount || 0;
		this.commentCount = data.comment_count || data.commentCount || 0;
		this.isUpvoted = data.is_upvoted || false;
		this.isBookmarked = data.is_bookmarked || false;
		this.createdAt = data.created_at || data.createdAt || null;
		this.updatedAt = data.updated_at || data.updatedAt || null;
		this.author = data.author ? new UserModel(data.author) : null;
		this.assignedTo = data.assigned_to
			? new UserModel(data.assigned_to)
			: null;
		this.officialResponse = data.official_response || null;
	}

	get statusColor() {
		const colors = {
			pending: "yellow",
			in_progress: "blue",
			resolved: "green",
			rejected: "red",
		};
		return colors[this.status] || "gray";
	}

	get urgencyColor() {
		const colors = {
			low: "green",
			medium: "yellow",
			high: "orange",
			critical: "red",
		};
		return colors[this.urgencyLevel] || "gray";
	}

	get formattedDate() {
		if (!this.createdAt) return "";
		return new Date(this.createdAt).toLocaleDateString();
	}
}

/**
 * Comment Model
 */
export class CommentModel extends BaseModel {
	constructor(data = {}) {
		super();
		this.id = data.id || null;
		this.content = data.content || "";
		this.author = data.author ? new UserModel(data.author) : null;
		this.issueId = data.issue || data.issueId || null;
		this.likeCount = data.like_count || data.likeCount || 0;
		this.isLiked = data.is_liked || false;
		this.createdAt = data.created_at || data.createdAt || null;
	}
}

/**
 * Notification Model
 */
export class NotificationModel extends BaseModel {
	constructor(data = {}) {
		super();
		this.id = data.id || null;
		this.type = data.notification_type || data.type || "";
		this.title = data.title || "";
		this.message = data.message || "";
		this.isRead = data.is_read || false;
		this.relatedIssue = data.related_issue || null;
		this.createdAt = data.created_at || data.createdAt || null;
	}

	get icon() {
		const icons = {
			issue_update: "refresh",
			comment: "message",
			upvote: "thumb-up",
			status_change: "flag",
			assignment: "user",
		};
		return icons[this.type] || "bell";
	}
}

/**
 * Pagination wrapper
 */
export class PaginatedResult {
	constructor(data = {}) {
		this.count = data.count || 0;
		this.next = data.next || null;
		this.previous = data.previous || null;
		this.results = data.results || [];
	}

	get hasNext() {
		return !!this.next;
	}

	get hasPrevious() {
		return !!this.previous;
	}

	get totalPages() {
		const perPage = this.results.length || 10;
		return Math.ceil(this.count / perPage);
	}
}

export default {
	BaseModel,
	UserModel,
	IssueModel,
	CommentModel,
	NotificationModel,
	PaginatedResult,
};
