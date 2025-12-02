// Auth Protection Components
// These components provide various ways to protect content based on authentication status

// Page-level guards (show access denied UI when unauthorized)
export { default as LoginRequired } from "./login_required";
export { AdminRequired } from "./admin_required";
export { StaffRequired } from "./staff_required";
export { RoleRequired } from "./role_required";
export { GuestOnly } from "./guest_only";

// Conditional renderers (just show/hide content, no UI)
export {
	AuthConditional,
	RoleConditional,
	ShowIfLoggedIn,
	ShowIfAdmin,
	ShowIfStaff,
	HideIfLoggedIn,
} from "./auth_conditional";

// Re-export types for convenience
export type { UserInfo, IUserInfo } from "../../models/user_info";
