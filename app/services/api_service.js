import axios from "axios";
import BackendResponse from "./backend_response.js";

// Define your base URL and endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	validateStatus: () => true, // Let backend handle status validation
});

class ApiService {
	// Singleton instance
	static instance = null;

	static init() {
		if (ApiService.instance == null) {
			ApiService.instance = new ApiService();
		}
		return ApiService.instance;
	}

	/**
	 * Get the API access token from cookies
	 * @returns {string|null}
	 */
	getApiAccessToken() {
		try {
			if (typeof document === "undefined") return null;

			const name = "nepwork_access_token=";
			const decodedCookie = document.cookie;
			const ca = decodedCookie.split(";");

			for (let i = 0; i < ca.length; i++) {
				let c = ca[i];
				while (c.charAt(0) === " ") c = c.substring(1);
				if (c.indexOf(name) === 0) {
					return c.substring(name.length, c.length);
				}
			}
			return null;
		} catch (e) {
			return null;
		}
	}

	/**
	 * @param {string} endpoint
	 * @param {Object} [params]
	 * @param {boolean} [auth=false]
	 * @returns {Promise<BackendResponse>}
	 */
	async sendGetRequest(endpoint, { params = null, auth = false } = {}) {
		return this.sendRequest("GET", endpoint, { data: params, auth });
	}

	/**
	 * @param {string} endpoint
	 * @param {Object} [options]
	 * @returns {Promise<BackendResponse>}
	 */
	async sendPostRequest(
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

	/**
	 * @param {string} endpoint
	 * @param {Object} [options]
	 * @returns {Promise<BackendResponse>}
	 */
	async sendPutRequest(
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

	/**
	 * @param {string} endpoint
	 * @param {Object} [options]
	 * @returns {Promise<BackendResponse>}
	 */
	async sendDeleteRequest(endpoint, { data = null, auth = false } = {}) {
		return this.sendRequest("DELETE", endpoint, { data, auth });
	}

	/**
	 * @param {string} endpoint
	 * @param {Object} [options]
	 * @returns {Promise<BackendResponse>}
	 */
	async sendPatchRequest(
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

	/**
	 * @param {string} endpoint
	 * @param {Object} [options]
	 * @returns {Promise<BackendResponse>}
	 */
	async sendUpdateRequest(
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

	/**
	 * @param {string} method
	 * @param {string} endpoint
	 * @param {Object} [options]
	 * @returns {Promise<BackendResponse>}
	 */
	async sendRequest(
		method,
		endpoint,
		{ data = null, auth = false, useMultipart = true, files = null } = {}
	) {
		try {
			const headers = {};

			if (auth && this.getApiAccessToken()) {
				headers["Authorization"] = `Bearer ${this.getApiAccessToken()}`;
			}

			const hasFiles = files != null && Object.keys(files).length > 0;
			const forceMultipart = hasFiles; // Only use multipart if we have files

			let requestData;

			if (forceMultipart) {
				const formData = new FormData();

				// Add regular fields
				if (data) {
					Object.entries(data).forEach(([key, value]) => {
						if (value != null) {
							formData.append(key, String(value));
						}
					});
				}

				// Add files
				for (const [key, value] of Object.entries(files)) {
					if (value instanceof File) {
						formData.append(key, value, value.name);
					} else if (value instanceof Blob) {
						formData.append(key, value);
					}
				}

				requestData = formData;
				// Don't set Content-Type for FormData, axios will set it automatically with boundary
			} else {
				requestData = data;
				headers["Content-Type"] = "application/json";
			}

			const config = {
				method: method.toUpperCase(),
				url: endpoint,
				headers,
			};

			// For GET requests, use params; for others, use data
			if (method.toUpperCase() === "GET") {
				config.params = requestData;
			} else {
				config.data = requestData;
			}

			const response = await axiosInstance.request(config);

			return BackendResponse.fromAxiosResponse(response);
		} catch (e) {
			return this.handleException(e);
		}
	}

	/**
	 * Internal method to handle exceptions
	 * @param {*} e
	 * @returns {BackendResponse}
	 */
	handleException(e) {
		let message = "An unexpected error occurred";
		let details = null;

		if (axios.isAxiosError(e)) {
			details = e.message;

			if (e.code === "ECONNABORTED") {
				message = "Connection timed out";
			} else if (e.code === "ERR_NETWORK") {
				message = "Network error";
			} else {
				message = "Request failed";
			}
		} else {
			details = e?.toString() ?? null;
		}

		return new BackendResponse({
			success: false,
			error: { message, details },
		});
	}
}

export default ApiService;
export { axiosInstance, API_BASE_URL };
