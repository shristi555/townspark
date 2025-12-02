/**
 * Client-side token storage service
 * Uses localStorage for client-side token access
 * Works alongside the server-side cookie storage for secure HTTP-only cookies
 */

const ACCESS_TOKEN_KEY = "townspark_access_token";
const REFRESH_TOKEN_KEY = "townspark_refresh_token";
const USER_INFO_KEY = "townspark_user_info";

class ClientTokenStorage {
	private static isClient(): boolean {
		return typeof window !== "undefined";
	}

	static getAccessToken(): string | null {
		if (!this.isClient()) return null;
		return localStorage.getItem(ACCESS_TOKEN_KEY);
	}

	static setAccessToken(token: string): void {
		if (!this.isClient()) return;
		localStorage.setItem(ACCESS_TOKEN_KEY, token);
	}

	static getRefreshToken(): string | null {
		if (!this.isClient()) return null;
		return localStorage.getItem(REFRESH_TOKEN_KEY);
	}

	static setRefreshToken(token: string): void {
		if (!this.isClient()) return;
		localStorage.setItem(REFRESH_TOKEN_KEY, token);
	}

	static saveTokens(accessToken: string, refreshToken: string): void {
		this.setAccessToken(accessToken);
		this.setRefreshToken(refreshToken);
	}

	static clearTokens(): void {
		if (!this.isClient()) return;
		localStorage.removeItem(ACCESS_TOKEN_KEY);
		localStorage.removeItem(REFRESH_TOKEN_KEY);
	}

	static hasTokens(): boolean {
		return (
			this.getAccessToken() !== null && this.getRefreshToken() !== null
		);
	}

	static hasAccessToken(): boolean {
		return this.getAccessToken() !== null;
	}

	// User info cache methods
	static getUserInfo<T = Record<string, any>>(): T | null {
		if (!this.isClient()) return null;
		const data = localStorage.getItem(USER_INFO_KEY);
		if (!data) return null;
		try {
			return JSON.parse(data) as T;
		} catch {
			return null;
		}
	}

	static setUserInfo(userInfo: Record<string, any>): void {
		if (!this.isClient()) return;
		localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
	}

	static clearUserInfo(): void {
		if (!this.isClient()) return;
		localStorage.removeItem(USER_INFO_KEY);
	}

	static clearAll(): void {
		this.clearTokens();
		this.clearUserInfo();
	}
}

export { ClientTokenStorage };
export default ClientTokenStorage;
