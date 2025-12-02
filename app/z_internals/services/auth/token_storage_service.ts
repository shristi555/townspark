import { CookieService } from "../cookie_service";

class TokenStorageService extends CookieService {
	static ACCESS_TOKEN_KEY = "townspark_access_token";
	static REFRESH_TOKEN_KEY = "townspark_refresh_token";

	static async setAccessToken(token: string, options = {}) {
		await this.set(this.ACCESS_TOKEN_KEY, token, options);
	}
	static async getAccessToken(): Promise<string | null> {
		return await this.get(this.ACCESS_TOKEN_KEY);
	}

	static async storeTokens(accessToken: string, refreshToken: string) {
		await this.setAccessToken(accessToken);
		await this.set(this.REFRESH_TOKEN_KEY, refreshToken);
	}

	static async clearTokens() {
		await this.delete(this.ACCESS_TOKEN_KEY);
		await this.delete(this.REFRESH_TOKEN_KEY);
	}

	static async getRefreshToken(): Promise<string | null> {
		return await this.get(this.REFRESH_TOKEN_KEY);
	}

	static async setRefreshToken(token: string, options = {}) {
		await this.set(this.REFRESH_TOKEN_KEY, token, options);
	}

	static async hasTokens(): Promise<boolean> {
		const accessToken = await this.getAccessToken();
		const refreshToken = await this.getRefreshToken();
		return accessToken !== null && refreshToken !== null;
	}

	static async hasAccessToken(): Promise<boolean> {
		const accessToken = await this.getAccessToken();
		return accessToken !== null;
	}

	static async hasRefreshToken(): Promise<boolean> {
		const refreshToken = await this.getRefreshToken();
		return refreshToken !== null;
	}

	static async deleteAccessToken() {
		await this.delete(this.ACCESS_TOKEN_KEY);
	}
}
