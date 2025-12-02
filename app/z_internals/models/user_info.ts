import { BackendResponse } from "../services/backend_response";

/**
 * User information model
 * Represents the authenticated user's profile data
 *
 * Backend response format:
 * {
 *   "id": 1,
 *   "email": "user@test.com",
 *   "full_name": "Test User",
 *   "phone_number": "1234567890",
 *   "address": "123 Test St",
 *   "profile_image": null, // absolute URL or null
 *   "is_staff": false,
 *   "is_admin": false
 * }
 */
export interface IUserInfo {
	id: number;
	email: string;
	fullName: string;
	phoneNumber: string | null;
	address: string | null;
	profileImage: string | null;
	isStaff: boolean;
	isAdmin: boolean;
}

export class UserInfo implements IUserInfo {
	id: number;
	email: string;
	fullName: string;
	phoneNumber: string | null;
	address: string | null;
	profileImage: string | null;
	isStaff: boolean;
	isAdmin: boolean;

	constructor(data: IUserInfo) {
		this.id = data.id;
		this.email = data.email;
		this.fullName = data.fullName;
		this.phoneNumber = data.phoneNumber ?? null;
		this.address = data.address ?? null;
		this.profileImage = data.profileImage ?? null;
		this.isStaff = data.isStaff ?? false;
		this.isAdmin = data.isAdmin ?? false;
	}

	static fromJson(json: Record<string, any>): UserInfo {
		return new UserInfo({
			id: json.id,
			email: json.email,
			fullName: json.full_name ?? json.fullName ?? "",
			phoneNumber: json.phone_number ?? json.phoneNumber ?? null,
			address: json.address ?? null,
			profileImage: json.profile_image ?? json.profileImage ?? null,
			isStaff: json.is_staff ?? json.isStaff ?? false,
			isAdmin: json.is_admin ?? json.isAdmin ?? false,
		});
	}

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
		};
	}

	static fromBackendResponse(resp: BackendResponse): UserInfo | null {
		if (!resp.success || !resp.response) {
			return null;
		}

		const axiosResp = resp.axiosResponse;

		// get the endpoint where the data was sent to,

		const reqUrl = axiosResp.request?.responseURL || "";

		// if the url is the login endpoint then the direct conversion is not possible
		if (reqUrl.includes("/api/auth/login")) {
			const userJson = resp.response.user;
			return UserInfo.fromJson(userJson);
		}

		return UserInfo.fromJson(resp.response);
	}

	get displayName(): string {
		return this.fullName || this.email;
	}

	get initials(): string {
		const parts = this.fullName.split(" ");
		if (parts.length >= 2) {
			return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
		}
		return this.fullName.substring(0, 2).toUpperCase();
	}

	get hasProfileImage(): boolean {
		return this.profileImage !== null && this.profileImage.length > 0;
	}

	get role(): string {
		if (this.isAdmin) return "admin";
		if (this.isStaff) return "staff";
		return "user";
	}
}

export default UserInfo;
