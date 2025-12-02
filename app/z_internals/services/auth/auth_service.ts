import ApiService from "../api_service";
import { BackendResponse } from "../backend_response";
import { RegisterModel } from "./register_model";

class AuthService extends ApiService {
	private static _instance: AuthService;

	static getInstance(): AuthService {
		if (!AuthService._instance) {
			AuthService._instance = new AuthService();
		}
		return AuthService._instance;
	}

	private constructor() {
		super();
	}

	// ============ Authentication Endpoints ============

	async login(
		email: string,
		password: string,
		remember: boolean = false
	): Promise<BackendResponse> {
		return this.sendPostRequest("/auth/login", {
			data: { email, password, remember },
			auth: false,
		});
	}

	async signup(data: RegisterModel): Promise<BackendResponse> {
		return this.sendPostRequest("/auth/register", {
			data: data.toJson(),
			files: data.profileImage
				? { profile_image: data.profileImage }
				: null,
			auth: false,
		});
	}

	async register(data: RegisterModel): Promise<BackendResponse> {
		return this.signup(data);
	}

	async logout(): Promise<BackendResponse> {
		return this.sendPostRequest("/auth/logout", {
			auth: true,
		});
	}

	// ============ Token Management ============

	async verifyToken(token: string): Promise<BackendResponse> {
		return this.sendPostRequest("/auth/token/verify", {
			data: { token },
			auth: false,
		});
	}

	async refreshToken(refreshToken: string): Promise<BackendResponse> {
		return this.sendPostRequest("/auth/token/refresh", {
			data: { refresh: refreshToken },
			auth: false,
		});
	}

	// ============ Profile Endpoints ============

	async getProfile(): Promise<BackendResponse> {
		return this.sendGetRequest("/auth/profile", {
			auth: true,
		});
	}

	async updateProfile(
		data: Record<string, any>,
		profileImage?: File | null
	): Promise<BackendResponse> {
		return this.sendPatchRequest("/auth/profile", {
			data,
			files: profileImage ? { profile_image: profileImage } : null,
			auth: true,
		});
	}

	async patchProfile(data: Record<string, any>): Promise<BackendResponse> {
		return this.updateProfile(data);
	}

	// ============ Password Management ============

	async changePassword(
		currentPassword: string,
		newPassword: string
	): Promise<BackendResponse> {
		return this.sendPostRequest("/auth/password/change", {
			data: {
				current_password: currentPassword,
				new_password: newPassword,
			},
			auth: true,
		});
	}

	async requestPasswordReset(email: string): Promise<BackendResponse> {
		return this.sendPostRequest("/auth/password/reset/request", {
			data: { email },
			auth: false,
		});
	}

	async resetPassword(
		token: string,
		newPassword: string
	): Promise<BackendResponse> {
		return this.sendPostRequest("/auth/password/reset/confirm", {
			data: { token, new_password: newPassword },
			auth: false,
		});
	}
}

export { AuthService };
export default AuthService;
