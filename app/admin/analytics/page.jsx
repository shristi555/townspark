"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header, Sidebar } from "../../components/layout";
import { StatsGrid } from "../../components/features";
import { Select, Card, Tabs, TabPanel, Loader } from "../../components/ui";
import { useAuth } from "../../contexts/auth_context";
import { CoreService, AdminService } from "../../modules";

export default function AdminAnalyticsPage() {
	const router = useRouter();
	const { user, isAuthenticated, isLoading: authLoading } = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [timeRange, setTimeRange] = useState("30days");
	const [activeTab, setActiveTab] = useState("overview");
	const [loading, setLoading] = useState(true);
	const [analytics, setAnalytics] = useState(null);

	// Check if user is admin
	useEffect(() => {
		if (!authLoading) {
			if (!isAuthenticated) {
				router.push("/login");
				return;
			}
			if (user && !user.is_admin) {
				router.push("/feed");
				return;
			}
		}
	}, [authLoading, isAuthenticated, user, router]);

	// Fetch analytics data
	useEffect(() => {
		const fetchAnalytics = async () => {
			if (!user || !user.is_admin) return;

			setLoading(true);
			try {
				const response = await CoreService.getAnalytics({ timeRange });
				if (response.success) {
					setAnalytics(response.data);
				}
			} catch (error) {
				console.error("Failed to fetch analytics:", error);
			} finally {
				setLoading(false);
			}
		};

		if (user?.is_admin) {
			fetchAnalytics();
		}
	}, [user, timeRange]);

	const tabs = [
		{ id: "overview", label: "Overview" },
		{ id: "issues", label: "Issues" },
		{ id: "users", label: "Users" },
		{ id: "performance", label: "Performance" },
	];

	// Use analytics data if available, fallback to static values
	const overviewStats = analytics
		? [
				{
					label: "Total Issues",
					value: analytics.total_issues || 0,
					icon: "report",
					trend: analytics.issues_trend || "+0%",
					trendUp: !analytics.issues_trend?.startsWith("-"),
				},
				{
					label: "Resolved",
					value: analytics.resolved_issues || 0,
					icon: "check_circle",
					accent: true,
					trend: analytics.resolved_trend || "+0%",
					trendUp: !analytics.resolved_trend?.startsWith("-"),
				},
				{
					label: "Active Users",
					value: analytics.active_users || 0,
					icon: "people",
					trend: analytics.users_trend || "+0%",
					trendUp: !analytics.users_trend?.startsWith("-"),
				},
				{
					label: "Avg. Resolution",
					value: analytics.avg_resolution_time || "N/A",
					icon: "schedule",
					trend: analytics.resolution_trend || "+0%",
					trendUp: analytics.resolution_trend?.startsWith("-"),
				},
			]
		: [
				{
					label: "Total Issues",
					value: 0,
					icon: "report",
					trend: "+0%",
					trendUp: true,
				},
				{
					label: "Resolved",
					value: 0,
					icon: "check_circle",
					accent: true,
					trend: "+0%",
					trendUp: true,
				},
				{
					label: "Active Users",
					value: 0,
					icon: "people",
					trend: "+0%",
					trendUp: true,
				},
				{
					label: "Avg. Resolution",
					value: "N/A",
					icon: "schedule",
					trend: "+0%",
					trendUp: true,
				},
			];

	// Use analytics data for charts if available
	const issuesByStatus = analytics?.issues_by_status || [
		{
			status: "Reported",
			count: 0,
			color: "bg-status-reported",
			percentage: 0,
		},
		{
			status: "Acknowledged",
			count: 0,
			color: "bg-status-acknowledged",
			percentage: 0,
		},
		{
			status: "In Progress",
			count: 0,
			color: "bg-status-progress",
			percentage: 0,
		},
		{
			status: "Resolved",
			count: 0,
			color: "bg-status-resolved",
			percentage: 0,
		},
	];

	const issuesByCategory = analytics?.issues_by_category || [
		{ category: "Infrastructure", count: 0, percentage: 0 },
		{ category: "Sanitation", count: 0, percentage: 0 },
		{ category: "Safety", count: 0, percentage: 0 },
		{ category: "Environment", count: 0, percentage: 0 },
		{ category: "Other", count: 0, percentage: 0 },
	];

	const monthlyTrends = [
		{ month: "Jan", issues: 45, resolved: 38 },
		{ month: "Feb", issues: 52, resolved: 45 },
		{ month: "Mar", issues: 48, resolved: 42 },
		{ month: "Apr", issues: 61, resolved: 55 },
		{ month: "May", issues: 55, resolved: 48 },
		{ month: "Jun", issues: 67, resolved: 62 },
	];

	const topResolvers = [
		{
			name: "Sarah Johnson",
			department: "Public Works",
			resolved: 45,
			rating: 4.8,
		},
		{
			name: "Mike Chen",
			department: "Sanitation",
			resolved: 38,
			rating: 4.7,
		},
		{
			name: "Emily Davis",
			department: "Parks & Rec",
			resolved: 32,
			rating: 4.9,
		},
		{
			name: "James Wilson",
			department: "Roads",
			resolved: 28,
			rating: 4.6,
		},
	];

	// Show loading state
	if (authLoading || loading) {
		return (
			<div className='min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center'>
				<Loader size='lg' />
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background-light dark:bg-background-dark'>
			<Sidebar
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				showAdminNav
			/>

			<div className='md:ml-72'>
				<Header
					title='Analytics'
					showBackButton
					backHref='/admin'
					actions={
						<div className='flex items-center gap-2'>
							<Select
								value={timeRange}
								onChange={(e) => setTimeRange(e.target.value)}
								options={[
									{ value: "7days", label: "Last 7 days" },
									{ value: "30days", label: "Last 30 days" },
									{ value: "90days", label: "Last 90 days" },
									{ value: "year", label: "This Year" },
								]}
							/>
							<button
								onClick={() => setSidebarOpen(true)}
								className='md:hidden flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-primary-light dark:text-text-primary-dark'
							>
								<span className='material-symbols-outlined'>
									menu
								</span>
							</button>
						</div>
					}
				/>

				<main className='max-w-6xl mx-auto px-4 py-6'>
					{/* Overview Stats */}
					<StatsGrid
						stats={overviewStats}
						columns={4}
						className='mb-6'
					/>

					{/* Tabs */}
					<Tabs
						tabs={tabs}
						activeTab={activeTab}
						onChange={setActiveTab}
						className='mb-6'
					/>

					{activeTab === "overview" && (
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							{/* Issues by Status */}
							<Card className='p-6'>
								<h3 className='font-semibold text-lg text-text-primary-light dark:text-text-primary-dark mb-4'>
									Issues by Status
								</h3>
								<div className='space-y-4'>
									{issuesByStatus.map((item) => (
										<div key={item.status}>
											<div className='flex justify-between text-sm mb-1'>
												<span className='text-text-secondary-light dark:text-text-secondary-dark'>
													{item.status}
												</span>
												<span className='font-medium text-text-primary-light dark:text-text-primary-dark'>
													{item.count} (
													{item.percentage}%)
												</span>
											</div>
											<div className='h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden'>
												<div
													className={`h-full ${item.color} rounded-full transition-all`}
													style={{
														width: `${item.percentage}%`,
													}}
												/>
											</div>
										</div>
									))}
								</div>
							</Card>

							{/* Issues by Category */}
							<Card className='p-6'>
								<h3 className='font-semibold text-lg text-text-primary-light dark:text-text-primary-dark mb-4'>
									Issues by Category
								</h3>
								<div className='space-y-4'>
									{issuesByCategory.map((item) => (
										<div key={item.category}>
											<div className='flex justify-between text-sm mb-1'>
												<span className='text-text-secondary-light dark:text-text-secondary-dark'>
													{item.category}
												</span>
												<span className='font-medium text-text-primary-light dark:text-text-primary-dark'>
													{item.count} (
													{item.percentage}%)
												</span>
											</div>
											<div className='h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden'>
												<div
													className='h-full bg-primary rounded-full transition-all'
													style={{
														width: `${item.percentage}%`,
													}}
												/>
											</div>
										</div>
									))}
								</div>
							</Card>

							{/* Monthly Trends (Simplified Chart) */}
							<Card className='p-6 lg:col-span-2'>
								<h3 className='font-semibold text-lg text-text-primary-light dark:text-text-primary-dark mb-4'>
									Monthly Trends
								</h3>
								<div className='flex items-end gap-4 h-48'>
									{monthlyTrends.map((item) => (
										<div
											key={item.month}
											className='flex-1 flex flex-col items-center gap-2'
										>
											<div className='w-full flex gap-1 items-end h-40'>
												<div
													className='flex-1 bg-primary/30 rounded-t'
													style={{
														height: `${(item.issues / 70) * 100}%`,
													}}
													title={`Issues: ${item.issues}`}
												/>
												<div
													className='flex-1 bg-status-resolved rounded-t'
													style={{
														height: `${(item.resolved / 70) * 100}%`,
													}}
													title={`Resolved: ${item.resolved}`}
												/>
											</div>
											<span className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
												{item.month}
											</span>
										</div>
									))}
								</div>
								<div className='flex items-center justify-center gap-6 mt-4'>
									<div className='flex items-center gap-2'>
										<div className='size-3 bg-primary/30 rounded' />
										<span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
											Reported
										</span>
									</div>
									<div className='flex items-center gap-2'>
										<div className='size-3 bg-status-resolved rounded' />
										<span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
											Resolved
										</span>
									</div>
								</div>
							</Card>

							{/* Top Resolvers */}
							<Card className='p-6 lg:col-span-2'>
								<h3 className='font-semibold text-lg text-text-primary-light dark:text-text-primary-dark mb-4'>
									Top Resolvers
								</h3>
								<div className='overflow-x-auto'>
									<table className='w-full'>
										<thead>
											<tr className='border-b border-border-light dark:border-border-dark'>
												<th className='text-left py-3 px-4 font-medium text-text-secondary-light dark:text-text-secondary-dark'>
													Rank
												</th>
												<th className='text-left py-3 px-4 font-medium text-text-secondary-light dark:text-text-secondary-dark'>
													Resolver
												</th>
												<th className='text-left py-3 px-4 font-medium text-text-secondary-light dark:text-text-secondary-dark'>
													Department
												</th>
												<th className='text-left py-3 px-4 font-medium text-text-secondary-light dark:text-text-secondary-dark'>
													Resolved
												</th>
												<th className='text-left py-3 px-4 font-medium text-text-secondary-light dark:text-text-secondary-dark'>
													Rating
												</th>
											</tr>
										</thead>
										<tbody>
											{topResolvers.map(
												(resolver, index) => (
													<tr
														key={resolver.name}
														className='border-b border-border-light dark:border-border-dark last:border-0'
													>
														<td className='py-3 px-4'>
															<div
																className={`size-8 rounded-full flex items-center justify-center font-semibold text-sm ${
																	index === 0
																		? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
																		: index ===
																			  1
																			? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
																			: index ===
																				  2
																				? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
																				: "bg-black/5 text-text-secondary-light dark:bg-white/10 dark:text-text-secondary-dark"
																}`}
															>
																{index + 1}
															</div>
														</td>
														<td className='py-3 px-4 font-medium text-text-primary-light dark:text-text-primary-dark'>
															{resolver.name}
														</td>
														<td className='py-3 px-4 text-text-secondary-light dark:text-text-secondary-dark'>
															{
																resolver.department
															}
														</td>
														<td className='py-3 px-4 text-text-primary-light dark:text-text-primary-dark'>
															{resolver.resolved}
														</td>
														<td className='py-3 px-4'>
															<div className='flex items-center gap-1'>
																<span className='material-symbols-outlined text-yellow-500 text-lg'>
																	star
																</span>
																<span className='text-text-primary-light dark:text-text-primary-dark'>
																	{
																		resolver.rating
																	}
																</span>
															</div>
														</td>
													</tr>
												)
											)}
										</tbody>
									</table>
								</div>
							</Card>
						</div>
					)}

					{activeTab === "issues" && (
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							<Card className='p-6'>
								<h3 className='font-semibold text-lg text-text-primary-light dark:text-text-primary-dark mb-4'>
									Resolution Rate
								</h3>
								<div className='text-center py-8'>
									<div className='relative inline-flex items-center justify-center'>
										<svg className='size-32'>
											<circle
												cx='64'
												cy='64'
												r='56'
												fill='none'
												stroke='currentColor'
												strokeWidth='12'
												className='text-black/10 dark:text-white/10'
											/>
											<circle
												cx='64'
												cy='64'
												r='56'
												fill='none'
												stroke='currentColor'
												strokeWidth='12'
												strokeDasharray='352'
												strokeDashoffset='88'
												strokeLinecap='round'
												className='text-status-resolved transform -rotate-90 origin-center'
											/>
										</svg>
										<span className='absolute text-2xl font-bold text-text-primary-light dark:text-text-primary-dark'>
											75%
										</span>
									</div>
									<p className='mt-4 text-text-secondary-light dark:text-text-secondary-dark'>
										Issues resolved within SLA
									</p>
								</div>
							</Card>

							<Card className='p-6'>
								<h3 className='font-semibold text-lg text-text-primary-light dark:text-text-primary-dark mb-4'>
									Avg. Resolution Time by Category
								</h3>
								<div className='space-y-4'>
									{[
										{
											category: "Infrastructure",
											days: 3.2,
										},
										{ category: "Sanitation", days: 1.5 },
										{ category: "Safety", days: 2.8 },
										{ category: "Environment", days: 4.1 },
									].map((item) => (
										<div
											key={item.category}
											className='flex items-center justify-between'
										>
											<span className='text-text-secondary-light dark:text-text-secondary-dark'>
												{item.category}
											</span>
											<span className='font-medium text-text-primary-light dark:text-text-primary-dark'>
												{item.days} days
											</span>
										</div>
									))}
								</div>
							</Card>
						</div>
					)}

					{activeTab === "users" && (
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							<Card className='p-6'>
								<h3 className='font-semibold text-lg text-text-primary-light dark:text-text-primary-dark mb-4'>
									User Growth
								</h3>
								<div className='space-y-4'>
									{[
										{
											period: "This Week",
											users: 45,
											growth: "+12%",
										},
										{
											period: "This Month",
											users: 180,
											growth: "+8%",
										},
										{
											period: "This Quarter",
											users: 520,
											growth: "+15%",
										},
										{
											period: "This Year",
											users: 2100,
											growth: "+32%",
										},
									].map((item) => (
										<div
											key={item.period}
											className='flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg'
										>
											<span className='text-text-secondary-light dark:text-text-secondary-dark'>
												{item.period}
											</span>
											<div className='flex items-center gap-2'>
												<span className='font-medium text-text-primary-light dark:text-text-primary-dark'>
													{item.users} users
												</span>
												<span className='text-status-resolved text-sm'>
													{item.growth}
												</span>
											</div>
										</div>
									))}
								</div>
							</Card>

							<Card className='p-6'>
								<h3 className='font-semibold text-lg text-text-primary-light dark:text-text-primary-dark mb-4'>
									User Distribution
								</h3>
								<div className='space-y-4'>
									{[
										{
											role: "Citizens",
											count: 1850,
											percentage: 88,
										},
										{
											role: "Resolvers",
											count: 200,
											percentage: 10,
										},
										{
											role: "Admins",
											count: 50,
											percentage: 2,
										},
									].map((item) => (
										<div key={item.role}>
											<div className='flex justify-between text-sm mb-1'>
												<span className='text-text-secondary-light dark:text-text-secondary-dark'>
													{item.role}
												</span>
												<span className='font-medium text-text-primary-light dark:text-text-primary-dark'>
													{item.count} (
													{item.percentage}%)
												</span>
											</div>
											<div className='h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden'>
												<div
													className='h-full bg-primary rounded-full transition-all'
													style={{
														width: `${item.percentage}%`,
													}}
												/>
											</div>
										</div>
									))}
								</div>
							</Card>
						</div>
					)}

					{activeTab === "performance" && (
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							<Card className='p-6'>
								<h3 className='font-semibold text-lg text-text-primary-light dark:text-text-primary-dark mb-4'>
									Department Performance
								</h3>
								<div className='space-y-4'>
									{departments.map((dept) => (
										<div
											key={dept.id}
											className='flex items-center gap-4 p-3 bg-black/5 dark:bg-white/5 rounded-lg'
										>
											<div className='size-10 rounded-full bg-primary/10 flex items-center justify-center'>
												<span className='material-symbols-outlined text-primary'>
													{dept.icon}
												</span>
											</div>
											<div className='flex-1'>
												<p className='font-medium text-text-primary-light dark:text-text-primary-dark'>
													{dept.name}
												</p>
												<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
													{dept.resolverCount}{" "}
													resolvers •{" "}
													{Math.floor(
														Math.random() * 50 + 20
													)}{" "}
													resolved
												</p>
											</div>
											<div className='flex items-center gap-1 text-status-resolved'>
												<span className='material-symbols-outlined text-sm'>
													trending_up
												</span>
												<span className='text-sm font-medium'>
													+
													{Math.floor(
														Math.random() * 20 + 5
													)}
													%
												</span>
											</div>
										</div>
									))}
								</div>
							</Card>

							<Card className='p-6'>
								<h3 className='font-semibold text-lg text-text-primary-light dark:text-text-primary-dark mb-4'>
									Response Metrics
								</h3>
								<div className='space-y-4'>
									{[
										{
											metric: "First Response Time",
											value: "2.4 hrs",
											target: "< 4 hrs",
											status: "good",
										},
										{
											metric: "Resolution Time",
											value: "2.3 days",
											target: "< 3 days",
											status: "good",
										},
										{
											metric: "User Satisfaction",
											value: "4.5/5",
											target: "> 4.0",
											status: "good",
										},
										{
											metric: "Escalation Rate",
											value: "8%",
											target: "< 10%",
											status: "good",
										},
									].map((item) => (
										<div
											key={item.metric}
											className='flex items-center justify-between p-3 border border-border-light dark:border-border-dark rounded-lg'
										>
											<div>
												<p className='font-medium text-text-primary-light dark:text-text-primary-dark'>
													{item.metric}
												</p>
												<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
													Target: {item.target}
												</p>
											</div>
											<div className='flex items-center gap-2'>
												<span className='text-lg font-semibold text-text-primary-light dark:text-text-primary-dark'>
													{item.value}
												</span>
												<span className='material-symbols-outlined text-status-resolved'>
													check_circle
												</span>
											</div>
										</div>
									))}
								</div>
							</Card>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
