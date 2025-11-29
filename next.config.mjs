/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				pathname: "/aida-public/**",
			},
		],
	},
	// Proxy API requests to backend to avoid CORS issues in development
	async rewrites() {
		return [
			{
				source: "/api/v1/:path*",
				destination: "http://localhost:8000/api/v1/:path*",
			},
		];
	},
};

export default nextConfig;
