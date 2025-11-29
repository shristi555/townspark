/**
 * Cookie Service
 * Utility class for managing browser cookies
 * SSR-safe with document checks
 */

class CookieService {
	static instance = new CookieService();

	/**
	 * Check if we're in a browser environment
	 * @returns {boolean}
	 */
	isBrowser() {
		return typeof document !== "undefined";
	}

	/**
	 * Set a cookie
	 * @param {string} name - Cookie name
	 * @param {string} value - Cookie value
	 * @param {number} [days] - Days until expiry
	 * @param {Object} [options] - Additional options
	 */
	setCookie(name, value, days, options = {}) {
		if (!this.isBrowser()) return;

		let expires = "";
		if (days) {
			const date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = "; expires=" + date.toUTCString();
		}

		const path = options.path || "/";
		const secure = options.secure ? "; Secure" : "";
		const sameSite = options.sameSite
			? `; SameSite=${options.sameSite}`
			: "; SameSite=Lax";

		document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=${path}${secure}${sameSite}`;
	}

	/**
	 * Get a cookie value
	 * @param {string} name - Cookie name
	 * @returns {string|null}
	 */
	getCookie(name) {
		if (!this.isBrowser()) return null;

		const nameEQ = name + "=";
		const ca = document.cookie.split(";");
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === " ") c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) {
				return decodeURIComponent(c.substring(nameEQ.length, c.length));
			}
		}
		return null;
	}

	/**
	 * Delete a cookie
	 * @param {string} name - Cookie name
	 */
	deleteCookie(name) {
		this.setCookie(name, "", -1);
	}

	/**
	 * Check if a cookie exists
	 * @param {string} name - Cookie name
	 * @returns {boolean}
	 */
	containsCookie(name) {
		return this.getCookie(name) !== null;
	}

	/**
	 * Set multiple cookies at once
	 * @param {Object} cookies - Object with cookie name-value pairs
	 * @param {number} [days] - Days until expiry
	 */
	setMultiple(cookies, days) {
		Object.entries(cookies).forEach(([name, value]) => {
			if (value !== null && value !== undefined) {
				this.setCookie(name, value, days);
			}
		});
	}

	/**
	 * Delete multiple cookies at once
	 * @param {string[]} names - Array of cookie names
	 */
	deleteMultiple(names) {
		names.forEach((name) => this.deleteCookie(name));
	}

	/**
	 * Get all cookies as an object
	 * @returns {Object}
	 */
	getAll() {
		if (!this.isBrowser()) return {};

		const cookies = {};
		document.cookie.split(";").forEach((cookie) => {
			const [name, value] = cookie.trim().split("=");
			if (name) {
				cookies[name] = decodeURIComponent(value || "");
			}
		});
		return cookies;
	}
}

export const cookieService = CookieService.instance;
export default cookieService;
