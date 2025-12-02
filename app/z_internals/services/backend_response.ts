import { AxiosResponse } from "axios";

class BackendResponse {
	/** Indicates if the request was successful */
	readonly success: boolean;

	/** The actual response data from the backend */
	readonly response: any | null;

	/** Error details if the request failed, can be null if no error */
	readonly error: Record<string, any> | null;

	/** The original axios response */
	readonly axiosResponse: AxiosResponse | null;

	constructor({
		success,
		response = null,
		error = null,
		axiosResponse = null,
	}: {
		success: boolean;
		response?: any | null;
		error?: Record<string, any> | null;
		axiosResponse?: AxiosResponse | null;
	}) {
		this.success = success;
		this.response = response;
		this.error = error;
		this.axiosResponse = axiosResponse;
	}

	/** Returns true if error is not null */
	get hasError(): boolean {
		return this.error !== null;
	}

	/** Indicates if the error was client-side such as network error or timeout */
	get isClientError(): boolean {
		return this.axiosResponse === null && this.hasError;
	}

	static fromAxiosResponse(axiosResp: AxiosResponse): BackendResponse {
		const data = axiosResp.data;

		if (typeof data !== "object" || data === null) {
			return new BackendResponse({
				success: false,
				error: { message: "Invalid response format", details: data },
				axiosResponse: axiosResp,
			});
		}

		const isSuccess = data.success === true;

		return new BackendResponse({
			success: isSuccess,
			response: data.response ?? null,
			error: isSuccess
				? null
				: (data.error as Record<string, any> | null),
			axiosResponse: axiosResp,
		});
	}

	static fromJson(details: Record<string, any>): BackendResponse {
		const isSuccess = details.success === true;

		return new BackendResponse({
			success: isSuccess,
			response: details.response ?? null,
			error: isSuccess
				? null
				: (details.error as Record<string, any> | null),
		});
	}

	toJson(): Record<string, any> {
		return {
			success: this.success,
			response: this.response,
			error: this.error,
		};
	}

	toString(): string {
		return JSON.stringify(
			{
				success: this.success,
				response: this.response,
				error: this.error,
				status: this.axiosResponse?.status,
				statusText: this.axiosResponse?.statusText,
			},
			null,
			2
		);
	}
}

export { BackendResponse };
