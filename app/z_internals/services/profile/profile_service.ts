import ApiService from "../api_service";
import { BackendResponse } from "../backend_response";
import { Profile, UpdateProfileData } from "../../models/profile_model";

/**
 * Profile Service
 * Handles all profile-related API calls
 *
 * Endpoints:
 * - GET /accounts/profile/mine/ - Get authenticated user's profile
 * - GET /accounts/profile/<user_id>/ - Get another user's profile
 * - PUT /accounts/update-profile/ - Update authenticated user's profile
 */
export class ProfileService {
	private static instance: ProfileService;
	private api: ApiService;

	private constructor() {
		this.api = ApiService.getInstance();
	}

	/**
	 * Get singleton instance
	 */
	static getInstance(): ProfileService {
		if (!ProfileService.instance) {
			ProfileService.instance = new ProfileService();
		}
		return ProfileService.instance;
	}

	/**
	 * Fetch the authenticated user's profile with statistics
	 */
	async fetchMyProfile(): Promise<BackendResponse> {
		return this.api.sendGetRequest("/accounts/profile/mine/", {
			auth: true,
		});
	}

	/**
	 * Fetch another user's profile by ID
	 * @param userId - The ID of the user to fetch
	 */
	async fetchUserProfile(userId: number): Promise<BackendResponse> {
		return this.api.sendGetRequest(`/accounts/profile/${userId}/`, {
			auth: true,
		});
	}

	/**
	 * Update the authenticated user's profile
	 * @param data - Profile data to update (full_name, phone_number, address)
	 * @param profileImage - Optional profile image file
	 */
	async updateProfile(
		data: UpdateProfileData,
		profileImage?: File | null
	): Promise<BackendResponse> {
		const files: Record<string, File> | null = profileImage
			? { profile_image: profileImage }
			: null;

		return this.api.sendPutRequest("/accounts/update-profile/", {
			data,
			auth: true,
			files,
		});
	}

	/**
	 * Update only the profile image
	 * @param profileImage - The new profile image file
	 */
	async updateProfileImage(profileImage: File): Promise<BackendResponse> {
		return this.api.sendPutRequest("/accounts/update-profile/", {
			data: {},
			auth: true,
			files: { profile_image: profileImage },
		});
	}
}
