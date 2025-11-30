/**
 * Modules Index
 * Central export point for all service modules
 *
 * Backend API Structure:
 * - /auth/ - Authentication (signup, login, token refresh/verify, user profile)
 * - /issues/ - Issue management (CRUD operations)
 * - /comments/ - Comment management
 * - /progress/ - Progress tracking (Staff only)
 *
 * User Roles:
 * - Admin (is_admin=true) - Full system access
 * - Staff (is_staff=true) - Manage issues and progress
 * - Regular User - Create issues and comments
 */

// API Layer
export { API_CONFIG, API_ROUTES } from "./api/config";
export {
	default as httpClient,
	ApiResponse,
	TokenManager,
} from "./api/http_client";

// Auth Service
export { AuthService } from "./auth";

// Domain Services
export { UserService } from "./users";
export { IssueService } from "./issues";
export { CommentService } from "./comments";
export { ProgressService } from "./progress";

// Deprecated services (stubbed, for backward compatibility)
export { AdminService } from "./admin";
export { ResolverService } from "./resolver";
export { NotificationService } from "./notifications";
export { CoreService, AnalyticsService } from "./core";

// Models (still usable for data transformation)
export * from "./models";
