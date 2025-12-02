// services/cookie/CookieService.js
"use server";

import { cookies } from "next/headers";

export class CookieService {
	static async set(name, value, options = {}) {
		(await cookies()).set(name, value, {
			httpOnly: true,
			sameSite: "strict",
			secure: true,
			path: "/",
			...options,
		});
	}

	static async get(name) {
		return (await cookies()).get(name)?.value ?? null;
	}

	static async delete(name) {
		(await cookies()).delete(name);
	}

	static async has(name) {
		return (await cookies()).has(name);
	}

	static async getAll(): Promise<Array<{ name: string; value: string }>> {
		return (await cookies())
			.getAll()
			.map((c) => ({ name: c.name, value: c.value }));
	}
}
