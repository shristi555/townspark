import axios from "axios";

class BackendResponse {
	/**
	 * @param {Object} params
	 * @param {boolean} params.success - Indicates if the request was successful
	 * @param {*} [params.response] - The actual response data from the backend
	 * @param {Object|null} [params.error] - Error details if the request failed
	 * @param {import('axios').AxiosResponse|null} [params.axiosResponse] - The axios response object
	 */
	constructor({
		success,
		response = null,
		error = null,
		axiosResponse = null,
	}) {
		this.success = success;
		this.response = response;
		this.error = error;
		this.axiosResponse = axiosResponse;
		this.timestamp = new Date();
	}

	/** Returns true if error is not null */
	get hasError() {
		return this.error != null;
	}

	/** Indicates if the error was in client side such as network error or timeout */
	get isClientError() {
		return this.axiosResponse == null && this.hasError;
	}

	get statusCode() {
		return this.axiosResponse?.status ?? -1;
	}

	get statusMessage() {
		return this.axiosResponse?.statusText ?? "Unknown";
	}

	get contentType() {
		return this.axiosResponse?.headers?.["content-type"] ?? "Unknown";
	}

	get contentLength() {
		return this.axiosResponse?.headers?.["content-length"] ?? "Unknown";
	}

	/** Returns detailed information about the response */
	get deepDetails() {
		if (this.axiosResponse == null) {
			return "No response available. Probably request did not reach the server.";
		}

		const requestHeaders = this.axiosResponse.config?.headers || {};
		const wasAuthenticated =
			requestHeaders["Authorization"] != null ||
			requestHeaders["authorization"] != null ||
			requestHeaders["AUTHORIZATION"] != null;

		const tokenSent = wasAuthenticated
			? (requestHeaders["Authorization"] ??
				requestHeaders["authorization"] ??
				requestHeaders["AUTHORIZATION"])
			: "N/A";

		const sentData = this.axiosResponse.config?.data;
		let sentDataStr;
		if (sentData instanceof FormData) {
			const fields = [];
			sentData.forEach((value, key) => fields.push(`${key}: ${value}`));
			sentDataStr = `FormData: [${fields.join(", ")}]`;
		} else {
			sentDataStr = JSON.stringify(sentData) ?? "None";
		}

		const lines = [
			"\n========== Response Details: ==========",
			`Timestamp: ${this.timestamp.toISOString()}`,
			`Authenticated request: ${wasAuthenticated}`,
			`Token Sent: ${tokenSent}`,
			`Status Code Meaning: ${this.axiosResponse.statusText ?? "Unknown"}`,
			`\n`,
			"-------- Request details (sent data details) -------------",
			`url: ${this.axiosResponse.config?.url ?? "Unknown"}`,
			`sentData: ${sentDataStr}`,
			`sentHeaders: ${JSON.stringify(requestHeaders) ?? "None"}`,
			`methodUsed: ${this.axiosResponse.config?.method?.toUpperCase() ?? "Unknown"}`,
			`requestTypeUsed: ${this.axiosResponse.config?.headers?.["Content-Type"] ?? "Unknown"}`,
			`timeout: ${this.axiosResponse.config?.timeout ?? "Default"}`,
			`maxRedirects: ${this.axiosResponse.config?.maxRedirects ?? "Default"}`,
			`\n`,
			"----- Server sent details (details from server side) ----------",
			`statusCode: ${this.axiosResponse.status ?? "Unknown"}`,
			`responseData: ${JSON.stringify(this.axiosResponse.data) ?? "None"}`,
			`responseHeaders: ${JSON.stringify(this.axiosResponse.headers) ?? "None"}`,
			`responseType: ${this.axiosResponse.config?.responseType ?? "Unknown"}`,
			`contentType: ${this.contentType}`,
			`contentLength: ${this.contentLength}`,
			"",
		];

		return lines.join("\n");
	}

	printDetails() {
		console.log(this.deepDetails);
	}

	toString() {
		return this.deepDetails();
	}

	/**
	 * Checks if data is already wrapped in the standard structure
	 * @param {*} data
	 * @returns {boolean}
	 */
	static _isAlreadyWrapped(data) {
		if (typeof data !== "object" || data === null) {
			return false;
		}
		return "success" in data && ("response" in data || "error" in data);
	}

	/**
	 * Wraps raw response data into the standard structure
	 * @param {*} data - Raw response data
	 * @param {number} statusCode - HTTP status code
	 * @returns {{ success: boolean, response: *, error: Object|null }}
	 */
	static _wrapResponseData(data, statusCode) {
		// If already wrapped, return as-is
		if (BackendResponse._isAlreadyWrapped(data)) {
			return data;
		}

		const isSuccess = statusCode >= 200 && statusCode < 300;

		if (isSuccess) {
			return {
				success: true,
				response: data ?? {},
				error: null,
			};
		}

		// Build error structure
		let message = "";
		let details = null;

		if (typeof data === "object" && data !== null) {
			message = data.detail || data.message || "An error occurred";
			details = data;
		} else {
			message = String(data);
		}

		return {
			success: false,
			response: null,
			error: { message, details },
		};
	}

	/**
	 * @param {import('axios').AxiosResponse} axiosResp
	 * @returns {BackendResponse}
	 */
	static fromAxiosResponse(axiosResp) {
		const statusCode = axiosResp.status;
		const rawData = axiosResp.data;

		// Wrap the response data client-side
		const wrappedData = BackendResponse._wrapResponseData(
			rawData,
			statusCode
		);

		return new BackendResponse({
			success: wrappedData.success,
			response: wrappedData.response,
			error: wrappedData.error,
			axiosResponse: axiosResp,
		});
	}

	/**
	 * Creates BackendResponse from an Axios error (e.g., network error or non-2xx response)
	 * @param {import('axios').AxiosError} axiosError
	 * @returns {BackendResponse}
	 */
	static fromAxiosError(axiosError) {
		// If there's a response (e.g., 4xx, 5xx), wrap it
		if (axiosError.response) {
			const statusCode = axiosError.response.status;
			const rawData = axiosError.response.data;

			const wrappedData = BackendResponse._wrapResponseData(
				rawData,
				statusCode
			);

			return new BackendResponse({
				success: false,
				response: wrappedData.response,
				error: wrappedData.error,
				axiosResponse: axiosError.response,
			});
		}

		// No response (network error, timeout, etc.)
		return new BackendResponse({
			success: false,
			response: null,
			error: {
				message: axiosError.message || "Network error",
				details: { code: axiosError.code, name: axiosError.name },
			},
			axiosResponse: null,
		});
	}

	/**
	 * @param {Object} details
	 * @returns {BackendResponse}
	 */
	static fromJson(details) {
		const isSuccess = details.success === true;

		return new BackendResponse({
			success: isSuccess,
			response: details.response,
			error: isSuccess ? null : details.error,
		});
	}

	/**
	 * @param {Function} UserInfoClass - A class with a static fromJson method
	 * @returns {Object|null}
	 */
	toUserInfo(UserInfoClass) {
		if (this.axiosResponse == null) return null;

		if (this.hasError) {
			console.debug(
				"UserInfoConverter: 'this' has an error, we cannot convert to UserInfo."
			);
			return null;
		}

		try {
			const data = this.response;
			if (typeof data === "object" && data !== null) {
				return UserInfoClass.fromJson(data);
			}
		} catch (e) {
			console.error(
				`Error in BackendResponse.toUserInfo: '${e.name}'\n Message: ${e.message} \n\n Stack Trace:\n ${e.stack}`
			);

			if (this.axiosResponse != null) {
				console.log(this.deepDetails);
			}
		}

		return null;
	}
}

export default BackendResponse;
