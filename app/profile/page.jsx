"use client";

import { useState } from "react";
import { Header, BottomNavigation, Sidebar } from "../components/layout";
import { IssueList, StatsGrid } from "../components/features";
import { Avatar, Button, Tabs, TabPanel, Badge } from "../components/ui";
import { currentUser, issues } from "../data/dummy_data";
import Link from "next/link";

export default function ProfilePage() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("reported");

	const userIssues = issues.filter((i) => i.author?.id === currentUser.id);
	const reportedIssues = userIssues.filter((i) => i.status !== "resolved");
	const resolvedIssues = userIssues.filter((i) => i.status === "resolved");

	const userStats = [
		{ label: "Issues Reported", value: userIssues.length, icon: "flag" },
		{
			label: "Resolved",
			value: resolvedIssues.length,
			icon: "check_circle",
			accent: true,
		},
		{ label: "Upvotes Received", value: 234, icon: "thumb_up" },
		{ label: "Comments", value: 56, icon: "chat" },
	];

	const tabs = [
		{ id: "reported", label: "Reported", count: reportedIssues.length },
		{ id: "resolved", label: "Resolved", count: resolvedIssues.length },
		{ id: "bookmarked", label: "Bookmarked", count: 5 },
		{ id: "upvoted", label: "Upvoted", count: 12 },
	];

	return (
		<div className='min-h-screen bg-background-light dark:bg-background-dark'>
			<Sidebar
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				showResolverNav={currentUser.role === "resolver"}
				showAdminNav={currentUser.role === "admin"}
			/>

			<div className='md:ml-72'>
				<Header
					title='My Profile'
					actions={
						<>
							<button
								onClick={() => setSidebarOpen(true)}
								className='md:hidden flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-primary-light dark:text-text-primary-dark'
							>
								<span className='material-symbols-outlined'>
									menu
								</span>
							</button>
							<Link href='/settings'>
								<button className='flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-primary-light dark:text-text-primary-dark'>
									<span className='material-symbols-outlined'>
										settings
									</span>
								</button>
							</Link>
						</>
					}
				/>

				<main className='max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6'>
					{/* Profile Header */}
					<div className='bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden mb-6'>
						{/* Cover */}
						<div className='h-32 bg-gradient-to-r from-primary to-blue-600' />

						{/* Profile Info */}
						<div className='px-4 sm:px-6 pb-6'>
							<div className='flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-8'>
								<Avatar
									src={currentUser.avatar}
									name={currentUser.name}
									size='xl'
									className='ring-4 ring-card-light dark:ring-card-dark'
								/>
								<div className='flex-1'>
									<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
										<div>
											<h1 className='text-xl font-bold text-text-primary-light dark:text-text-primary-dark'>
												{currentUser.name}
											</h1>
											<p className='text-text-secondary-light dark:text-text-secondary-dark'>
												@{currentUser.username}
											</p>
										</div>
										<Link href='/settings/profile'>
											<Button variant='outline' size='sm'>
												<span className='material-symbols-outlined mr-1 text-lg'>
													edit
												</span>
												Edit Profile
											</Button>
										</Link>
									</div>
								</div>
							</div>

							{/* Bio */}
							{currentUser.bio && (
								<p className='mt-4 text-text-secondary-light dark:text-text-secondary-dark'>
									{currentUser.bio}
								</p>
							)}

							{/* Meta Info */}
							<div className='flex flex-wrap items-center gap-4 mt-4 text-sm text-text-secondary-light dark:text-text-secondary-dark'>
								{currentUser.location && (
									<div className='flex items-center gap-1'>
										<span className='material-symbols-outlined text-lg'>
											location_on
										</span>
										{currentUser.location}
									</div>
								)}
								<div className='flex items-center gap-1'>
									<span className='material-symbols-outlined text-lg'>
										calendar_today
									</span>
									Joined{" "}
									{new Date(
										currentUser.joinedAt
									).toLocaleDateString("en-US", {
										month: "long",
										year: "numeric",
									})}
								</div>
								{currentUser.role !== "citizen" && (
									<Badge
										status={
											currentUser.role === "resolver"
												? "acknowledged"
												: "resolved"
										}
									>
										{currentUser.role
											.charAt(0)
											.toUpperCase() +
											currentUser.role.slice(1)}
									</Badge>
								)}
							</div>
						</div>
					</div>

					{/* Stats */}
					<StatsGrid stats={userStats} columns={4} className='mb-6' />

					{/* Tabs & Content */}
					<div className='bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden'>
						<Tabs
							tabs={tabs}
							activeTab={activeTab}
							onChange={setActiveTab}
							className='px-4 pt-4'
						/>

						<div className='p-4'>
							<TabPanel id='reported' activeTab={activeTab}>
								<IssueList
									issues={reportedIssues}
									showFilters={false}
									showSort={false}
									cardVariant='compact'
									emptyTitle='No active reports'
									emptyDescription='Your reported issues that are resolved will appear here'
								/>
							</TabPanel>

							<TabPanel id='resolved' activeTab={activeTab}>
								<IssueList
									issues={resolvedIssues}
									showFilters={false}
									showSort={false}
									cardVariant='compact'
									emptyTitle='No resolved issues'
									emptyDescription='Issues you report that get resolved will appear here'
								/>
							</TabPanel>

							<TabPanel id='bookmarked' activeTab={activeTab}>
								<IssueList
									issues={issues.slice(0, 3)}
									showFilters={false}
									showSort={false}
									cardVariant='compact'
									emptyTitle='No bookmarks'
									emptyDescription='Save issues to view them later'
								/>
							</TabPanel>

							<TabPanel id='upvoted' activeTab={activeTab}>
								<IssueList
									issues={issues.slice(2, 5)}
									showFilters={false}
									showSort={false}
									cardVariant='compact'
									emptyTitle='No upvoted issues'
									emptyDescription='Issues you upvote will appear here'
								/>
							</TabPanel>
						</div>
					</div>
				</main>

				<BottomNavigation />
			</div>
		</div>
	);
}
