import ApiService from "../api_service";

class AuthService extends ApiService {
	public static instance: AuthService;
	static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}
		return AuthService.instance;
	}

	private constructor() {
		super();
	}

	async login(email: string, password: string) {
		return this.sendPostRequest("/auth/login", {
			data: { email, password },
			auth: false,
		});
	}

	async register(data: RegisterModel) {
		const endpoint = "/auth/register";
		const headers: Record<string, string> = {
			"Content-Type": data.appropriateContentType,
		};
		return this.sendPostRequest(endpoint, {
			data: data.payload,
			files: data.profileImage
				? { profile_image: data.profileImage }
				: null,
		});
	}

	async logout() {
		return this.sendPostRequest("/auth/logout");
	}
}

export default AuthService;
