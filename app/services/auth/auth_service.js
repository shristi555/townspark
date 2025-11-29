import { cookieService } from "../cookie_services";
import ApiService from "../api_service";
import BackendResponse from "../backend_response";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Token Storage using cookies for SSR compatibility
class TokenStorage {
	static ACCESS_TOKEN_KEY = "nepwork_access_token";
	static REFRESH_TOKEN_KEY = "nepwork_refresh_token";
	static USER_KEY = "nepwork_user";

	static getTokens() {
		return {
			access: cookieService.getCookie(this.ACCESS_TOKEN_KEY),
			refresh: cookieService.getCookie(this.REFRESH_TOKEN_KEY),
		};
	}

	static setTokens(access, refresh) {
		if (access) {
			cookieService.setCookie(this.ACCESS_TOKEN_KEY, access, 1); // 1 day for access
		}
		if (refresh) {
			cookieService.setCookie(this.REFRESH_TOKEN_KEY, refresh, 7); // 7 days for refresh
		}
	}

	static getAccessToken() {
		return cookieService.getCookie(this.ACCESS_TOKEN_KEY);
	}

	static getRefreshToken() {
		return cookieService.getCookie(this.REFRESH_TOKEN_KEY);
	}

	static clearTokens() {
		cookieService.deleteCookie(this.ACCESS_TOKEN_KEY);
		cookieService.deleteCookie(this.REFRESH_TOKEN_KEY);
	}

	static hasTokens() {
		return (
			cookieService.containsCookie(this.ACCESS_TOKEN_KEY) &&
			cookieService.containsCookie(this.REFRESH_TOKEN_KEY)
		);
	}

	static hasAccessToken() {
		return cookieService.containsCookie(this.ACCESS_TOKEN_KEY);
	}

	static hasRefreshToken() {
		return cookieService.containsCookie(this.REFRESH_TOKEN_KEY);
	}

	// User storage in localStorage
	static getStoredUser() {
		if (typeof window === "undefined") return null;
		try {
			const data = localStorage.getItem(this.USER_KEY);
			return data ? JSON.parse(data) : null;
		} catch {
			return null;
		}
	}

	static storeUser(user) {
		if (typeof window !== "undefined" && user) {
			localStorage.setItem(this.USER_KEY, JSON.stringify(user));
		}
	}

	static clearUser() {
		if (typeof window !== "undefined") {
			localStorage.removeItem(this.USER_KEY);
		}
	}
}

class AuthService {
	static instance = null;

	constructor() {
		this.apiService = ApiService.init();
	}

	static init() {
		if (AuthService.instance == null) {
			AuthService.instance = new AuthService();
		}
		return AuthService.instance;
	}

	/**
	 * Get the current access token for authenticated requests
	 * @returns {string|null}
	 */
	getApiAccessToken() {
		return TokenStorage.getAccessToken();
	}

	/**
	 * Login with email and password
	 * @param {string} email
	 * @param {string} password
	 * @returns {Promise<BackendResponse>}
	 */
	async login(email, password) {
		const response = await this.apiService.sendPostRequest(
			"/auth/jwt/create/",
			{
				data: { email, password },
			}
		);

		if (response.success && response.response) {
			const { access, refresh } = response.response;
			TokenStorage.setTokens(access, refresh);
		}

		return response;
	}

	/**
	 * Register a new user
	 * @param {Object} userDetails - { email, password, firstName, lastName, role }
	 * @returns {Promise<BackendResponse>}
	 */
	async signup(userDetails) {
		const validation = this.validateUserDetails(userDetails);
		if (!validation.valid) {
			return new BackendResponse({
				success: false,
				error: {
					message: validation.message,
					details: validation.errors,
				},
			});
		}

		const { email, password, firstName, lastName, role } = userDetails;

		const response = await this.apiService.sendPostRequest("/auth/users/", {
			data: {
				email,
				password,
				first_name: firstName || "",
				last_name: lastName || "",
				role: role === "hire" ? "client" : "freelancer",
			},
		});

		return response;
	}

	/**
	 * Validate user details before signup
	 * @param {Object} userDetails
	 * @returns {{ valid: boolean, message?: string, errors?: string[] }}
	 */
	validateUserDetails(userDetails) {
		const errors = [];
		const { email, password, firstName, lastName } = userDetails;

		if (!email) errors.push("Email is required");
		if (!password) errors.push("Password is required");
		if (!firstName) errors.push("First name is required");
		if (!lastName) errors.push("Last name is required");

		if (password && password.length < 8) {
			errors.push("Password must be at least 8 characters");
		}

		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.push("Invalid email format");
		}

		return {
			valid: errors.length === 0,
			message: errors.length > 0 ? errors[0] : null,
			errors,
		};
	}

	/**
	 * Refresh the access token using refresh token
	 * @returns {Promise<BackendResponse>}
	 */
	async refreshToken() {
		const refresh = TokenStorage.getRefreshToken();

		if (!refresh) {
			return new BackendResponse({
				success: false,
				error: { message: "No refresh token available" },
			});
		}

		const response = await this.apiService.sendPostRequest(
			"/auth/jwt/refresh/",
			{
				data: { refresh },
			}
		);

		if (response.success && response.response?.access) {
			TokenStorage.setTokens(response.response.access, null);
		}

		return response;
	}

	/**
	 * Fetch current user profile
	 * @returns {Promise<BackendResponse>}
	 */
	async fetchCurrentUser() {
		const response = await this.apiService.sendGetRequest(
			"/api/users/me/",
			{
				auth: true,
			}
		);

		if (response.success && response.response) {
			const user = this.transformUser(response.response);
			TokenStorage.storeUser(user);
		}

		return response;
	}

	/**
	 * Update current user profile
	 * @param {Object} updates
	 * @returns {Promise<BackendResponse>}
	 */
	async updateProfile(updates) {
		const payload = {};

		if (updates.firstName !== undefined)
			payload.first_name = updates.firstName;
		if (updates.lastName !== undefined)
			payload.last_name = updates.lastName;
		if (updates.bio !== undefined) payload.bio = updates.bio;
		if (updates.location !== undefined) payload.location = updates.location;
		if (updates.title !== undefined) payload.title = updates.title;
		if (updates.skills !== undefined) payload.skills = updates.skills;
		if (updates.hourlyRate !== undefined)
			payload.hourly_rate = updates.hourlyRate;
		if (updates.avatar !== undefined) payload.avatar = updates.avatar;
		if (updates.onboardingCompleted !== undefined) {
			payload.onboarding_completed = updates.onboardingCompleted;
		}

		const response = await this.apiService.sendPatchRequest(
			"/api/users/me/",
			{
				data: payload,
				auth: true,
			}
		);

		if (response.success && response.response) {
			const user = this.transformUser(response.response);
			TokenStorage.storeUser(user);
		}

		return response;
	}

	/**
	 * Complete onboarding process
	 * @param {Object} details
	 * @returns {Promise<BackendResponse>}
	 */
	async completeOnboarding(details) {
		return this.updateProfile({
			...details,
			onboardingCompleted: true,
		});
	}

	/**
	 * Transform backend user data to frontend format
	 * @param {Object} data
	 * @returns {Object}
	 */
	transformUser(data) {
		return {
			id: data.id,
			email: data.email,
			name:
				data.full_name ||
				`${data.first_name || ""} ${data.last_name || ""}`.trim(),
			firstName: data.first_name,
			lastName: data.last_name,
			role: data.role,
			avatar: data.avatar,
			bio: data.bio,
			location: data.location,
			title: data.title,
			skills: data.skills || [],
			hourlyRate: data.hourly_rate,
			onboardingCompleted: data.onboarding_completed,
			dateJoined: data.date_joined,
			isActive: data.is_active,
		};
	}

	/**
	 * Logout user and clear all tokens
	 */
	logout() {
		TokenStorage.clearTokens();
		TokenStorage.clearUser();
	}

	/**
	 * Check if user is authenticated
	 * @returns {boolean}
	 */
	isAuthenticated() {
		return TokenStorage.hasAccessToken();
	}

	/**
	 * Get cached user from storage
	 * @returns {Object|null}
	 */
	getStoredUser() {
		return TokenStorage.getStoredUser();
	}

	/**
	 * Get access token
	 * @returns {string|null}
	 */
	getAccessToken() {
		return TokenStorage.getAccessToken();
	}

	/**
	 * Get refresh token
	 * @returns {string|null}
	 */
	getRefreshToken() {
		return TokenStorage.getRefreshToken();
	}
}

export { TokenStorage };
export default AuthService.init();
