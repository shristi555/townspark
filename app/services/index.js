/**
 * Services Index
 *
 * This module re-exports services from the modules folder.
 * The actual implementation is in app/modules/ following Service-Model-UI structure.
 *
 * Usage:
 *   import { AuthService, UserService, IssueService } from '@/app/services';
 *   // or
 *   import { cookieService } from '@/app/services';
 */

// Cookie Service (utility)
export { cookieService } from "./cookie_services";

// Re-export all from modules for convenience
export {
	// API Layer
	API_CONFIG,
	API_ROUTES,
	httpClient,
	ApiResponse,
	TokenManager,

	// Domain Services
	AuthService,
	UserService,
	IssueService,
	CommentService,
	ProgressService,
} from "../modules";
