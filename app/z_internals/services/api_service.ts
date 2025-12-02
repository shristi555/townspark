// Creates a instance of axios and sets up interceptors
import BackendResponse from "@/app/services/backend_response";

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class ApiService {
	private axiosInstance: AxiosInstance;
	private static instance: ApiService;

	// Singleton pattern to ensure a single instance
	static getInstance(): ApiService {
		if (!ApiService.instance) {
			ApiService.instance = new ApiService();
		}
		return ApiService.instance;
	}

	constructor() {
		this.axiosInstance = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
			timeout: 10000,
			headers: {
				"Content-Type": "application/json",
			},
			validateStatus: () => true, // Let backend handle status validation
		});
	}

	get apiAccessToken(): string | null {
		try {
			// Replace with your auth token retrieval logic
			return localStorage.getItem("access_token");
		} catch {
			return null;
		}
	}

	async sendGetRequest(
		endpoint: string,
		params?: Record<string, any>,
		auth: boolean = false
	): Promise<BackendResponse> {
		return this.sendRequest("GET", endpoint, { params, auth });
	}

	async sendPostRequest(
		endpoint: string,
		data?: Record<string, any>,
		auth: boolean = false,
		files?: Record<string, File | string>
	): Promise<BackendResponse> {
		return this.sendRequest("POST", endpoint, { data, auth, files });
	}

	async sendPutRequest(
		endpoint: string,
		data?: Record<string, any>,
		auth: boolean = false,
		files?: Record<string, File | string>
	): Promise<BackendResponse> {
		return this.sendRequest("PUT", endpoint, { data, auth, files });
	}

	async sendDeleteRequest(
		endpoint: string,
		data?: Record<string, any>,
		auth: boolean = false
	): Promise<BackendResponse> {
		return this.sendRequest("DELETE", endpoint, { data, auth });
	}

	async sendPatchRequest(
		endpoint: string,
		data?: Record<string, any>,
		auth: boolean = false,
		files?: Record<string, File | string>
	): Promise<BackendResponse> {
		return this.sendRequest("PATCH", endpoint, { data, auth, files });
	}

	async sendRequest(
		method: string,
		endpoint: string,
		options: {
			data?: Record<string, any>;
			params?: Record<string, any>;
			auth?: boolean;
			files?: Record<string, File | string>;
		} = {}
	): Promise<BackendResponse> {
		const { data, params, auth = false, files } = options;

		try {
			const headers: Record<string, string> = {};

			if (auth && this.apiAccessToken) {
				headers["Authorization"] = `Bearer ${this.apiAccessToken}`;
			}

			const hasFiles = files && Object.keys(files).length > 0;
			let requestData: any;

			if (hasFiles) {
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

			const config: AxiosRequestConfig = {
				method: method.toUpperCase(),
				url: endpoint,
				headers,
				...(method.toUpperCase() === "GET"
					? { params: params || data }
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
