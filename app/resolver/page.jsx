"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header, Sidebar } from "../components/layout";
import { IssueList, StatsGrid } from "../components/features";
import {
	Tabs,
	TabPanel,
	Button,
	Select,
	Badge,
	Loader,
	Card,
} from "../components/ui";
import { useAuth } from "../contexts/auth_context";
import { ResolverService } from "../modules";
import Link from "next/link";

export default function ResolverDashboard() {
	const router = useRouter();
	const { user, isAuthenticated, isLoading: authLoading } = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("assigned");
	const [statusFilter, setStatusFilter] = useState("all");

	// Data states
	const [assignedIssues, setAssignedIssues] = useState([]);
	const [resolvedIssues, setResolvedIssues] = useState([]);
	const [pendingIssues, setPendingIssues] = useState([]);
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Check if user is resolver
	useEffect(() => {
		if (!authLoading) {
			if (!isAuthenticated) {
				router.push("/login");
				return;
			}
			if (user && user.role !== "resolver" && user.role !== "admin") {
				router.push("/feed");
				return;
			}
			// Check if resolver is verified
			if (user && user.role === "resolver" && !user.is_verified) {
				router.push("/resolver/pending");
				return;
			}
		}
	}, [authLoading, isAuthenticated, user, router]);

	// Fetch resolver dashboard data
	useEffect(() => {
		const fetchDashboardData = async () => {
			if (!user || (user.role !== "resolver" && user.role !== "admin"))
				return;

			setLoading(true);
			try {
				// Fetch assigned issues
				const assignedResponse =
					await ResolverService.getAssignedIssues();
				if (assignedResponse.success) {
					const issues =
						assignedResponse.data?.results ||
						assignedResponse.data ||
						[];
					setAssignedIssues(
						issues.filter((i) => i.status !== "resolved")
					);
				}

				// Fetch resolved issues
				const resolvedResponse =
					await ResolverService.getResolvedIssues();
				if (resolvedResponse.success) {
					setResolvedIssues(
						resolvedResponse.data?.results ||
							resolvedResponse.data ||
							[]
					);
				}

				// Fetch pending issues (available to claim)
				const pendingResponse =
					await ResolverService.getPendingIssues();
				if (pendingResponse.success) {
					setPendingIssues(
						pendingResponse.data?.results ||
							pendingResponse.data ||
							[]
					);
				}

				// Fetch resolver stats
				const statsResponse = await ResolverService.getStats();
				if (statsResponse.success) {
					setStats(statsResponse.data);
				}
			} catch (err) {
				console.error("Failed to fetch dashboard data:", err);
				setError("Failed to load dashboard data");
			} finally {
				setLoading(false);
			}
		};

		if (user?.role === "resolver" || user?.role === "admin") {
			fetchDashboardData();
		}
	}, [user]);

	const resolverStats = stats
		? [
				{
					label: "Assigned to You",
					value: stats.assigned_count || assignedIssues.length,
					icon: "assignment_ind",
				},
				{
					label: "In Progress",
					value:
						stats.in_progress_count ||
						assignedIssues.filter((i) => i.status === "in-progress")
							.length,
					icon: "engineering",
					accent: true,
				},
				{
					label: "Resolved This Month",
					value: stats.resolved_this_month || resolvedIssues.length,
					icon: "check_circle",
				},
				{
					label: "Avg Resolution Time",
					value: stats.avg_resolution_time || "N/A",
					icon: "schedule",
				},
			]
		: [
				{
					label: "Assigned to You",
					value: assignedIssues.length,
					icon: "assignment_ind",
				},
				{
					label: "In Progress",
					value: assignedIssues.filter(
						(i) => i.status === "in-progress"
					).length,
					icon: "engineering",
					accent: true,
				},
				{
					label: "Resolved This Month",
					value: resolvedIssues.length,
					icon: "check_circle",
				},
				{
					label: "Avg Resolution Time",
					value: "N/A",
					icon: "schedule",
				},
			];

	const tabs = [
		{ id: "assigned", label: "Assigned", count: assignedIssues.length },
		{ id: "pending", label: "Pending Review", count: pendingIssues.length },
		{ id: "resolved", label: "Resolved", count: resolvedIssues.length },
	];

	const getTabIssues = () => {
		let issues = [];
		switch (activeTab) {
			case "assigned":
				issues = assignedIssues;
				break;
			case "pending":
				issues = pendingIssues;
				break;
			case "resolved":
				issues = resolvedIssues;
				break;
			default:
				issues = assignedIssues;
		}

		// Apply priority filter if not "all"
		if (statusFilter !== "all") {
			issues = issues.filter((i) => i.urgency === statusFilter);
		}

		return issues;
	};

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
				showResolverNav
			/>

			<div className='md:ml-72'>
				<Header
					title='Resolver Dashboard'
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
					{/* Welcome Banner */}
					<div className='mb-6 p-6 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-xl border border-primary/20'>
						<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
							<div>
								<h1 className='text-2xl font-bold text-text-primary-light dark:text-text-primary-dark'>
									Welcome back,{" "}
									{user?.full_name ||
										user?.username ||
										"Resolver"}
									! 👋
								</h1>
								<p className='text-text-secondary-light dark:text-text-secondary-dark mt-1'>
									You have {assignedIssues.length} issues
									assigned to you
								</p>
							</div>
							<div className='flex items-center gap-2'>
								<Badge
									status='acknowledged'
									className='px-3 py-1.5'
								>
									<span className='material-symbols-outlined mr-1 text-sm'>
										verified
									</span>
									Verified Resolver
								</Badge>
							</div>
						</div>
					</div>

					{/* Stats */}
					<StatsGrid
						stats={resolverStats}
						columns={4}
						className='mb-6'
					/>

					{/* Issues Section */}
					<div className='bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark'>
						{/* Tabs */}
						<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-border-light dark:border-border-dark'>
							<Tabs
								tabs={tabs}
								activeTab={activeTab}
								onChange={setActiveTab}
							/>
							<div className='flex items-center gap-2'>
								<Select
									value={statusFilter}
									onChange={(e) =>
										setStatusFilter(e.target.value)
									}
									options={[
										{
											value: "all",
											label: "All Priorities",
										},
										{
											value: "critical",
											label: "Critical",
										},
										{ value: "high", label: "High" },
										{ value: "normal", label: "Normal" },
										{ value: "low", label: "Low" },
									]}
									className='text-sm'
								/>
							</div>
						</div>

						{/* Content */}
						<div className='p-4'>
							{["assigned", "pending", "resolved"].map((tab) => (
								<TabPanel
									key={tab}
									id={tab}
									activeTab={activeTab}
								>
									<IssueList
										issues={getTabIssues()}
										showFilters={false}
										cardVariant='detailed'
										emptyTitle={`No ${tab} issues`}
										emptyDescription={
											tab === "assigned"
												? "New issues will appear here when assigned to you"
												: tab === "pending"
													? "No issues pending your review"
													: "Issues you resolve will appear here"
										}
									/>
								</TabPanel>
							))}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
