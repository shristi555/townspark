import ApiService from "../api_service";
import { BackendResponse } from "../backend_response";

/**
 * Issue Service - Handles all issue-related API calls
 *
 * API Endpoints (from issue_backend_guide.md):
 * - POST   /api/v1/issues/new/               - Create a new issue
 * - GET    /api/v1/issues/list/              - List all issues
 * - GET    /api/v1/issues/info/<issue_id>/   - Get specific issue details
 * - GET    /api/v1/issues/user/<user_id>/    - Get user's reported issues
 * - GET    /api/v1/issues/my/                - Get authenticated user's issues
 * - PATCH  /api/v1/issues/update/<issue_id>/ - Update issue status
 * - DELETE /api/v1/issues/delete/<issue_id>/ - Delete an issue
 */
class IssueService extends ApiService {
	private static _instance: IssueService;

	static getInstance(): IssueService {
		if (!IssueService._instance) {
			IssueService._instance = new IssueService();
		}
		return IssueService._instance;
	}

	private constructor() {
		super();
	}

	// ============ Issue Endpoints ============

	/**
	 * List all issues
	 * GET /api/v1/issues/list/
	 */
	async fetchIssues(): Promise<BackendResponse> {
		return this.sendGetRequest("/api/v1/issues/list/", {
			auth: true,
		});
	}

	/**
	 * Get specific issue details
	 * GET /api/v1/issues/info/<issue_id>/
	 */
	async fetchIssueDetails(issueId: number): Promise<BackendResponse> {
		return this.sendGetRequest(`/api/v1/issues/info/${issueId}/`, {
			auth: true,
		});
	}

	/**
	 * Get authenticated user's issues
	 * GET /api/v1/issues/my/
	 */
	async fetchMyIssues(): Promise<BackendResponse> {
		return this.sendGetRequest("/api/v1/issues/my/", {
			auth: true,
		});
	}

	/**
	 * Get a specific user's reported issues
	 * GET /api/v1/issues/user/<user_id>/
	 */
	async fetchUserIssues(userId: number): Promise<BackendResponse> {
		return this.sendGetRequest(`/api/v1/issues/user/${userId}/`, {
			auth: true,
		});
	}

	/**
	 * Create a new issue
	 * POST /api/v1/issues/new/
	 *
	 * @param data - Issue data: { title, description, location, category }
	 * @param files - Optional image files
	 */
	async createIssue(
		data: {
			title: string;
			description: string;
			location: string;
			category: number;
		},
		files?: Record<string, File> | null
	): Promise<BackendResponse> {
		return this.sendPostRequest("/api/v1/issues/new/", {
			data: data,
			files: files ?? null,
			auth: true,
		});
	}

	/**
	 * Update issue (status update)
	 * PATCH /api/v1/issues/update/<issue_id>/
	 *
	 * @param issueId - ID of the issue to update
	 * @param data - Update data: { status: 'open' | 'in_progress' | 'resolved' | 'closed' }
	 */
	async updateIssue(
		issueId: number,
		data: { status?: string; [key: string]: any }
	): Promise<BackendResponse> {
		return this.sendPatchRequest(`/api/v1/issues/update/${issueId}/`, {
			data: data,
			auth: true,
		});
	}

	/**
	 * Delete an issue
	 * DELETE /api/v1/issues/delete/<issue_id>/
	 */
	async deleteIssue(issueId: number): Promise<BackendResponse> {
		return this.sendDeleteRequest(`/api/v1/issues/delete/${issueId}/`, {
			auth: true,
		});
	}

	// ============ Category Endpoints ============

	/**
	 * List all categories
	 * GET /api/v1/categories/list/
	 */
	async fetchCategories(): Promise<BackendResponse> {
		return this.sendGetRequest("/api/v1/categories/list/", {
			auth: false,
		});
	}

	/**
	 * Create a new category (Admin only)
	 * POST /api/v1/categories/new/
	 */
	async createCategory(data: {
		name: string;
		description: string;
	}): Promise<BackendResponse> {
		return this.sendPostRequest("/api/v1/categories/new/", {
			data: data,
			auth: true,
		});
	}

	// ============ Progress Endpoints ============

	/**
	 * Get issue progress updates
	 * GET /api/v1/progress/issue/<issue_id>/
	 */
	async fetchIssueProgress(issueId: number): Promise<BackendResponse> {
		return this.sendGetRequest(`/api/v1/progress/issue/${issueId}/`, {
			auth: true,
		});
	}
}

export { IssueService };
export default IssueService;
