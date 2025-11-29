import axios from "axios";

// Create axios instance with base config
const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
	headers: { "Content-Type": "application/json" },
});

// Token management
const TOKEN_KEY = "nepwork_token";
const REFRESH_KEY = "nepwork_refresh";

export function getToken() {
	return typeof window !== "undefined"
		? localStorage.getItem(TOKEN_KEY)
		: null;
}
export function getRefreshToken() {
	return typeof window !== "undefined"
		? localStorage.getItem(REFRESH_KEY)
		: null;
}
export function setTokens(access, refresh) {
	if (typeof window === "undefined") return;
	localStorage.setItem(TOKEN_KEY, access);
	if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
	if (typeof window === "undefined") return;
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(REFRESH_KEY);
}

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
	const token = getToken();
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

// Response interceptor - handle token refresh
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// If 401 and we haven't retried yet, try to refresh token
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			getRefreshToken()
		) {
			originalRequest._retry = true;

			try {
				const { data } = await axios.post(
					`${api.defaults.baseURL}/auth/jwt/refresh/`,
					{ refresh: getRefreshToken() }
				);
				setTokens(data.access, null);
				originalRequest.headers.Authorization = `Bearer ${data.access}`;
				return api(originalRequest);
			} catch {
				clearTokens();
				if (typeof window !== "undefined")
					window.location.href = "/login";
			}
		}

		return Promise.reject(error);
	}
);

export default api;
