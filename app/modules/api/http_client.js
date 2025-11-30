/**
 * HTTP Client - Core API communication layer
 * Handles all HTTP requests with authentication, error handling, and response parsing
 */

import { API_CONFIG } from "./config";
import { cookieService } from "../../services/cookie_services";

// Token storage keys
const ACCESS_TOKEN_KEY = "townspark_access_token";
const REFRESH_TOKEN_KEY = "townspark_refresh_token";
const USER_DATA_KEY = "townspark_user_data";

// Token expiry in days
const ACCESS_TOKEN_EXPIRY_DAYS = 1;
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

/**
 * Error codes and their user-friendly messages
 */
const ERROR_MESSAGES = {
	// Network & Connection Errors
	NETWORK_ERROR: {
		user: "Unable to connect to the server. Please check your internet connection and try again.",
		dev: "Network request failed - possible causes: no internet, server down, CORS issue, or invalid URL",
	},
	TIMEOUT: {
		user: "The request took too long to complete. Please try again.",
		dev: "Request exceeded timeout limit. Consider increasing timeout or checking server performance.",
	},
	ABORTED: {
		user: "The request was cancelled. Please try again.",
		dev: "Request was aborted - either by user action or timeout",
	},

	// Authentication Errors
	UNAUTHORIZED: {
		user: "Your session has expired. Please log in again to continue.",
		dev: "401 Unauthorized - Token invalid, expired, or missing. Check auth headers.",
	},
	FORBIDDEN: {
		user: "You don't have permission to perform this action.",
		dev: "403 Forbidden - User authenticated but lacks required permissions/role.",
	},
	TOKEN_EXPIRED: {
		user: "Your session has expired. Please log in again.",
		dev: "Token refresh failed - refresh token invalid or expired. User needs to re-authenticate.",
	},
	TOKEN_REFRESH_FAILED: {
		user: "We couldn't verify your session. Please log in again.",
		dev: "Token refresh request failed. Check refresh endpoint and token validity.",
	},

	// Validation Errors
	VALIDATION_ERROR: {
		user: "Please check your input and try again.",
		dev: "400 Bad Request - Server rejected the request due to validation errors.",
	},
	INVALID_INPUT: {
		user: "Some of the information you entered is invalid. Please check and try again.",
		dev: "Input validation failed on server. Check request payload against API requirements.",
	},

	// Resource Errors
	NOT_FOUND: {
		user: "The requested item could not be found. It may have been removed or doesn't exist.",
		dev: "404 Not Found - Resource doesn't exist. Check endpoint URL and resource ID.",
	},
	CONFLICT: {
		user: "This action conflicts with existing data. The item may have been modified by someone else.",
		dev: "409 Conflict - Resource state conflict. Possible duplicate or concurrent modification.",
	},
	GONE: {
		user: "This item is no longer available.",
		dev: "410 Gone - Resource has been permanently deleted.",
	},

	// Server Errors
	SERVER_ERROR: {
		user: "Something went wrong on our end. Please try again later.",
		dev: "500 Internal Server Error - Server-side error. Check server logs for details.",
	},
	SERVICE_UNAVAILABLE: {
		user: "The service is temporarily unavailable. Please try again in a few minutes.",
		dev: "503 Service Unavailable - Server overloaded or under maintenance.",
	},
	BAD_GATEWAY: {
		user: "We're having trouble connecting to our services. Please try again.",
		dev: "502 Bad Gateway - Upstream server error. Check backend services.",
	},

	// Rate Limiting
	RATE_LIMITED: {
		user: "You've made too many requests. Please wait a moment and try again.",
		dev: "429 Too Many Requests - Rate limit exceeded. Implement request throttling.",
	},

	// Generic
	UNKNOWN_ERROR: {
		user: "An unexpected error occurred. Please try again.",
		dev: "Unknown error - No specific error code matched. Check raw error for details.",
	},
	PARSE_ERROR: {
		user: "We received an unexpected response. Please try again.",
		dev: "Failed to parse response body. Response may not be valid JSON.",
	},
};

/**
 * Get error code from HTTP status
 */
function getErrorCodeFromStatus(status) {
	const statusMap = {
		400: "VALIDATION_ERROR",
		401: "UNAUTHORIZED",
		403: "FORBIDDEN",
		404: "NOT_FOUND",
		409: "CONFLICT",
		410: "GONE",
		429: "RATE_LIMITED",
		500: "SERVER_ERROR",
		502: "BAD_GATEWAY",
		503: "SERVICE_UNAVAILABLE",
	};
	return statusMap[status] || "UNKNOWN_ERROR";
}

/**
 * Log detailed error information for developers
 */
function logError(context, errorInfo) {
	const timestamp = new Date().toISOString();
	console.group(`🔴 API Error [${timestamp}]`);
	const parts = [
		`Context: ${context}`,
		`Error Code: ${errorInfo.code}`,
		`User Message: ${errorInfo.userMessage}`,
		`Dev Message: ${errorInfo.devMessage}`,
		errorInfo.endpoint ? `Endpoint: ${errorInfo.endpoint}` : null,
		errorInfo.method ? `Method: ${errorInfo.method}` : null,
		errorInfo.status ? `Status Code: ${errorInfo.status}` : null,
		errorInfo.rawError
			? `Raw Error: ${JSON.stringify(errorInfo.rawError)}`
			: null,
		errorInfo.responseData
			? `Response Data: ${JSON.stringify(errorInfo.responseData)}`
			: null,
	].filter(Boolean);

	console.error(parts.join("\n\n"));
	console.groupEnd();
}

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
		errorCode = null,
		devMessage = null,
	}) {
		this.success = success;
		this.data = data;
		this.error = error;
		this.statusCode = statusCode;
		this.message = message;
		this.errorCode = errorCode;
		this.devMessage = devMessage;
	}

	static success(data, message = "Success", statusCode = 200) {
		return new ApiResponse({
			success: true,
			data,
			message,
			statusCode,
		});
	}

	static failure(
		error,
		message = "Request failed",
		statusCode = 0,
		errorCode = "UNKNOWN_ERROR",
		devMessage = null
	) {
		const errorInfo =
			ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.UNKNOWN_ERROR;
		return new ApiResponse({
			success: false,
			error,
			message: message || errorInfo.user,
			statusCode,
			errorCode,
			devMessage: devMessage || errorInfo.dev,
		});
	}

	/** Check if response has error */
	get hasError() {
		return !this.success || this.error != null;
	}

	/** Get user-friendly error message */
	get errorMessage() {
		if (!this.hasError) return null;

		// Try to get the most specific message
		if (typeof this.error === "string") return this.error;
		if (this.error?.message) return this.error.message;
		if (this.error?.detail) return this.error.detail;
		if (this.message) return this.message;

		// Fallback to error code message
		const errorInfo = ERROR_MESSAGES[this.errorCode];
		return errorInfo?.user || "An unexpected error occurred";
	}

	/** Get detailed error for developers */
	get developerMessage() {
		const errorInfo = ERROR_MESSAGES[this.errorCode];
		return (
			this.devMessage ||
			errorInfo?.dev ||
			"No additional error information available"
		);
	}
}

/**
 * Token Management using Cookies (SSR compatible)
 */
export const TokenManager = {
	getAccessToken: () => {
		if (typeof document === "undefined") return null;
		return cookieService.getCookie(ACCESS_TOKEN_KEY);
	},

	getRefreshToken: () => {
		if (typeof document === "undefined") return null;
		return cookieService.getCookie(REFRESH_TOKEN_KEY);
	},

	setTokens: (accessToken, refreshToken = null) => {
		if (typeof document === "undefined") return;
		if (accessToken) {
			cookieService.setCookie(
				ACCESS_TOKEN_KEY,
				accessToken,
				ACCESS_TOKEN_EXPIRY_DAYS
			);
		}
		if (refreshToken) {
			cookieService.setCookie(
				REFRESH_TOKEN_KEY,
				refreshToken,
				REFRESH_TOKEN_EXPIRY_DAYS
			);
		}
	},

	clearTokens: () => {
		if (typeof document === "undefined") return;
		cookieService.deleteCookie(ACCESS_TOKEN_KEY);
		cookieService.deleteCookie(REFRESH_TOKEN_KEY);
		cookieService.deleteCookie(USER_DATA_KEY);
	},

	hasValidToken: () => {
		return !!TokenManager.getAccessToken();
	},

	hasRefreshToken: () => {
		return !!TokenManager.getRefreshToken();
	},

	// User data storage helpers
	storeUserData: (userData) => {
		if (typeof document === "undefined" || !userData) return;
		try {
			cookieService.setCookie(
				USER_DATA_KEY,
				JSON.stringify(userData),
				REFRESH_TOKEN_EXPIRY_DAYS
			);
		} catch (e) {
			console.error("Failed to store user data:", e);
		}
	},

	getUserData: function () {
		if (typeof document === "undefined") return null;
		try {
			const data = cookieService.getCookie(USER_DATA_KEY);
			return data ? JSON.parse(data) : null;
		} catch (e) {
			return null;
		}
	},

	clearUserData: () => {
		if (typeof document === "undefined") return;
		cookieService.deleteCookie(USER_DATA_KEY);
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

		const response = await fetch(`${this.baseUrl}/auth/jwt/refresh/`, {
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
		// Backend rotates refresh tokens, so update both
		TokenManager.setTokens(data.access, data.refresh);
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

			// Log the token refresh failure
			logError("Token Refresh Failed", {
				code: "TOKEN_EXPIRED",
				userMessage: ERROR_MESSAGES.TOKEN_EXPIRED.user,
				devMessage: ERROR_MESSAGES.TOKEN_EXPIRED.dev,
				endpoint: originalRequest.url,
				method: originalRequest.method,
				rawError: error.message,
			});

			// Redirect to login if in browser
			if (typeof window !== "undefined") {
				window.location.href = "/login";
			}

			return ApiResponse.failure(
				{ code: "TOKEN_EXPIRED", message: "Session expired" },
				ERROR_MESSAGES.TOKEN_EXPIRED.user,
				401,
				"TOKEN_EXPIRED",
				ERROR_MESSAGES.TOKEN_EXPIRED.dev
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
			return this.handleError(error, requestConfig);
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
			// Log parse error for developers
			logError("Response Parse Error", {
				code: "PARSE_ERROR",
				userMessage: ERROR_MESSAGES.PARSE_ERROR.user,
				devMessage: ERROR_MESSAGES.PARSE_ERROR.dev,
				endpoint: requestConfig.url,
				method: requestConfig.method,
				status: response.status,
				rawError: e.message,
			});
			data = null;
		}

		// Handle 401 - attempt token refresh
		if (response.status === 401 && requestConfig.auth) {
			return this.handle401(requestConfig);
		}

		if (!response.ok) {
			const errorCode = getErrorCodeFromStatus(response.status);
			const errorInfo =
				ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.UNKNOWN_ERROR;

			// Extract the most detailed error message from response
			let serverMessage = null;
			let fieldErrors = null;

			if (data) {
				// Handle various error response formats
				if (data.errors && typeof data.errors === "object") {
					// Field-specific errors (e.g., {"email": ["This field is required"]})
					fieldErrors = data.errors;
					const firstField = Object.keys(data.errors)[0];
					const firstError = Array.isArray(data.errors[firstField])
						? data.errors[firstField][0]
						: data.errors[firstField];
					serverMessage = `${firstField}: ${firstError}`;
				} else if (data.error?.message) {
					serverMessage = data.error.message;
				} else if (data.message) {
					serverMessage = data.message;
				} else if (data.detail) {
					serverMessage = data.detail;
				} else if (typeof data.error === "string") {
					serverMessage = data.error;
				}
			}

			// Create user-friendly message
			let userMessage = serverMessage || errorInfo.user;

			// Make specific error messages more user-friendly
			if (response.status === 400 && serverMessage) {
				userMessage = `Invalid input: ${serverMessage}`;
			} else if (response.status === 404) {
				userMessage =
					"The requested resource was not found. Please check and try again.";
			} else if (response.status >= 500) {
				userMessage =
					"Our servers are experiencing issues. Please try again later.";
			}

			// Log detailed error for developers
			logError("API Request Failed", {
				code: errorCode,
				userMessage: userMessage,
				devMessage: `${errorInfo.dev} | Server response: ${JSON.stringify(data)}`,
				endpoint: requestConfig.url,
				method: requestConfig.method,
				status: response.status,
				responseData: data,
				fieldErrors: fieldErrors,
			});

			return ApiResponse.failure(
				{
					...data,
					code: errorCode,
					fieldErrors: fieldErrors,
				},
				userMessage,
				response.status,
				errorCode,
				`${errorInfo.dev} | Status: ${response.status} | Response: ${JSON.stringify(data)}`
			);
		}

		// Extract data from standardized response format
		const responseData = data?.data !== undefined ? data.data : data;
		const message = data?.message || "Success";

		return ApiResponse.success(responseData, message, response.status);
	}

	/**
	 * Handle errors with detailed logging
	 */
	handleError(error, requestConfig = {}) {
		let errorCode = "UNKNOWN_ERROR";
		let userMessage = ERROR_MESSAGES.UNKNOWN_ERROR.user;
		let devMessage = ERROR_MESSAGES.UNKNOWN_ERROR.dev;

		if (error.name === "AbortError") {
			errorCode = "TIMEOUT";
			userMessage = ERROR_MESSAGES.TIMEOUT.user;
			devMessage = ERROR_MESSAGES.TIMEOUT.dev;
		} else if (
			error instanceof TypeError &&
			error.message.includes("fetch")
		) {
			errorCode = "NETWORK_ERROR";
			userMessage = ERROR_MESSAGES.NETWORK_ERROR.user;
			devMessage = ERROR_MESSAGES.NETWORK_ERROR.dev;
		} else if (error.message?.includes("NetworkError")) {
			errorCode = "NETWORK_ERROR";
			userMessage = ERROR_MESSAGES.NETWORK_ERROR.user;
			devMessage = ERROR_MESSAGES.NETWORK_ERROR.dev;
		} else if (error.message) {
			// Use the error message but make it user-friendly
			devMessage = `${ERROR_MESSAGES.UNKNOWN_ERROR.dev} | Original: ${error.message}`;
		}

		// Log detailed error for developers
		logError("Request Error", {
			code: errorCode,
			userMessage: userMessage,
			devMessage: devMessage,
			endpoint: requestConfig.url,
			method: requestConfig.method,
			rawError: {
				name: error.name,
				message: error.message,
				stack: error.stack,
			},
		});

		return ApiResponse.failure(
			{
				code: errorCode,
				message: error.message,
				originalError: error.name,
			},
			userMessage,
			0,
			errorCode,
			devMessage
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
