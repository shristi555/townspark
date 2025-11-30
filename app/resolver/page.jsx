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
import { IssueService, ProgressService } from "../modules";
import Link from "next/link";

export default function ResolverDashboard() {
	const router = useRouter();
	const { user, isAuthenticated, isLoading: authLoading } = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");

	// Data states
	const [allIssues, setAllIssues] = useState([]);
	const [inProgressIssues, setInProgressIssues] = useState([]);
	const [resolvedIssues, setResolvedIssues] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Check if user is staff (resolver) or admin
	useEffect(() => {
		if (!authLoading) {
			if (!isAuthenticated) {
				router.push("/login");
				return;
			}
			if (user && !user.is_staff && !user.is_admin) {
				router.push("/feed");
				return;
			}
		}
	}, [authLoading, isAuthenticated, user, router]);

	// Fetch staff dashboard data
	useEffect(() => {
		const fetchDashboardData = async () => {
			if (!user || (!user.is_staff && !user.is_admin)) return;

			setLoading(true);
			try {
				// Fetch all issues
				const issuesResponse = await IssueService.getIssues();
				if (issuesResponse.success) {
					const issues =
						issuesResponse.data?.results ||
						issuesResponse.data ||
						[];
					setAllIssues(issues);
					setInProgressIssues(
						issues.filter((i) => i.status === "in_progress")
					);
					setResolvedIssues(
						issues.filter(
							(i) =>
								i.status === "resolved" || i.status === "closed"
						)
					);
				}
			} catch (err) {
				console.error("Failed to fetch dashboard data:", err);
				setError("Failed to load dashboard data");
			} finally {
				setLoading(false);
			}
		};

		if (user?.is_staff || user?.is_admin) {
			fetchDashboardData();
		}
	}, [user]);

	const resolverStats = [
		{
			label: "Total Issues",
			value: allIssues.length,
			icon: "assignment",
		},
		{
			label: "In Progress",
			value: inProgressIssues.length,
			icon: "engineering",
			accent: true,
		},
		{
			label: "Resolved",
			value: resolvedIssues.length,
			icon: "check_circle",
		},
		{
			label: "Open Issues",
			value: allIssues.filter((i) => i.status === "open").length,
			icon: "schedule",
		},
	];

	const tabs = [
		{ id: "all", label: "All Issues", count: allIssues.length },
		{
			id: "in_progress",
			label: "In Progress",
			count: inProgressIssues.length,
		},
		{ id: "resolved", label: "Resolved", count: resolvedIssues.length },
	];

	const getTabIssues = () => {
		let issues = [];
		switch (activeTab) {
			case "all":
				issues = allIssues;
				break;
			case "in_progress":
				issues = inProgressIssues;
				break;
			case "resolved":
				issues = resolvedIssues;
				break;
			default:
				issues = allIssues;
		}

		// Apply status filter if not "all"
		if (statusFilter !== "all") {
			issues = issues.filter((i) => i.status === statusFilter);
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
					title='Staff Dashboard'
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
									{user?.first_name ||
										user?.username ||
										"Staff"}
									! 👋
								</h1>
								<p className='text-text-secondary-light dark:text-text-secondary-dark mt-1'>
									You have{" "}
									{
										allIssues.filter(
											(i) => i.status === "open"
										).length
									}{" "}
									open issues to review
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
									{user?.is_admin ? "Admin" : "Staff"}
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
											label: "All Statuses",
										},
										{
											value: "open",
											label: "Open",
										},
										{
											value: "in_progress",
											label: "In Progress",
										},
										{
											value: "resolved",
											label: "Resolved",
										},
										{ value: "closed", label: "Closed" },
									]}
									className='text-sm'
								/>
							</div>
						</div>

						{/* Content */}
						<div className='p-4'>
							{["all", "in_progress", "resolved"].map((tab) => (
								<TabPanel
									key={tab}
									id={tab}
									activeTab={activeTab}
								>
									<IssueList
										issues={getTabIssues()}
										showFilters={false}
										cardVariant='detailed'
										emptyTitle={`No ${tab === "all" ? "" : tab.replace("_", " ")} issues`}
										emptyDescription={
											tab === "all"
												? "No issues have been reported yet"
												: tab === "in_progress"
													? "No issues currently in progress"
													: "No resolved issues yet"
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
