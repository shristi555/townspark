const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiRoutes = {
	baseURL: baseUrl,
	auth: {
		login: `${baseUrl}/auth/jwt/create/`,
		signup: `${baseUrl}/auth/users/`,
		refresh: `${baseUrl}/auth/jwt/refresh/`,
		me: `${baseUrl}/auth/users/me/`,
	},
};

export default apiRoutes;
