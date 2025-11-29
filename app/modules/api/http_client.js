/**
 * HTTP Client - Core API communication layer
 * Handles all HTTP requests with authentication, error handling, and response parsing
 */

import { API_CONFIG } from "./config";

// Token storage keys
const ACCESS_TOKEN_KEY = "townspark_access_token";
const REFRESH_TOKEN_KEY = "townspark_refresh_token";

/**
 * Standardized API Response
 */
export class ApiResponse {
	constructor({
		success,
		data = null,
		error = null,
		statusCode = null,
		message = null,
	}) {
		this.success = success;
		this.data = data;
		this.error = error;
		this.statusCode = statusCode;
		this.message = message;
	}

	static success(data, message = "Success", statusCode = 200) {
		return new ApiResponse({
			success: true,
			data,
			message,
			statusCode,
		});
	}

	static failure(error, message = "Request failed", statusCode = 0) {
		return new ApiResponse({
			success: false,
			error,
			message,
			statusCode,
		});
	}
}

/**
 * Token Management
 */
export const TokenManager = {
	getAccessToken: () => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem(ACCESS_TOKEN_KEY);
	},

	getRefreshToken: () => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem(REFRESH_TOKEN_KEY);
	},

	setTokens: (accessToken, refreshToken = null) => {
		if (typeof window === "undefined") return;
		if (accessToken) {
			localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
		}
		if (refreshToken) {
			localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
		}
	},

	clearTokens: () => {
		if (typeof window === "undefined") return;
		localStorage.removeItem(ACCESS_TOKEN_KEY);
		localStorage.removeItem(REFRESH_TOKEN_KEY);
	},

	hasValidToken: () => {
		return !!TokenManager.getAccessToken();
	},
};

/**
 * HTTP Client
 */
class HttpClient {
	constructor() {
		this.baseUrl = API_CONFIG.baseUrl;
		this.timeout = API_CONFIG.timeout;
		this.isRefreshing = false;
		this.refreshSubscribers = [];
	}

	/**
	 * Subscribe to token refresh
	 */
	subscribeTokenRefresh(callback) {
		this.refreshSubscribers.push(callback);
	}

	/**
	 * Notify all subscribers that token is refreshed
	 */
	onTokenRefreshed(token) {
		this.refreshSubscribers.forEach((callback) => callback(token));
		this.refreshSubscribers = [];
	}

	/**
	 * Build full URL
	 */
	buildUrl(endpoint, params = null) {
		let url = endpoint.startsWith("http")
			? endpoint
			: `${this.baseUrl}${endpoint}`;

		if (params) {
			const searchParams = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				if (value !== null && value !== undefined) {
					if (Array.isArray(value)) {
						searchParams.append(key, value.join(","));
					} else {
						searchParams.append(key, String(value));
					}
				}
			});
			const queryString = searchParams.toString();
			if (queryString) {
				url += `?${queryString}`;
			}
		}

		return url;
	}

	/**
	 * Build headers
	 */
	buildHeaders(auth = false, isMultipart = false) {
		const headers = {
			Accept: "application/json",
		};

		if (!isMultipart) {
			headers["Content-Type"] = "application/json";
		}

		if (auth) {
			const token = TokenManager.getAccessToken();
			if (token) {
				headers["Authorization"] = `Bearer ${token}`;
			}
		}

		return headers;
	}

	/**
	 * Refresh access token
	 */
	async refreshAccessToken() {
		const refreshToken = TokenManager.getRefreshToken();
		if (!refreshToken) {
			throw new Error("No refresh token available");
		}

		const response = await fetch(`${this.baseUrl}/auth/token/refresh/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ refresh: refreshToken }),
		});

		if (!response.ok) {
			TokenManager.clearTokens();
			throw new Error("Token refresh failed");
		}

		const data = await response.json();
		TokenManager.setTokens(data.access);
		return data.access;
	}

	/**
	 * Handle 401 response and attempt token refresh
	 */
	async handle401(originalRequest) {
		if (this.isRefreshing) {
			// Wait for token refresh
			return new Promise((resolve) => {
				this.subscribeTokenRefresh((token) => {
					originalRequest.headers["Authorization"] =
						`Bearer ${token}`;
					resolve(this.executeRequest(originalRequest));
				});
			});
		}

		this.isRefreshing = true;

		try {
			const newToken = await this.refreshAccessToken();
			this.isRefreshing = false;
			this.onTokenRefreshed(newToken);

			originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
			return this.executeRequest(originalRequest);
		} catch (error) {
			this.isRefreshing = false;
			TokenManager.clearTokens();

			// Redirect to login if in browser
			if (typeof window !== "undefined") {
				window.location.href = "/login";
			}

			return ApiResponse.failure(
				{ code: "TOKEN_EXPIRED", message: "Session expired" },
				"Session expired. Please login again.",
				401
			);
		}
	}

	/**
	 * Execute the actual request
	 */
	async executeRequest(requestConfig) {
		const { method, url, headers, body } = requestConfig;

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const fetchOptions = {
				method,
				headers,
				signal: controller.signal,
			};

			if (body && method !== "GET") {
				fetchOptions.body = body;
			}

			const response = await fetch(url, fetchOptions);
			clearTimeout(timeoutId);

			return this.parseResponse(response, requestConfig);
		} catch (error) {
			clearTimeout(timeoutId);
			return this.handleError(error);
		}
	}

	/**
	 * Parse response
	 */
	async parseResponse(response, requestConfig) {
		let data = null;
		const contentType = response.headers.get("content-type");

		try {
			if (contentType && contentType.includes("application/json")) {
				data = await response.json();
			} else {
				const text = await response.text();
				data = text ? { message: text } : null;
			}
		} catch (e) {
			data = null;
		}

		// Handle 401 - attempt token refresh
		if (response.status === 401 && requestConfig.auth) {
			return this.handle401(requestConfig);
		}

		if (!response.ok) {
			return ApiResponse.failure(
				data?.error || data,
				data?.error?.message ||
					data?.message ||
					data?.detail ||
					"Request failed",
				response.status
			);
		}

		// Extract data from standardized response format
		const responseData = data?.data !== undefined ? data.data : data;
		const message = data?.message || "Success";

		return ApiResponse.success(responseData, message, response.status);
	}

	/**
	 * Handle errors
	 */
	handleError(error) {
		let message = "An unexpected error occurred";
		let errorCode = "UNKNOWN_ERROR";

		if (error.name === "AbortError") {
			message = "Request timed out";
			errorCode = "TIMEOUT";
		} else if (
			error instanceof TypeError &&
			error.message.includes("fetch")
		) {
			message = "Network error. Please check your connection.";
			errorCode = "NETWORK_ERROR";
		} else {
			message = error.message || message;
		}

		return ApiResponse.failure(
			{ code: errorCode, message: error.message },
			message,
			0
		);
	}

	/**
	 * Main request method
	 */
	async request(method, endpoint, options = {}) {
		const {
			data = null,
			params = null,
			auth = false,
			files = null,
		} = options;

		const hasFiles = files && Object.keys(files).length > 0;
		const url = this.buildUrl(endpoint, params);
		const headers = this.buildHeaders(auth, hasFiles);

		let body = null;

		if (data || files) {
			if (hasFiles) {
				// Use FormData for file uploads
				const formData = new FormData();

				if (data) {
					Object.entries(data).forEach(([key, value]) => {
						if (value !== null && value !== undefined) {
							formData.append(key, value);
						}
					});
				}

				if (files) {
					Object.entries(files).forEach(([key, value]) => {
						if (Array.isArray(value)) {
							value.forEach((file) => {
								formData.append(key, file);
							});
						} else if (value) {
							formData.append(key, value);
						}
					});
				}

				body = formData;
				// Remove Content-Type to let browser set it with boundary
				delete headers["Content-Type"];
			} else if (method !== "GET") {
				body = JSON.stringify(data);
			}
		}

		const requestConfig = {
			method,
			url,
			headers,
			body,
			auth,
		};

		return this.executeRequest(requestConfig);
	}

	// Convenience methods
	async get(endpoint, options = {}) {
		return this.request("GET", endpoint, options);
	}

	async post(endpoint, data = null, options = {}) {
		return this.request("POST", endpoint, { ...options, data });
	}

	async put(endpoint, data = null, options = {}) {
		return this.request("PUT", endpoint, { ...options, data });
	}

	async patch(endpoint, data = null, options = {}) {
		return this.request("PATCH", endpoint, { ...options, data });
	}

	async delete(endpoint, options = {}) {
		return this.request("DELETE", endpoint, options);
	}
}

// Export singleton instance
export const httpClient = new HttpClient();
export default httpClient;
