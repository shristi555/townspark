// src/modules/auth/services/AuthService.js

import ApiService from "../api/api_service";

/*** 
 Model for Signup Data
 it uses form data to handle file uploads (like profile images)



***/
class SignupModel {
	constructor(email, password, firstName, lastName, image) {
		this.email = email;
		this.password = password;
		this.first_name = firstName;
		this.last_name = lastName;
		this.image = image;
	}

	toJSON() {
		return {
			email: this.email,
			password: this.password,
			first_name: this.first_name,
			last_name: this.last_name,
		};
	}

	static fromJSON(data) {
		return new SignupModel(
			data.email,
			data.password,
			data.first_name,
			data.last_name
		);
	}

	static fromFormData(formData) {
		return new SignupModel(
			formData.get("email"),
			formData.get("password"),
			formData.get("first_name"),
			formData.get("last_name"),
			formData.get("image")
		);
	}

	toFormData() {
		const formData = new FormData();
		formData.append("email", this.email);
		formData.append("password", this.password);
		formData.append("first_name", this.first_name);
		formData.append("last_name", this.last_name);
		if (this.image) {
			formData.append("image", this.image);
		}
		return formData;
	}
}

export class AuthService extends ApiService {
	async login(email, password) {
		const res = await super.sendPostRequest(
			`${ApiService.baseURL}/auth/jwt/create/`,
			{
				data: { email, password },
			}
		);

		if (!res.success) {
			res.log();
		}

		return res.json(); // { access, refresh }
	}

	async signup(data) {
		const res = await fetch(`${ApiService.baseURL}/auth/users/`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (!res.ok) throw new Error("Signup failed");

		return res.json();
	}

	async refreshToken(refresh) {
		const res = await fetch(`${ApiService.baseURL}/auth/jwt/refresh/`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refresh }),
		});

		if (!res.ok) throw new Error("Refresh failed");

		return res.json(); // { access }
	}

	async getUserInfo(accessToken) {
		const res = await fetch(`${ApiService.baseURL}/auth/users/me/`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		if (!res.ok) throw new Error("Failed to load user info");

		return res.json();
	}
}
