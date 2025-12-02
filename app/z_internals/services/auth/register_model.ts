type ValidationResult = {
	isValid: boolean;
	errors: Record<string, string>;
};

// defines the data model for user registration
class RegisterModel {
	fullName: string;
	email: string;
	password: string;
	confirmPassword: string | null;
	phoneNumber: string | null;
	address: string | null;
	profileImage: File | null;

	constructor(data: {
		fullName: string;
		email: string;
		password: string;
		confirmPassword: string | null;
		phoneNumber: string | null;
		address: string | null;
		profileImage: File | null;
	}) {
		this.fullName = data.fullName;
		this.email = data.email;
		this.password = data.password;
		this.confirmPassword = data.confirmPassword;
		this.phoneNumber = data.phoneNumber;
		this.address = data.address;
		this.profileImage = data.profileImage;
	}

	static fromJson(json: Record<string, any>): RegisterModel {
		return new RegisterModel({
			fullName: json.fullName,
			email: json.email,
			password: json.password,
			confirmPassword: json.confirmPassword ?? null,
			phoneNumber: json.phoneNumber ?? null,
			address: json.address ?? null,
			profileImage: json.profileImage ?? null,
		});
	}

	toJson(): Record<string, any> {
		return {
			fullName: this.fullName,
			email: this.email,
			password: this.password,
			confirmPassword: this.confirmPassword,
			phoneNumber: this.phoneNumber,
			address: this.address,
			profileImage: this.profileImage,
		};
	}

	toFormData(): FormData {
		const formData = new FormData();
		formData.append("full_name", this.fullName);
		formData.append("email", this.email);
		formData.append("password", this.password);
		formData.append("phone_number", this.phoneNumber ?? "");
		formData.append("address", this.address ?? "");
		if (this.profileImage) {
			formData.append("profile_image", this.profileImage);
		}
		return formData;
	}

	validate(): ValidationResult {
		const errors: Record<string, string> = {};
		if (!this.fullName || this.fullName.trim().length === 0) {
			errors.fullName = "Full name is required.";
		}
		if (!this.email || this.email.trim().length === 0) {
			errors.email = "Email is required.";
		}
		if (!this.password || this.password.length < 6) {
			errors.password = "Password must be at least 6 characters long.";
		}
		if (
			this.confirmPassword !== null &&
			this.password !== this.confirmPassword
		) {
			errors.confirmPassword = "Passwords do not match.";
		}

		if (this.phoneNumber !== null && this.phoneNumber.trim().length > 0) {
			const phoneRegex = /^\+?[1-9]\d{1,14}$/;
			if (!phoneRegex.test(this.phoneNumber)) {
				errors.phoneNumber = "Invalid phone number format.";
			}
		}

		if (this.address !== null && this.address.trim().length > 0) {
			const addressRegex = /^[a-zA-Z0-9\s,'-]+$/;
			if (!addressRegex.test(this.address)) {
				errors.address = "Invalid address format.";
			}
		}

		if (this.profileImage !== null) {
			const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
			if (!allowedFormats.includes(this.profileImage.type)) {
				errors.profileImage =
					"Invalid file format. Only JPEG, PNG, and WEBP images are allowed.";
			}
		}

		return {
			isValid: Object.keys(errors).length === 0,
			errors,
		};
	}

	get appropriateContentType(): string {
		return this.profileImage ? "multipart/form-data" : "application/json";
	}

	get payload(): Record<string, any> | FormData {
		return this.profileImage ? this.toFormData() : this.toJson();
	}
}
