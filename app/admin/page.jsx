"use client";

import { useState } from "react";
import { Header, Sidebar } from "../components/layout";
import { StatsGrid } from "../components/features";
import { Card, Button } from "../components/ui";
import { platformStats } from "../data/dummy_data";
import Link from "next/link";

export default function AdminDashboard() {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const adminStats = [
		{
			label: "Total Users",
			value: platformStats.activeMembers,
			icon: "group",
		},
		{ label: "Active Resolvers", value: 24, icon: "support_agent" },
		{
			label: "Total Issues",
			value: platformStats.issuesReported,
			icon: "flag",
		},
		{
			label: "Resolved Issues",
			value: platformStats.issuesResolved,
			icon: "check_circle",
			accent: true,
		},
		{ label: "Pending Verification", value: 5, icon: "pending_actions" },
		{
			label: "Avg Resolution",
			value: platformStats.avgResolutionTime,
			icon: "schedule",
		},
	];

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
							Welcome, Admin! 🛡️
						</h1>
						<p className='text-text-secondary-light dark:text-text-secondary-dark'>
							Here's what's happening in TownSpark today
						</p>
					</div>

					{/* Stats */}
					<StatsGrid
						stats={adminStats}
						columns={6}
						className='mb-8'
					/>

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
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className='flex items-center justify-between p-3 bg-background-light dark:bg-background-dark rounded-lg'
									>
										<div className='flex items-center gap-3'>
											<div className='size-10 rounded-full bg-primary/10 flex items-center justify-center'>
												<span className='material-symbols-outlined text-primary'>
													person
												</span>
											</div>
											<div>
												<p className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
													John Doe {i}
												</p>
												<p className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
													Public Works Dept.
												</p>
											</div>
										</div>
										<div className='flex items-center gap-2'>
											<Button
												size='sm'
												variant='ghost'
												className='text-green-500'
											>
												<span className='material-symbols-outlined'>
													check
												</span>
											</Button>
											<Button
												size='sm'
												variant='ghost'
												className='text-red-500'
											>
												<span className='material-symbols-outlined'>
													close
												</span>
											</Button>
										</div>
									</div>
								))}
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
								{[
									{
										action: "New issue reported",
										time: "2 min ago",
										icon: "flag",
										color: "text-orange-500",
									},
									{
										action: "Issue #123 resolved",
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
									{
										action: "Issue #120 acknowledged",
										time: "2 hours ago",
										icon: "visibility",
										color: "text-purple-500",
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
								))}
							</div>
						</Card>
					</div>
				</main>
			</div>
		</div>
	);
}
