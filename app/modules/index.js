/**
 * Modules Index
 * Central export point for all service modules
 *
 * Structure:
 * - API Layer: Core HTTP client, config, and response handling
 * - Services: Domain-specific business logic
 * - Models: Data structures (within each service)
 */

// API Layer
export { API_CONFIG, API_ROUTES } from "./api/config";
export {
	default as httpClient,
	ApiResponse,
	TokenManager,
} from "./api/http_client";
export { BaseService, createService } from "./api/base_service";

// Models
export {
	BaseModel,
	UserModel,
	IssueModel,
	CommentModel,
	NotificationModel,
	PaginatedResult,
} from "./models";

// Auth Service
export { AuthService } from "./auth";

// Domain Services
export { UserService } from "./users";
export { IssueService } from "./issues";
export { CommentService } from "./comments";
export { NotificationService } from "./notifications";
export { ResolverService } from "./resolver";
export { AdminService } from "./admin";
export { CoreService, AnalyticsService } from "./core";
