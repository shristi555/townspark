/**
 * Base Service
 * Common functionality for all domain services
 *
 * This class provides:
 * - Common HTTP methods with auth support
 * - Standardized error handling
 * - Response transformation utilities
 */

import httpClient, { ApiResponse } from "./http_client";

/**
 * Base Service class with common HTTP methods
 */
export class BaseService {
	/**
	 * @param {string} basePath - Base API path for this service
	 */
	constructor(basePath = "") {
		this.basePath = basePath;
	}

	/**
	 * Build full endpoint path
	 * @param {string} path - Relative path
	 * @returns {string}
	 */
	buildPath(path) {
		if (path.startsWith("/")) return path;
		return `${this.basePath}${path}`;
	}

	/**
	 * GET request
	 * @param {string} endpoint
	 * @param {Object} options
	 * @returns {Promise<ApiResponse>}
	 */
	async get(endpoint, { params = null, auth = false } = {}) {
		return httpClient.get(this.buildPath(endpoint), { params, auth });
	}

	/**
	 * POST request
	 * @param {string} endpoint
	 * @param {Object} data
	 * @param {Object} options
	 * @returns {Promise<ApiResponse>}
	 */
	async post(endpoint, data = null, { auth = false, files = null } = {}) {
		return httpClient.post(this.buildPath(endpoint), data, { auth, files });
	}

	/**
	 * PUT request
	 * @param {string} endpoint
	 * @param {Object} data
	 * @param {Object} options
	 * @returns {Promise<ApiResponse>}
	 */
	async put(endpoint, data = null, { auth = false, files = null } = {}) {
		return httpClient.put(this.buildPath(endpoint), data, { auth, files });
	}

	/**
	 * PATCH request
	 * @param {string} endpoint
	 * @param {Object} data
	 * @param {Object} options
	 * @returns {Promise<ApiResponse>}
	 */
	async patch(endpoint, data = null, { auth = false, files = null } = {}) {
		return httpClient.patch(this.buildPath(endpoint), data, {
			auth,
			files,
		});
	}

	/**
	 * DELETE request
	 * @param {string} endpoint
	 * @param {Object} options
	 * @returns {Promise<ApiResponse>}
	 */
	async delete(endpoint, { auth = false } = {}) {
		return httpClient.delete(this.buildPath(endpoint), { auth });
	}

	/**
	 * Transform response data using a model class
	 * @param {ApiResponse} response
	 * @param {Function} ModelClass - Class with static fromJson method
	 * @returns {ApiResponse}
	 */
	transformResponse(response, ModelClass) {
		if (!response.success || !response.data) return response;

		try {
			if (Array.isArray(response.data)) {
				response.data = response.data.map((item) =>
					ModelClass.fromJson(item)
				);
			} else {
				response.data = ModelClass.fromJson(response.data);
			}
		} catch (e) {
			console.error(
				`Failed to transform response with ${ModelClass.name}:`,
				e
			);
		}

		return response;
	}

	/**
	 * Transform paginated response
	 * @param {ApiResponse} response
	 * @param {Function} ModelClass
	 * @returns {ApiResponse}
	 */
	transformPaginatedResponse(response, ModelClass) {
		if (!response.success || !response.data) return response;

		try {
			const { results, ...pagination } = response.data;
			response.data = {
				...pagination,
				results:
					results?.map((item) => ModelClass.fromJson(item)) || [],
			};
		} catch (e) {
			console.error(`Failed to transform paginated response:`, e);
		}

		return response;
	}
}

/**
 * Utility to create a simple service object from routes
 * @param {Object} routes - Route definitions
 * @returns {Object} Service object with methods
 */
export function createService(routes) {
	const service = {};

	// Add convenience methods
	service._get = (endpoint, options) => httpClient.get(endpoint, options);
	service._post = (endpoint, data, options) =>
		httpClient.post(endpoint, data, options);
	service._put = (endpoint, data, options) =>
		httpClient.put(endpoint, data, options);
	service._patch = (endpoint, data, options) =>
		httpClient.patch(endpoint, data, options);
	service._delete = (endpoint, options) =>
		httpClient.delete(endpoint, options);

	return service;
}

export default BaseService;
