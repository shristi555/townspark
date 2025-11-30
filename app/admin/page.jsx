"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header, Sidebar } from "../components/layout";
import { StatsGrid } from "../components/features";
import { Card, Button, Loader } from "../components/ui";
import { useAuth } from "../contexts/auth_context";
import { AdminService, CoreService } from "../modules";
import Link from "next/link";

export default function AdminDashboard() {
	const router = useRouter();
	const { user, isAuthenticated, isLoading: authLoading } = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [stats, setStats] = useState(null);
	const [pendingResolvers, setPendingResolvers] = useState([]);
	const [recentActivity, setRecentActivity] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

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

	// Fetch admin dashboard data
	useEffect(() => {
		const fetchDashboardData = async () => {
			if (!user || !user.is_admin) return;

			setLoading(true);
			try {
				// Fetch platform stats
				const statsResponse = await CoreService.getPlatformStats();
				if (statsResponse.success) {
					setStats(statsResponse.data);
				}

				// Fetch pending resolver verifications
				const resolversResponse =
					await AdminService.getPendingVerifications();
				if (resolversResponse.success) {
					setPendingResolvers(
						resolversResponse.data?.results ||
							resolversResponse.data ||
							[]
					);
				}

				// Fetch recent activity
				const activityResponse = await AdminService.getRecentActivity();
				if (activityResponse.success) {
					setRecentActivity(
						activityResponse.data?.results ||
							activityResponse.data ||
							[]
					);
				}
			} catch (err) {
				console.error("Failed to fetch dashboard data:", err);
				setError("Failed to load dashboard data");
			} finally {
				setLoading(false);
			}
		};

		if (user?.is_admin) {
			fetchDashboardData();
		}
	}, [user]);

	const handleApproveResolver = async (resolverId) => {
		try {
			const response = await AdminService.approveResolver(resolverId);
			if (response.success) {
				setPendingResolvers((prev) =>
					prev.filter((r) => r.id !== resolverId)
				);
			}
		} catch (err) {
			console.error("Failed to approve resolver:", err);
		}
	};

	const handleRejectResolver = async (resolverId) => {
		try {
			const response = await AdminService.rejectResolver(resolverId);
			if (response.success) {
				setPendingResolvers((prev) =>
					prev.filter((r) => r.id !== resolverId)
				);
			}
		} catch (err) {
			console.error("Failed to reject resolver:", err);
		}
	};

	const adminStats = stats
		? [
				{
					label: "Total Users",
					value: stats.total_users || stats.activeMembers || 0,
					icon: "group",
				},
				{
					label: "Active Resolvers",
					value: stats.active_resolvers || 0,
					icon: "support_agent",
				},
				{
					label: "Total Issues",
					value: stats.total_issues || stats.issuesReported || 0,
					icon: "flag",
				},
				{
					label: "Resolved Issues",
					value: stats.resolved_issues || stats.issuesResolved || 0,
					icon: "check_circle",
					accent: true,
				},
				{
					label: "Pending Verification",
					value:
						stats.pending_verifications || pendingResolvers.length,
					icon: "pending_actions",
				},
				{
					label: "Avg Resolution",
					value:
						stats.avg_resolution_time ||
						stats.avgResolutionTime ||
						"N/A",
					icon: "schedule",
				},
			]
		: [];

	const quickActions = [
		{
			title: "User Management",
			description: "Manage citizen accounts and permissions",
			icon: "group",
			href: "/admin/users",
			color: "bg-blue-500",
		},
		{
			title: "Resolver Management",
			description: "Verify and manage resolver accounts",
			icon: "support_agent",
			href: "/admin/resolvers",
			color: "bg-green-500",
		},
		{
			title: "Analytics",
			description: "View detailed statistics and reports",
			icon: "analytics",
			href: "/admin/analytics",
			color: "bg-purple-500",
		},
		{
			title: "Content Management",
			description: "Manage categories and departments",
			icon: "article",
			href: "/admin/content",
			color: "bg-orange-500",
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

	// Show error state
	if (error) {
		return (
			<div className='min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center'>
				<Card className='p-6 text-center'>
					<span className='material-symbols-outlined text-red-500 text-5xl mb-4'>
						error
					</span>
					<p className='text-text-primary-light dark:text-text-primary-dark'>
						{error}
					</p>
					<Button
						className='mt-4'
						onClick={() => window.location.reload()}
					>
						Retry
					</Button>
				</Card>
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
					title='Admin Dashboard'
					actions={
						<button
							onClick={() => setSidebarOpen(true)}
							className='md:hidden flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-primary-light dark:text-text-primary-dark'
						>
							<span className='material-symbols-outlined'>
								menu
							</span>
						</button>
					}
				/>

				<main className='max-w-6xl mx-auto px-4 py-6'>
					{/* Welcome */}
					<div className='mb-6'>
						<h1 className='text-2xl font-bold text-text-primary-light dark:text-text-primary-dark'>
							Welcome,{" "}
							{user?.full_name || user?.username || "Admin"}! 🛡️
						</h1>
						<p className='text-text-secondary-light dark:text-text-secondary-dark'>
							Here's what's happening in TownSpark today
						</p>
					</div>

					{/* Stats */}
					{adminStats.length > 0 && (
						<StatsGrid
							stats={adminStats}
							columns={6}
							className='mb-8'
						/>
					)}

					{/* Quick Actions */}
					<div className='mb-8'>
						<h2 className='text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4'>
							Quick Actions
						</h2>
						<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4'>
							{quickActions.map((action) => (
								<Link key={action.href} href={action.href}>
									<Card hover className='h-full'>
										<div
											className={`size-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}
										>
											<span className='material-symbols-outlined text-white text-2xl'>
												{action.icon}
											</span>
										</div>
										<h3 className='font-semibold text-text-primary-light dark:text-text-primary-dark mb-1'>
											{action.title}
										</h3>
										<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
											{action.description}
										</p>
									</Card>
								</Link>
							))}
						</div>
					</div>

					{/* Recent Activity & Pending Approvals */}
					<div className='grid lg:grid-cols-2 gap-6'>
						{/* Pending Approvals */}
						<Card>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='font-semibold text-text-primary-light dark:text-text-primary-dark'>
									Pending Resolver Approvals
								</h3>
								<Link
									href='/admin/resolvers'
									className='text-sm text-primary hover:underline'
								>
									View all
								</Link>
							</div>
							<div className='space-y-3'>
								{pendingResolvers.length === 0 ? (
									<div className='text-center py-6 text-text-secondary-light dark:text-text-secondary-dark'>
										<span className='material-symbols-outlined text-4xl mb-2'>
											check_circle
										</span>
										<p>No pending approvals</p>
									</div>
								) : (
									pendingResolvers
										.slice(0, 3)
										.map((resolver) => (
											<div
												key={resolver.id}
												className='flex items-center justify-between p-3 bg-background-light dark:bg-background-dark rounded-lg'
											>
												<div className='flex items-center gap-3'>
													<div className='size-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden'>
														{resolver.avatar ? (
															<img
																src={
																	resolver.avatar
																}
																alt=''
																className='w-full h-full object-cover'
															/>
														) : (
															<span className='material-symbols-outlined text-primary'>
																person
															</span>
														)}
													</div>
													<div>
														<p className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
															{resolver.full_name ||
																resolver.username}
														</p>
														<p className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
															{resolver.department ||
																resolver.organization ||
																"Pending Review"}
														</p>
													</div>
												</div>
												<div className='flex items-center gap-2'>
													<Button
														size='sm'
														variant='ghost'
														className='text-green-500'
														onClick={() =>
															handleApproveResolver(
																resolver.id
															)
														}
													>
														<span className='material-symbols-outlined'>
															check
														</span>
													</Button>
													<Button
														size='sm'
														variant='ghost'
														className='text-red-500'
														onClick={() =>
															handleRejectResolver(
																resolver.id
															)
														}
													>
														<span className='material-symbols-outlined'>
															close
														</span>
													</Button>
												</div>
											</div>
										))
								)}
							</div>
						</Card>

						{/* Recent Issues */}
						<Card>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='font-semibold text-text-primary-light dark:text-text-primary-dark'>
									Recent Issue Activity
								</h3>
								<Link
									href='/admin/analytics'
									className='text-sm text-primary hover:underline'
								>
									View analytics
								</Link>
							</div>
							<div className='space-y-3'>
								{recentActivity.length === 0
									? // Fallback to static activity if no data from API
										[
											{
												action: "New issue reported",
												time: "2 min ago",
												icon: "flag",
												color: "text-orange-500",
											},
											{
												action: "Issue resolved",
												time: "15 min ago",
												icon: "check_circle",
												color: "text-green-500",
											},
											{
												action: "New user registered",
												time: "1 hour ago",
												icon: "person_add",
												color: "text-blue-500",
											},
										].map((item, i) => (
											<div
												key={i}
												className='flex items-center gap-3 p-3 bg-background-light dark:bg-background-dark rounded-lg'
											>
												<span
													className={`material-symbols-outlined ${item.color}`}
												>
													{item.icon}
												</span>
												<div className='flex-1 min-w-0'>
													<p className='text-sm text-text-primary-light dark:text-text-primary-dark truncate'>
														{item.action}
													</p>
													<p className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
														{item.time}
													</p>
												</div>
											</div>
										))
									: recentActivity
											.slice(0, 4)
											.map((activity, i) => {
												const iconMap = {
													issue_created: {
														icon: "flag",
														color: "text-orange-500",
													},
													issue_resolved: {
														icon: "check_circle",
														color: "text-green-500",
													},
													user_registered: {
														icon: "person_add",
														color: "text-blue-500",
													},
													issue_acknowledged: {
														icon: "visibility",
														color: "text-purple-500",
													},
													comment_added: {
														icon: "chat",
														color: "text-indigo-500",
													},
												};
												const activityType = iconMap[
													activity.type
												] || {
													icon: "info",
													color: "text-gray-500",
												};

												return (
													<div
														key={activity.id || i}
														className='flex items-center gap-3 p-3 bg-background-light dark:bg-background-dark rounded-lg'
													>
														<span
															className={`material-symbols-outlined ${activityType.color}`}
														>
															{activityType.icon}
														</span>
														<div className='flex-1 min-w-0'>
															<p className='text-sm text-text-primary-light dark:text-text-primary-dark truncate'>
																{activity.description ||
																	activity.action}
															</p>
															<p className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
																{activity.time_ago ||
																	activity.created_at}
															</p>
														</div>
													</div>
												);
											})}
							</div>
						</Card>
					</div>
				</main>
			</div>
		</div>
	);
}
