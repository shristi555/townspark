// Creates a instance of axios and sets up interceptors
import { ClientTokenStorage } from "./auth/client_token_storage";
import { BackendResponse } from "./backend_response";

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

/*
Each of the response is 100% guranteeed to be in a consistent format of json.

repsonse model of backend:
{
"success": boolean,
"data": any, // present if success is true
"error": any, // present if success is false
}

success is the main indicator of whether the request was successful or not.

if success is true, then data is present and error is null
if success is false, then data is null and error is present

sometimes if partial success is possible, both data and error can be present. but the success field will remain the true beacuse the main operation was successful.
*/
class ApiService {
	private axiosInstance: AxiosInstance;
	public static instance: ApiService;

	// Singleton pattern to ensure a single instance
	static getInstance(): ApiService {
		if (!ApiService.instance) {
			ApiService.instance = new ApiService();
		}
		return ApiService.instance;
	}

	constructor() {
		this.axiosInstance = axios.create({
			baseURL:
				process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
			timeout: 10000,
			headers: {
				"Content-Type": "application/json",
			},
			validateStatus: () => true, // Let backend handle status validation
		});
	}

	get apiAccessToken(): string | null {
		try {
			return ClientTokenStorage.getAccessToken();
		} catch {
			return null;
		}
	}

	async sendGetRequest(
		endpoint: string,
		options: {
			data?: Record<string, any>;
			auth?: boolean;
			headers?: Record<string, string>;
		} = {}
	): Promise<BackendResponse> {
		return this.sendRequest("GET", endpoint, options);
	}

	async sendPostRequest(
		endpoint: string,
		options: {
			data?: Record<string, any>;
			auth?: boolean;
			files?: Record<string, File> | null;
			headers?: Record<string, string>;
		} = {}
	): Promise<BackendResponse> {
		return this.sendRequest("POST", endpoint, options);
	}

	async sendPutRequest(
		endpoint: string,
		options: {
			data?: Record<string, any>;
			auth?: boolean;
			files?: Record<string, File | string>;
			headers?: Record<string, string>;
		} = {}
	): Promise<BackendResponse> {
		return this.sendRequest("PUT", endpoint, options);
	}

	async sendDeleteRequest(
		endpoint: string,
		options: {
			data?: Record<string, any>;
			auth?: boolean;
			headers?: Record<string, string>;
		} = {}
	): Promise<BackendResponse> {
		return this.sendRequest("DELETE", endpoint, options);
	}

	async sendPatchRequest(
		endpoint: string,
		options: {
			data?: Record<string, any>;
			auth?: boolean;
			files?: Record<string, File | string>;
			headers?: Record<string, string>;
		} = {}
	): Promise<BackendResponse> {
		return this.sendRequest("PATCH", endpoint, options);
	}

	async sendRequest(
		method: string,
		endpoint: string,
		options: {
			data?: Record<string, any>;
			auth?: boolean;
			files?: Record<string, File | string> | null;
			headers?: Record<string, string>;
		} = {}
	): Promise<BackendResponse> {
		const {
			data = {},
			auth = false,
			files,
			headers: customHeaders,
		} = options;

		try {
			const headers: Record<string, string> = {};

			if (auth && this.apiAccessToken) {
				headers["Authorization"] = `Bearer ${this.apiAccessToken}`;
			}

			const hasFiles = files && Object.keys(files).length > 0;
			if (method.toUpperCase() === "GET" && hasFiles) {
				return new BackendResponse({
					success: false,
					error: {
						message: "Files are not supported in GET requests",
					},
				});
			}

			let requestData: any;

			if (hasFiles) {
				const formData = new FormData();

				// Add regular fields
				Object.entries(data).forEach(([key, value]) => {
					if (value != null) {
						formData.append(key, String(value));
					}
				});

				// Add files
				for (const [key, value] of Object.entries(files!)) {
					if (value instanceof File) {
						formData.append(key, value, value.name);
					} else if (typeof value === "string") {
						// For string paths, you'd need to handle file reading differently in browser
						// This is a simplified version
						formData.append(key, value);
					}
				}

				requestData = formData;
				// Let browser set content-type with boundary for FormData
				delete headers["Content-Type"];
			} else {
				requestData = data;
				headers["Content-Type"] = "application/json";
			}

			// Merge custom headers
			if (customHeaders) {
				Object.assign(headers, customHeaders);
			}

			const config: AxiosRequestConfig = {
				method: method.toUpperCase(),
				url: endpoint,
				headers,
				...(method.toUpperCase() === "GET"
					? { params: data }
					: { data: requestData }),
			};

			const response = await this.axiosInstance.request(config);
			return BackendResponse.fromAxiosResponse(response);
		} catch (e) {
			return this.handleException(e);
		}
	}

	private handleException(e: any): BackendResponse {
		let message = "An unexpected error occurred";
		let details: string | undefined;

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
			details = String(e);
		}

		return new BackendResponse({
			success: false,
			error: { message, details },
		});
	}
}

export default ApiService;
