"use client";

import { useState } from "react";
import { Header, Sidebar } from "../components/layout";
import { IssueList, StatsGrid } from "../components/features";
import { Tabs, TabPanel, Button, Select, Badge } from "../components/ui";
import { issues } from "../data/dummy_data";
import Link from "next/link";

export default function ResolverDashboard() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("assigned");
	const [statusFilter, setStatusFilter] = useState("all");

	// Simulated assigned issues
	const assignedIssues = issues.filter(
		(i) => i.status === "acknowledged" || i.status === "in-progress"
	);
	const resolvedIssues = issues.filter((i) => i.status === "resolved");
	const pendingIssues = issues.filter((i) => i.status === "reported");

	const resolverStats = [
		{
			label: "Assigned to You",
			value: assignedIssues.length,
			icon: "assignment_ind",
		},
		{
			label: "In Progress",
			value: issues.filter((i) => i.status === "in-progress").length,
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
			value: "2.5 days",
			icon: "schedule",
		},
	];

	const tabs = [
		{ id: "assigned", label: "Assigned", count: assignedIssues.length },
		{ id: "pending", label: "Pending Review", count: pendingIssues.length },
		{ id: "resolved", label: "Resolved", count: resolvedIssues.length },
	];

	const getTabIssues = () => {
		switch (activeTab) {
			case "assigned":
				return assignedIssues;
			case "pending":
				return pendingIssues;
			case "resolved":
				return resolvedIssues;
			default:
				return assignedIssues;
		}
	};

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
									Welcome back, Resolver! 👋
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
