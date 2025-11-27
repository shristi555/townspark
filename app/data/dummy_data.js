// Dummy data for TownSpark application

// User data
export const currentUser = {
	id: "user-1",
	name: "Jane Doe",
	username: "janedoe_spark",
	email: "jane.doe@email.com",
	phone: "+1 234 567 8900",
	avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAN939zS5ICQcGgGI_UcUMIDtNAWmYHtie_uwhiToPjrPjPrjjf1QrlG9u5td-QvbvedeNxMRf4CQBXZFbLmIg4libmUeBCtxfoE-H7tFM8P1dRjLj6YGyc3v5jGQYP-UsO4qhXjMkE1zeN6y5Vd7MtvOAiQ_-PStJI3wRONhSIqjGvgoqw8wEhKmY9WNgGRnluGbSBnwjbEevbDQi2ftseEqhHZHm6Fnfq9T2l8cL37-HeRsgU2092HQR2xtchnQ7EIEWcvmUgdEQ",
	role: "citizen", // citizen, resolver, admin
	address: "123 Main Street, TownSpark",
	ward: "Ward A",
	joinedDate: "2023-06-15",
	stats: {
		issuesPosted: 12,
		upliftsReceived: 87,
		issuesResolved: 5,
	},
	badges: ["Community Hero", "First Report", "10 Issues Resolved"],
};

// Resolver user
export const resolverUser = {
	id: "resolver-1",
	name: "John Smith",
	email: "john.smith@publicworks.gov",
	avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWKUKVqP0H_PkJ9St4rFf5-3-P2csyyQ6wIy74WLOfNNNM8LX60m9iyEQfOJVYkGOVIdSJvcaPzi0eNr6IyF4nXQi3QM-sVZeXuBYvaRCm8R3nVtO2fFWMWKBBRs6eJENby5882Phu6ixdf5ibBspRanuQ0huYnfL8ZcthoCflpMEVqTAV8vWV7uCyasHEn8_rZmOQAndeZ-bIol0izTHAXJD_kmoT6Tlwr39MZ3EbglHF3cmTcoKH5nYZ_gfyoBnqg1zjn7Ko17U",
	role: "resolver",
	department: "Public Works",
	designation: "Field Officer",
	jurisdiction: "Ward A, Ward B",
	verified: true,
	stats: {
		pending: 12,
		inProgress: 5,
		resolvedThisMonth: 48,
		avgResponseTime: "2.5 days",
	},
};

// Categories for issues
export const categories = [
	{ id: "road", name: "Road Maintenance", icon: "car_repair" },
	{ id: "garbage", name: "Garbage & Waste", icon: "delete" },
	{ id: "sewage", name: "Sewage & Drains", icon: "water_drop" },
	{ id: "electricity", name: "Electricity", icon: "bolt" },
	{ id: "streetlight", name: "Street Light", icon: "lightbulb" },
	{ id: "water", name: "Water Supply", icon: "water" },
	{ id: "traffic", name: "Traffic", icon: "traffic" },
	{ id: "graffiti", name: "Graffiti & Vandalism", icon: "format_paint" },
	{ id: "parks", name: "Parks & Gardens", icon: "park" },
	{ id: "other", name: "Other", icon: "more_horiz" },
];

// Status options
export const statusOptions = [
	{
		id: "reported",
		name: "Reported",
		color: "status-reported",
		icon: "report",
	},
	{
		id: "acknowledged",
		name: "Acknowledged",
		color: "status-acknowledged",
		icon: "verified_user",
	},
	{
		id: "in-progress",
		name: "In Progress",
		color: "status-progress",
		icon: "hourglass_top",
	},
	{
		id: "resolved",
		name: "Resolved",
		color: "status-resolved",
		icon: "task_alt",
	},
];

// Urgency levels
export const urgencyLevels = [
	{ id: "low", name: "Low", color: "urgency-low" },
	{ id: "medium", name: "Medium", color: "urgency-high" },
	{ id: "high", name: "High", color: "urgency-high" },
];

// Departments for resolvers
export const departments = [
	{ id: "public-works", name: "Public Works", icon: "construction" },
	{ id: "sanitation", name: "Sanitation", icon: "delete" },
	{ id: "traffic", name: "Traffic Management", icon: "traffic" },
	{ id: "parks", name: "Parks & Recreation", icon: "park" },
	{ id: "utilities", name: "Utilities", icon: "bolt" },
	{ id: "housing", name: "Housing", icon: "home" },
	{ id: "environment", name: "Environment", icon: "eco" },
];

// Sample issues data
export const issues = [
	{
		id: "TS-1138",
		title: "Large Pothole on Main Street",
		description:
			"A large pothole near the intersection of Main and 1st is causing traffic issues. Please fix it urgently. It has already damaged a few car tires and is a major hazard for cyclists. The situation gets worse after rain.",
		category: "road",
		status: "reported",
		urgency: "high",
		location: {
			address: "123 Main Street",
			area: "Oakwood District",
			coordinates: { lat: 40.7128, lng: -74.006 },
		},
		images: [
			"https://lh3.googleusercontent.com/aida-public/AB6AXuDvgL_1lBiaxwAU8yrxtjym08zV0cZGg3yvI8h59fMrg1UPBxSxIMyQWQK6riFWKES8c6g-cvpSqAEUZYYrHzf1I9ShQGenbmsthZJFynAZQN2bZTYr9zGbZmOgX9M1HPwQsA8PwHn9SVyyCp10YztE5Fgt87jhMuomu_tzwGcS04JeH40I--8SL_if1xPizQ5Xj-gymSlK7stZ65V3VXo4Cja17wxyLeiYcaUAaEjh7vtjC54KwKD-nD2hOTmz9n1LcP9gNQz-oIA",
		],
		reporter: {
			id: "user-2",
			name: "Alex Chen",
			avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPLCklyhDOPqVKVW-xVYxKZbLBDbINg7Nzg0JzUUcYqR4OEp_HTTYX2ZPTOycQQxwnuZbZJRG2faasThx_jUSq7_dv-FNo24afib44ESNu_LVgKd6R4c4fCSZPcKVMGF9QN4teSOSU2ldFLdipWeg7812zyGSo1Z50RaDC1T9Xlvhm0yrMmBZM1xvJRtLoMB05uSQLQ5WRQ_GV_PY6FMMPekWMVOeJpg0JFz_bS6f3Qxcot-DpoLQKYvrf1xg5Lnjhodd9_A7k5w8",
		},
		uplifts: 128,
		comments: 16,
		shares: 8,
		createdAt: "2023-10-26T10:30:00Z",
		updatedAt: "2023-10-27T09:00:00Z",
		isAnonymous: false,
		timeline: [
			{
				status: "reported",
				date: "2023-10-26T10:30:00Z",
				note: "Issue reported",
			},
		],
	},
	{
		id: "TS-1139",
		title: "Streetlight Out on Willow Creek Ln",
		description:
			"The streetlight at the corner of Willow Creek and Pine has been out for three days. It's very dark and feels unsafe at night.",
		category: "streetlight",
		status: "in-progress",
		urgency: "medium",
		location: {
			address: "Willow Creek Lane",
			area: "Willow Creek",
			coordinates: { lat: 40.7138, lng: -74.008 },
		},
		images: [
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAax0Oc36pSqXR78V4wuiZO7L8G_KQHDC7yoGTsKKRg0KHt8Ly5ao6pcBHhPjfYtRE9ih0tbj4c3JZXqQ58kKvGt0clwye-YdB7sfMaaxJGZuDnWzw_ILDVbvCRNdEKbHMiG4xJYA5bXqg4vXgta1QX81goNl_l-NFJNZVkRzi0sTtCrMmC9oMu1tfrJqWZM8RJeMfO6I27n0LyuJv7mnAcU65R40Z4ONKAXePp9jXxFMDrCyqA5oPSTw9rglA3Vjau_ibTaxm9f3k",
		],
		reporter: {
			id: "user-3",
			name: "Maria Garcia",
			avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6xSt3bX6sW54mDPqgaRCyDAB7xtxTGUfDm-_gRtiNnrP8avVMDwJkMB3u3GXAMRDnn5JaF2dcdTkFjNyOVhX-HGwC3hytCfCefLSGESCHeGq4jlcU-2rD-qH0-qLKofdkGX_S2MXI0Utv1DZp87OMLjcO3wndZYmSFPNn_GTtQHCIQyLX3RjujDrmjJu3cgnLHY68zNxFbtCvhVX51RWVouRccqnV-p9rbG19PZ5zylbfpKtFKPY2Zvm_ehVimv95CV42sZile2c",
		},
		uplifts: 96,
		comments: 22,
		shares: 5,
		createdAt: "2023-10-24T14:00:00Z",
		updatedAt: "2023-10-26T11:00:00Z",
		isAnonymous: false,
		timeline: [
			{
				status: "reported",
				date: "2023-10-24T14:00:00Z",
				note: "Issue reported",
			},
			{
				status: "acknowledged",
				date: "2023-10-25T09:00:00Z",
				note: "Acknowledged by Public Works",
			},
			{
				status: "in-progress",
				date: "2023-10-26T11:00:00Z",
				note: "Work crew dispatched",
			},
		],
		officialResponse: {
			department: "Public Works Dept.",
			message:
				"Thank you for reporting. A crew has been dispatched to fix the streetlight. Expected completion within 24 hours.",
			date: "2023-10-26T11:00:00Z",
		},
	},
	{
		id: "TS-1140",
		title: "Graffiti on Park Bench",
		description:
			"The main bench near the children's playground in Central Park has been vandalized with graffiti. It's unsightly and needs to be cleaned up.",
		category: "graffiti",
		status: "resolved",
		urgency: "low",
		location: {
			address: "Central Park",
			area: "Central Park",
			coordinates: { lat: 40.7148, lng: -74.003 },
		},
		images: [
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAOeVZbq_YQk3RHjB2h3kbzuIVRbGWECGOcJ0w2swjbZrpvs4wouVThVzPePfUecouaRDZ6NpMT221rQDUIKed_TJI9Q6mzlQ3fIYQE2YgYXzngOsFbSUWyqKVpxMdyR6ASuTTYWJ1-61jWNQgyBATbq3AAMeYf-wy5DlSvKd2z9EVvFpkc1GuYAaVVdlhaahqZf9suKFE5sVLLhmqveISlRNBTcCQ-viIHW8aoUh9sxcYmK6yF6XMsmzUPJV0SV9qG2gLzs1qUviM",
		],
		reporter: {
			id: "user-4",
			name: "David Smith",
			avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAP5U-LzLDfUA_EJZWPUh1K0dcsTsmhN9mgmdMEqIv6AB1JwWT4BjK2RNtEaeqRxSXX5wBw8hCBZ_X5vmrZ5LwkMKidDUan2_AASvkuf2JVYW3-TauLadlcDsVATOGsb_aAUkZMzzX-6qI_L_2vbl-mmPgABfuyQqTBdJvI9T5ud6Iv_8H4WqZca5vXy08-iqslJmMDmxAgjrPZdq_byCEc9vUJoOVtasBmXXk6GOFRMCne_iLdZNpQ4yWZIHtCWA46-_FQDrrX-Bg",
		},
		uplifts: 54,
		comments: 7,
		shares: 2,
		createdAt: "2023-10-22T09:00:00Z",
		updatedAt: "2023-10-25T15:00:00Z",
		isAnonymous: false,
		timeline: [
			{
				status: "reported",
				date: "2023-10-22T09:00:00Z",
				note: "Issue reported",
			},
			{
				status: "acknowledged",
				date: "2023-10-22T14:00:00Z",
				note: "Acknowledged by Parks Dept",
			},
			{
				status: "in-progress",
				date: "2023-10-24T08:00:00Z",
				note: "Cleaning crew scheduled",
			},
			{
				status: "resolved",
				date: "2023-10-25T15:00:00Z",
				note: "Graffiti removed successfully",
			},
		],
		afterImages: [
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCNFtZr6w3LgYl7IbOcXWh4ojh1XEVYfIrJL3x4scbd-fW0FAGVmlcF9QSr-l2j1KqSin8jhcZTlYv6u9u7823afnli4xLOHmZiYwVbI5qcTxUjyFDnKqxpH_NpZrQ2nbpcm-kIo6gYVtfleeBTFiwtakFbpWStNxtep2oC9ix6yfmdiLqqfXLFXtlSXfeCv_SuBWITX5VHp53K-jJCiPrITN1lhMuY3n3hsVi0rWUZhKjXZU4yY3FM1B1HUdLJbY4EWcg3dMFcAZQ",
		],
	},
	{
		id: "TS-1141",
		title: "Overflowing Garbage Bin",
		description:
			"The public garbage bin near the bus stop on Maple Avenue is overflowing and creating a mess. Needs urgent collection.",
		category: "garbage",
		status: "reported",
		urgency: "medium",
		location: {
			address: "Maple Avenue Bus Stop",
			area: "Maple Avenue",
			coordinates: { lat: 40.7158, lng: -74.009 },
		},
		images: [
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCNFtZr6w3LgYl7IbOcXWh4ojh1XEVYfIrJL3x4scbd-fW0FAGVmlcF9QSr-l2j1KqSin8jhcZTlYv6u9u7823afnli4xLOHmZiYwVbI5qcTxUjyFDnKqxpH_NpZrQ2nbpcm-kIo6gYVtfleeBTFiwtakFbpWStNxtep2oC9ix6yfmdiLqqfXLFXtlSXfeCv_SuBWITX5VHp53K-jJCiPrITN1lhMuY3n3hsVi0rWUZhKjXZU4yY3FM1B1HUdLJbY4EWcg3dMFcAZQ",
		],
		reporter: {
			id: "user-1",
			name: "Jane Doe",
			avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAN939zS5ICQcGgGI_UcUMIDtNAWmYHtie_uwhiToPjrPjPrjjf1QrlG9u5td-QvbvedeNxMRf4CQBXZFbLmIg4libmUeBCtxfoE-H7tFM8P1dRjLj6YGyc3v5jGQYP-UsO4qhXjMkE1zeN6y5Vd7MtvOAiQ_-PStJI3wRONhSIqjGvgoqw8wEhKmY9WNgGRnluGbSBnwjbEevbDQi2ftseEqhHZHm6Fnfq9T2l8cL37-HeRsgU2092HQR2xtchnQ7EIEWcvmUgdEQ",
		},
		uplifts: 45,
		comments: 12,
		shares: 3,
		createdAt: "2023-10-27T08:00:00Z",
		updatedAt: "2023-10-27T08:00:00Z",
		isAnonymous: false,
		timeline: [
			{
				status: "reported",
				date: "2023-10-27T08:00:00Z",
				note: "Issue reported",
			},
		],
	},
];

// Comments for issues
export const comments = [
	{
		id: "comment-1",
		issueId: "TS-1138",
		user: {
			id: "user-5",
			name: "John D.",
			avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcw9M5Y0olnQbh3CPBkqMpyYtZH86cIrs96tZcVzZ1NtXA1HDT-Uqns77vjDXaiQpthy_Q9e8H2G0NkAIeWXhtyCXv-_HuqaU4KeD5uC3T_orQLEXqFyPYSErErKvMUWwgzwwDkoGcHpCRXiZ7rPZxjHafd5Rl3BK6RsMWEZxTGThhEFnudkrh4DF5BjolNnJcMXxhqtwCAo6Qd36JsJIHkWy2Qq-xxw7gY8iaN47bz4Aebk7D7Bbacy6npBhFqUA4_ac3cp4YLKE",
		},
		text: "Thanks for the update! This one was getting pretty bad.",
		createdAt: "2023-10-27T11:00:00Z",
	},
	{
		id: "comment-2",
		issueId: "TS-1138",
		user: {
			id: "user-6",
			name: "Jane S.",
			avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfRCcR675bZI6027GRJrVOeBZB_hmJRZ5TADO2sngJe2ucs5zd2q8Cg0VDLE3VvfoXBithFhJTBkkZ7T9LNV7LrH1ihYQbRPl0wyWW1zKDXex53bBrzNMRhQxt2-cFtBmnL6-z8gcLBgu-TeDQ8xjp_W1aY94i2DkOUllX0ga4K5OCA1lW16lFPs87tYcrrB_X4d7V996eapEC6loUc7jvKciY5b5QwfQlXlW7lKraCSoPljoNYqXFifZxrHwOwemLlqAn4UbXBak",
		},
		text: "My car hit this yesterday. Glad to see it's being handled quickly.",
		createdAt: "2023-10-27T09:00:00Z",
	},
];

// Users for admin management
export const users = [
	{
		id: "user-1",
		name: "Eleanor Vance",
		email: "eleanor.v@email.com",
		avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTzDbR9CM6lLk0cf6XD1UbG31CfryowBHv9CUaVG3RKt3-XxQ-5Yj0GZzpXhVZEsBixtD2-yneGN_SE6POb4Jv461fkYiMNJ666bfpk48Kd75ayWfHVAiJUM2hMXaCytr048RJpUva8lJawAfKG7GQswPC2d3YOf1cMyR6Phf7tNQ0OV2xZ3tGlGtiziZKqLulmGYgJIlqk5h1VC_S6NSTrmmJEZWDwUoRbnU7N9C1HVJooSykAY9COXwauHcNcuZ53EbiGP1gvAU",
		status: "active",
		role: "citizen",
		joinedDate: "2023-01-15",
	},
	{
		id: "user-2",
		name: "Marcus Reid",
		email: "m.reid@email.com",
		avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2WJJKQi2dMfxLNKxSDalkrCZJvfd9v97O7bJYfnLDxdimsBFuUILO24gsJjRi8dleaYG6jxFzW8y20UGXFGN0YVbgkTcmjfgJZsnxf5KIkKcCetOWfMCBOXbJaZyQHp5QSgx2ImUM69iB25eu2Oz4rH4KKZGzKiY5AxzfGbJ1vslamJDdnMLBycKK_smGa6FdeDSYovEXDcZ7cl6VRD6_0yQ3mQZ_yU_fA8Y3kln9FuDVNS9_VlEQfpPziiKNi2CLDHJ2uXJeYME",
		status: "suspended",
		role: "citizen",
		joinedDate: "2023-03-20",
	},
	{
		id: "user-3",
		name: "Clara Chen",
		email: "clara.chen@email.com",
		avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnb8pjdXkeKBBfJ8SrnnFVXMqsIJZt9rSsateYMVSzaMKs_GfqHfWkzdDe_ZDyjEyvG0geN6J8F2xgTlYaLKEgwpW2iH_yBXo20cqsDhlnf7P_q7fHyl6DFP0fO5AuIRkVTLbTRL9Py1xNv0OsAHt1LlbWyxKgdbAcJcEK2V0Sopsj4Grvww15yLk0z821rfEIdSI8naGgt92qIyA5wGiOmilZ7OF-VQA6kC8yX5CUKE2-OeTmwqLKXZnheEf6lIsOA9u9JcuDawE",
		status: "banned",
		role: "citizen",
		joinedDate: "2023-02-10",
	},
	{
		id: "user-4",
		name: "Liam Johnson",
		email: "liam.j@email.com",
		avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbaYeqJ8nxXdTLURAWhh5vzwn8kRMjBSnAuMHWU0Sld6HVW1UhhWPQ3wWxpWM3K31CqTWOFXCHraVPaSo9ukuJKwRvyOmDsDZq-PMBzR1Dtx1ltobMEuBQZmcxwPag7MaJv45cpnmIFy5bz-4Z5kSuwg0h0hzu93nJ0lB4blyGfQceL75ZNT8y0JV2F2B9O958mURiLiJqE_YQMhQLKEZT0E2jxGkeIIax3J3JRZOvr2D4wfXR0DyMb6P5CvVIbhSuoFt-SetraNM",
		status: "active",
		role: "citizen",
		joinedDate: "2023-05-01",
	},
];

// Resolvers for admin management
export const resolvers = [
	{
		id: "resolver-1",
		name: "John Smith",
		email: "john.smith@publicworks.gov",
		department: "Public Works",
		designation: "Field Officer",
		jurisdiction: "Ward A, Ward B",
		status: "verified",
		idDocument: "id_card_1.pdf",
		avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWKUKVqP0H_PkJ9St4rFf5-3-P2csyyQ6wIy74WLOfNNNM8LX60m9iyEQfOJVYkGOVIdSJvcaPzi0eNr6IyF4nXQi3QM-sVZeXuBYvaRCm8R3nVtO2fFWMWKBBRs6eJENby5882Phu6ixdf5ibBspRanuQ0huYnfL8ZcthoCflpMEVqTAV8vWV7uCyasHEn8_rZmOQAndeZ-bIol0izTHAXJD_kmoT6Tlwr39MZ3EbglHF3cmTcoKH5nYZ_gfyoBnqg1zjn7Ko17U",
	},
	{
		id: "resolver-2",
		name: "Sarah Connor",
		email: "sarah.connor@sanitation.gov",
		department: "Sanitation",
		designation: "Supervisor",
		jurisdiction: "Ward C, Ward D",
		status: "pending",
		idDocument: "id_card_2.pdf",
		avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6xSt3bX6sW54mDPqgaRCyDAB7xtxTGUfDm-_gRtiNnrP8avVMDwJkMB3u3GXAMRDnn5JaF2dcdTkFjNyOVhX-HGwC3hytCfCefLSGESCHeGq4jlcU-2rD-qH0-qLKofdkGX_S2MXI0Utv1DZp87OMLjcO3wndZYmSFPNn_GTtQHCIQyLX3RjujDrmjJu3cgnLHY68zNxFbtCvhVX51RWVouRccqnV-p9rbG19PZ5zylbfpKtFKPY2Zvm_ehVimv95CV42sZile2c",
	},
];

// Platform stats for landing page
export const platformStats = {
	issuesReported: 1204,
	issuesResolved: 987,
	activeMembers: 152,
	avgResolutionTime: "36h",
};

// Analytics data
export const analyticsData = {
	totalResolved: 1204,
	avgResolutionTime: "36h",
	newReports: 88,
	satisfaction: "4.8/5",
	categoryBreakdown: [
		{ category: "Pothole", count: 245 },
		{ category: "Streetlight", count: 389 },
		{ category: "Graffiti", count: 312 },
		{ category: "Parking", count: 156 },
		{ category: "Trash", count: 267 },
	],
	weeklyTrend: [
		{ week: "W1", resolved: 45 },
		{ week: "W2", resolved: 52 },
		{ week: "W3", resolved: 38 },
		{ week: "W4", resolved: 79 },
	],
};

// Navigation items
export const navigationItems = {
	citizen: [
		{ id: "home", label: "Home Feed", icon: "home", path: "/feed" },
		{
			id: "report",
			label: "Report Issue",
			icon: "add_circle",
			path: "/report",
		},
		{
			id: "my-reports",
			label: "My Reports",
			icon: "history",
			path: "/my-reports",
		},
		{ id: "profile", label: "Profile", icon: "person", path: "/profile" },
		{
			id: "settings",
			label: "Settings",
			icon: "settings",
			path: "/settings",
		},
	],
	resolver: [
		{
			id: "dashboard",
			label: "Dashboard",
			icon: "dashboard",
			path: "/resolver",
		},
		{
			id: "tasks",
			label: "My Tasks",
			icon: "list_alt",
			path: "/resolver/tasks",
		},
		{
			id: "analytics",
			label: "Analytics",
			icon: "analytics",
			path: "/resolver/analytics",
		},
		{ id: "profile", label: "Profile", icon: "person", path: "/profile" },
		{
			id: "settings",
			label: "Settings",
			icon: "settings",
			path: "/settings",
		},
	],
	admin: [
		{
			id: "dashboard",
			label: "Dashboard",
			icon: "dashboard",
			path: "/admin",
		},
		{
			id: "users",
			label: "User Management",
			icon: "group",
			path: "/admin/users",
		},
		{
			id: "resolvers",
			label: "Resolver Management",
			icon: "verified_user",
			path: "/admin/resolvers",
		},
		{
			id: "content",
			label: "Content Management",
			icon: "article",
			path: "/admin/content",
		},
		{
			id: "analytics",
			label: "Analytics",
			icon: "analytics",
			path: "/admin/analytics",
		},
		{
			id: "settings",
			label: "Settings",
			icon: "settings",
			path: "/admin/settings",
		},
	],
};

// Notifications data
export const notifications = [
	{
		id: "notif-1",
		type: "status_update",
		title: "Status Update",
		message:
			"Your issue 'Large Pothole on Main Street' has been acknowledged by Public Works.",
		issueId: "TS-1138",
		read: false,
		timestamp: "2024-01-15T10:30:00Z",
	},
	{
		id: "notif-2",
		type: "comment",
		title: "New Comment",
		message:
			"John Smith commented on your issue: 'We have scheduled this for repair next week.'",
		issueId: "TS-1138",
		read: false,
		timestamp: "2024-01-15T09:15:00Z",
	},
	{
		id: "notif-3",
		type: "resolved",
		title: "Issue Resolved",
		message:
			"Great news! Your issue 'Broken Streetlight on Oak Ave' has been resolved.",
		issueId: "TS-1139",
		read: true,
		timestamp: "2024-01-14T16:45:00Z",
	},
	{
		id: "notif-4",
		type: "mention",
		title: "You were mentioned",
		message:
			"Sarah mentioned you in a comment on 'Overflowing Garbage Bin'.",
		issueId: "TS-1140",
		read: true,
		timestamp: "2024-01-14T14:20:00Z",
	},
	{
		id: "notif-5",
		type: "status_update",
		title: "Status Update",
		message: "Your issue 'Cracked Sidewalk' is now in progress.",
		issueId: "TS-1141",
		read: true,
		timestamp: "2024-01-13T11:00:00Z",
	},
];

// Helper function to get status info
export function getStatusInfo(statusId) {
	return statusOptions.find((s) => s.id === statusId) || statusOptions[0];
}

// Helper function to get category info
export function getCategoryInfo(categoryId) {
	return (
		categories.find((c) => c.id === categoryId) ||
		categories[categories.length - 1]
	);
}

// Helper function to format date
export function formatDate(dateString) {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

// Helper function to get relative time
export function getRelativeTime(dateString) {
	const date = new Date(dateString);
	const now = new Date();
	const diffInMs = now - date;
	const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
	const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	if (diffInMinutes < 60) {
		return `${diffInMinutes}m ago`;
	} else if (diffInHours < 24) {
		return `${diffInHours}h ago`;
	} else if (diffInDays < 7) {
		return `${diffInDays}d ago`;
	} else {
		return formatDate(dateString);
	}
}
