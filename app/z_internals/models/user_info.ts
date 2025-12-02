/**
 * User information model
 * Represents the authenticated user's profile data
 */
export interface IUserInfo {
	id: string | number;
	email: string;
	fullName: string;
	phoneNumber?: string | null;
	address?: string | null;
	profileImage?: string | null;
	role?: string;
	createdAt?: string;
	updatedAt?: string;
}

export class UserInfo implements IUserInfo {
	id: string | number;
	email: string;
	fullName: string;
	phoneNumber: string | null;
	address: string | null;
	profileImage: string | null;
	role: string;
	createdAt?: string;
	updatedAt?: string;

	constructor(data: IUserInfo) {
		this.id = data.id;
		this.email = data.email;
		this.fullName = data.fullName;
		this.phoneNumber = data.phoneNumber ?? null;
		this.address = data.address ?? null;
		this.profileImage = data.profileImage ?? null;
		this.role = data.role ?? "user";
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
	}

	static fromJson(json: Record<string, any>): UserInfo {
		return new UserInfo({
			id: json.id,
			email: json.email,
			fullName: json.full_name ?? json.fullName ?? "",
			phoneNumber: json.phone_number ?? json.phoneNumber ?? null,
			address: json.address ?? null,
			profileImage: json.profile_image ?? json.profileImage ?? null,
			role: json.role ?? "user",
			createdAt: json.created_at ?? json.createdAt,
			updatedAt: json.updated_at ?? json.updatedAt,
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
			role: this.role,
			created_at: this.createdAt,
			updated_at: this.updatedAt,
		};
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
}

export default UserInfo;
