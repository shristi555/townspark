import { Issue } from "./issue_model";
import { UserInfo, IUserInfo } from "./user_info";

/**
 * Profile issue - simplified issue format returned with profile
 */
export interface ProfileIssue {
	id: number;
	title: string;
	location: string;
	status: string;
	created_at: string;
	category: {
		id: number;
		name: string;
	};
}

/**
 * Profile response structure from backend
 * Extends user info with statistics and issues
 */
export interface IProfile extends IUserInfo {
	dateJoined: string;
	issuesReported: number;
	progressUpdates: number;
	issues: ProfileIssue[];
}

/**
 * Profile model class
 * Represents a user's complete profile with statistics
 */
export class Profile implements IProfile {
	// User info fields
	id: number;
	email: string;
	fullName: string;
	phoneNumber: string | null;
	address: string | null;
	profileImage: string | null;
	isStaff: boolean;
	isAdmin: boolean;

	// Profile-specific fields
	dateJoined: string;
	issuesReported: number;
	progressUpdates: number;
	issues: ProfileIssue[];

	constructor(data: IProfile) {
		this.id = data.id;
		this.email = data.email;
		this.fullName = data.fullName;
		this.phoneNumber = data.phoneNumber ?? null;
		this.address = data.address ?? null;
		this.profileImage = data.profileImage ?? null;
		this.isStaff = data.isStaff ?? false;
		this.isAdmin = data.isAdmin ?? false;
		this.dateJoined = data.dateJoined;
		this.issuesReported = data.issuesReported ?? 0;
		this.progressUpdates = data.progressUpdates ?? 0;
		this.issues = data.issues ?? [];
	}

	/**
	 * Create Profile from backend JSON response
	 * Handles the 'user' wrapper in the response
	 */
	static fromJson(json: Record<string, any>): Profile {
		// Handle if wrapped in 'user' object
		const userData = json.user ?? json;

		return new Profile({
			id: userData.id,
			email: userData.email,
			fullName: userData.full_name ?? userData.fullName ?? "",
			phoneNumber: userData.phone_number ?? userData.phoneNumber ?? null,
			address: userData.address ?? null,
			profileImage:
				userData.profile_image ?? userData.profileImage ?? null,
			isStaff: userData.is_staff ?? userData.isStaff ?? false,
			isAdmin: userData.is_admin ?? userData.isAdmin ?? false,
			dateJoined: userData.date_joined ?? userData.dateJoined ?? "",
			issuesReported:
				userData.issues_reported ?? userData.issuesReported ?? 0,
			progressUpdates:
				userData.progress_updates ?? userData.progressUpdates ?? 0,
			issues: (userData.issues ?? []).map((issue: any) => ({
				id: issue.id,
				title: issue.title,
				location: issue.location,
				status: issue.status,
				created_at: issue.created_at,
				category: issue.category,
			})),
		});
	}

	/**
	 * Convert to JSON for API requests
	 */
	toJson(): Record<string, any> {
		return {
			id: this.id,
			email: this.email,
			full_name: this.fullName,
			phone_number: this.phoneNumber,
			address: this.address,
			profile_image: this.profileImage,
			is_staff: this.isStaff,
			is_admin: this.isAdmin,
			date_joined: this.dateJoined,
			issues_reported: this.issuesReported,
			progress_updates: this.progressUpdates,
			issues: this.issues,
		};
	}

	/**
	 * Convert to UserInfo (for compatibility)
	 */
	toUserInfo(): UserInfo {
		return new UserInfo({
			id: this.id,
			email: this.email,
			fullName: this.fullName,
			phoneNumber: this.phoneNumber,
			address: this.address,
			profileImage: this.profileImage,
			isStaff: this.isStaff,
			isAdmin: this.isAdmin,
		});
	}

	/**
	 * Get display name (full name or email)
	 */
	get displayName(): string {
		return this.fullName || this.email;
	}

	/**
	 * Get formatted date joined
	 */
	get formattedDateJoined(): string {
		if (!this.dateJoined) return "";
		try {
			return new Date(this.dateJoined).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		} catch {
			return this.dateJoined;
		}
	}

	/**
	 * Get issues count by status
	 */
	getIssueCountByStatus(status: string): number {
		return this.issues.filter((issue) => issue.status === status).length;
	}

	/**
	 * Get resolved issues count
	 */
	get resolvedIssuesCount(): number {
		return this.getIssueCountByStatus("resolved");
	}

	/**
	 * Get open issues count
	 */
	get openIssuesCount(): number {
		return this.getIssueCountByStatus("open");
	}

	/**
	 * Get in progress issues count
	 */
	get inProgressIssuesCount(): number {
		return this.getIssueCountByStatus("in_progress");
	}
}

/**
 * Data for updating profile
 */
export interface UpdateProfileData {
	full_name?: string;
	phone_number?: string;
	address?: string;
}
