import apiRoutes from "@/app/modules/api/api_routes";

/**
 * Backend Response structure
 *
 */
export class BackendResponse {
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
		this.ok = success; // For fetch compatibility
	}

	static fromFetchResponse(response, responseData) {
		const success = response.ok;

		return new BackendResponse({
			success,
			data: success ? responseData : null,
			error: !success ? responseData : null,
			statusCode: response.status,
			message: success ? "Success" : "Request failed",
		});
	}

	static error(message, details = null) {
		return new BackendResponse({
			success: false,
			error: { message, details },
			statusCode: 0,
		});
	}

	toString() {
		return JSON.stringify(this);
	}

	get deepDetails() {
		if (!this.fetchResponse) {
			return "No response available, Probably request did not reach the server.";
		}

		const wasAuthenticated =
			this.fetchResponse?.requestHeaders?.["Authorization"] != null ||
			this.fetchResponse?.requestHeaders?.["authorization"] != null ||
			this.fetchResponse?.requestHeaders?.["AUTHORIZATION"] != null;

		let buffer = "";
		buffer += "========== Response Details: ==========\n";
		buffer += `Timestamp: ${this.timestamp || new Date().toISOString()}\n`;
		buffer += `Authenticated request: ${wasAuthenticated}\n`;
		buffer += `Token Sent: ${
			wasAuthenticated
				? this.fetchResponse?.requestHeaders?.["Authorization"] ||
					this.fetchResponse?.requestHeaders?.["authorization"] ||
					this.fetchResponse?.requestHeaders?.["AUTHORIZATION"] ||
					"N/A"
				: "N/A"
		}\n`;
		buffer += `Status Code Meaning: ${this.fetchResponse?.statusText || "Unknown"}\n`;

		buffer +=
			"----- Server sent details (details from server side) ----------\n";
		buffer += `statusCode: ${this.statusCode || "Unknown"}\n`;
		buffer += `responseData: ${JSON.stringify(this.data || this.error) || "None"}\n`;
		buffer += `responseHeaders: ${this.fetchResponse?.headers ? JSON.stringify(Object.fromEntries(this.fetchResponse.headers.entries())) : "None"}\n`;
		buffer += `responseType: ${this.fetchResponse?.type || "Unknown"}\n`;
		buffer += `contentType: ${this.fetchResponse?.headers?.get("content-type") || "Unknown"}\n`;
		buffer += `contentLength: ${this.fetchResponse?.headers?.get("content-length") || "Unknown"}\n`;
		buffer += "\n";

		// Request details section
		buffer +=
			"-------- Request details (sent data details) -------------\n";
		buffer += `url: ${this.fetchResponse?.url || "Unknown"}\n`;
		buffer += `sentData: ${this.fetchResponse?.requestBody ? JSON.stringify(this.fetchResponse.requestBody) : "None"}\n`;
		buffer += `sentHeaders: ${this.fetchResponse?.requestHeaders ? JSON.stringify(this.fetchResponse.requestHeaders) : "None"}\n`;
		buffer += `methodUsed: ${this.fetchResponse?.requestMethod || "Unknown"}\n`;
		buffer += `requestTypeUsed: ${this.fetchResponse?.requestHeaders?.["Content-Type"] || "Unknown"}\n`;
		buffer += `connectTimeout: ${ApiService.connectTimeout || "Default"}\n`;
		buffer += `receiveTimeout: ${ApiService.receiveTimeout || "Default"}\n`;
		buffer += `followRedirects: ${this.fetchResponse?.redirected || "Default"}\n`;

		return buffer;
	}

	log() {
		console.log(this.deepDetails);
	}
}

/**
 * API Service Mixin class for Next.js
 * Provides common HTTP methods and file upload support
 */
export class ApiService {
	static baseURL = apiRoutes?.baseURL;
	static connectTimeout = 10000; // 10 seconds
	static receiveTimeout = 10000; // 10 seconds

	/**
	 * Get the current access token
	 * Override this method or set it externally to provide token
	 */
	static getAccessToken() {
		if (typeof window !== "undefined") {
			return localStorage.getItem("accessToken");
		}
		return null;
	}

	/**
	 * Set access token (called by AuthController)
	 */
	static setAccessToken(token) {
		if (typeof window !== "undefined") {
			if (token) {
				localStorage.setItem("accessToken", token);
			} else {
				localStorage.removeItem("accessToken");
			}
		}
	}

	// CONVENIENCE METHODS

	static async sendGetRequest(
		endpoint,
		{ params = null, auth = false } = {}
	) {
		// Convert params to query string
		let url = endpoint;
		if (params) {
			const searchParams = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				if (value != null) {
					searchParams.append(key, value.toString());
				}
			});
			const queryString = searchParams.toString();
			if (queryString) {
				url += `?${queryString}`;
			}
		}

		return this.sendRequest("GET", url, { auth });
	}

	static async sendPostRequest(
		endpoint,
		{ data = null, auth = false, useMultipart = false, files = null } = {}
	) {
		return this.sendRequest("POST", endpoint, {
			data,
			auth,
			useMultipart,
			files,
		});
	}

	static async sendPutRequest(
		endpoint,
		{ data = null, auth = false, useMultipart = false, files = null } = {}
	) {
		return this.sendRequest("PUT", endpoint, {
			data,
			auth,
			useMultipart,
			files,
		});
	}

	static async sendDeleteRequest(
		endpoint,
		{ data = null, auth = false } = {}
	) {
		return this.sendRequest("DELETE", endpoint, { data, auth });
	}

	static async sendPatchRequest(
		endpoint,
		{ data = null, auth = false, useMultipart = false, files = null } = {}
	) {
		return this.sendRequest("PATCH", endpoint, {
			data,
			auth,
			useMultipart,
			files,
		});
	}

	static async sendUpdateRequest(
		endpoint,
		{ data = null, auth = false, useMultipart = false, files = null } = {}
	) {
		return this.sendPutRequest(endpoint, {
			data,
			auth,
			useMultipart,
			files,
		});
	}

	// CORE REQUEST METHOD

	static async sendRequest(
		method,
		endpoint,
		{ data = null, auth = false, useMultipart = true, files = null } = {}
	) {
		try {
			const url = `${this.baseURL}${endpoint}`;
			const headers = {};

			// Add authorization header if needed
			if (auth) {
				const token = this.getAccessToken();
				if (token) {
					headers["Authorization"] = `Bearer ${token}`;
				}
			}

			const hasFiles = files && Object.keys(files).length > 0;
			const forceMultipart = hasFiles; // Only use multipart if we have files

			let requestBody;

			if (forceMultipart) {
				// Use FormData for multipart requests
				const formData = new FormData();

				// Add regular fields
				if (data) {
					Object.entries(data).forEach(([key, value]) => {
						if (value != null) {
							formData.append(key, value.toString());
						}
					});
				}

				// Add files
				if (files) {
					Object.entries(files).forEach(([key, value]) => {
						if (value instanceof File) {
							formData.append(key, value);
						} else if (value instanceof Blob) {
							formData.append(key, value);
						} else if (typeof value === "string") {
							// If it's a base64 string or URL, you'd need to convert it to Blob
							// For now, we'll just append it as is
							formData.append(key, value);
						}
					});
				}

				requestBody = formData;
				// Don't set Content-Type header - let the browser set it with boundary
			} else {
				// Use JSON for regular requests
				if (data && method !== "GET") {
					headers["Content-Type"] = "application/json";
					requestBody = JSON.stringify(data);
				}
			}

			// Create abort controller for timeout
			const controller = new AbortController();
			const timeoutId = setTimeout(
				() => controller.abort(),
				this.connectTimeout
			);

			const fetchOptions = {
				method: method.toUpperCase(),
				headers,
				signal: controller.signal,
			};

			// Only add body for non-GET requests
			if (method.toUpperCase() !== "GET" && requestBody) {
				fetchOptions.body = requestBody;
			}

			const response = await fetch(url, fetchOptions);

			clearTimeout(timeoutId);

			// Parse response
			let responseData;
			const contentType = response.headers.get("content-type");

			if (contentType && contentType.includes("application/json")) {
				responseData = await response.json();
			} else {
				const text = await response.text();
				responseData = text ? { message: text } : null;
			}

			return BackendResponse.fromFetchResponse(response, responseData);
		} catch (error) {
			return this.handleException(error);
		}
	}

	// ERROR HANDLING

	/**
	 * Handle exceptions and convert to BackendResponse
	 */
	static handleException(error) {
		let message = "An unexpected error occurred";
		let details = null;

		if (error.name === "AbortError") {
			message = "Connection timed out";
			details = "Request took too long to complete";
		} else if (
			error instanceof TypeError &&
			error.message.includes("fetch")
		) {
			message = "Network error";
			details = "Unable to connect to server";
		} else {
			message = "Request failed";
			details = error.message || error.toString();
		}

		return BackendResponse.error(message, details);
	}
}

// Export default instance
export default ApiService;
