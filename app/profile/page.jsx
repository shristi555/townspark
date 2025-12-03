"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header, BottomNavigation, Sidebar } from "../components/layout";
import { IssueList, StatsGrid } from "../components/features";
import {
	Avatar,
	Button,
	Tabs,
	TabPanel,
	Badge,
	Loader,
} from "../components/ui";
import Link from "next/link";

import { useIssueStore } from "../z_internals/controllers/issue";
import { AuthGuard, useAuthStore } from "../z_internals/controllers/auth";

function ProfilePageUi() {
	const router = useRouter();

	const { fetchMyIssues, myIssues } = useIssueStore();

	const { userInfo } = useAuthStore();

	const [myCreatedIssue, setMyCreatedIssue] = useState([]);

	// Fetch upvoted issues
	useEffect(() => {
		fetchMyIssues();
	}, [myIssues, fetchMyIssues]);

	// Redirect to login if not authenticated
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [authLoading, isAuthenticated, router]);

	// Show loading while checking auth
	if (authLoading || !user) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark'>
				<Loader size='lg' />
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background-light dark:bg-background-dark'>
			<Sidebar
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				showResolverNav={user?.is_staff}
				showAdminNav={user?.is_admin}
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
									src={user.profile_image || user.avatar}
									name={user.full_name || user.name}
									size='xl'
									className='ring-4 ring-card-light dark:ring-card-dark'
								/>
								<div className='flex-1'>
									<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
										<div>
											<h1 className='text-xl font-bold text-text-primary-light dark:text-text-primary-dark'>
												{user.full_name || user.name}
											</h1>
											<p className='text-text-secondary-light dark:text-text-secondary-dark'>
												@
												{user.username ||
													user.email?.split("@")[0]}
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
							{user.bio && (
								<p className='mt-4 text-text-secondary-light dark:text-text-secondary-dark'>
									{user.bio}
								</p>
							)}

							{/* Meta Info */}
							<div className='flex flex-wrap items-center gap-4 mt-4 text-sm text-text-secondary-light dark:text-text-secondary-dark'>
								{user.location && (
									<div className='flex items-center gap-1'>
										<span className='material-symbols-outlined text-lg'>
											location_on
										</span>
										{user.location}
									</div>
								)}
								<div className='flex items-center gap-1'>
									<span className='material-symbols-outlined text-lg'>
										calendar_today
									</span>
									Joined{" "}
									{new Date(
										user.created_at ||
											user.joinedAt ||
											Date.now()
									).toLocaleDateString("en-US", {
										month: "long",
										year: "numeric",
									})}
								</div>
								{(user.is_admin || user.is_staff) && (
									<Badge
										status={
											user.is_staff && !user.is_admin
												? "acknowledged"
												: "resolved"
										}
									>
										{user.is_admin ? "Admin" : "Staff"}
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
									loading={issuesLoading}
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
									loading={issuesLoading}
									showFilters={false}
									showSort={false}
									cardVariant='compact'
									emptyTitle='No resolved issues'
									emptyDescription='Issues you report that get resolved will appear here'
								/>
							</TabPanel>

							<TabPanel id='bookmarked' activeTab={activeTab}>
								<IssueList
									issues={bookmarks}
									loading={bookmarksLoading}
									showFilters={false}
									showSort={false}
									cardVariant='compact'
									emptyTitle='No bookmarks'
									emptyDescription='Save issues to view them later'
								/>
							</TabPanel>

							<TabPanel id='upvoted' activeTab={activeTab}>
								<IssueList
									issues={upvoted}
									loading={upvotedLoading}
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

function ProfilePage() {
	return (
		<AuthGuard>
			<ProfilePageUi />
		</AuthGuard>
	);
}
export default ProfilePage;
