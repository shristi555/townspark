"use client";

import { useState } from "react";
import { Header, BottomNavigation, Sidebar } from "../components/layout";
import { IssueList } from "../components/features";
import { Button } from "../components/ui";
import { issues, currentUser } from "../data/dummy_data";
import Link from "next/link";

export default function FeedPage() {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className='min-h-screen bg-background-light dark:bg-background-dark'>
			{/* Sidebar */}
			<Sidebar
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				showResolverNav={currentUser.role === "resolver"}
				showAdminNav={currentUser.role === "admin"}
			/>

			{/* Main Content */}
			<div className='md:ml-72'>
				{/* Header */}
				<Header
					showBackButton={false}
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

				{/* Feed Content */}
				<main className='max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6'>
					{/* Welcome Banner */}
					<div className='mb-6 p-4 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-xl border border-primary/20'>
						<div className='flex items-center justify-between'>
							<div>
								<h1 className='text-lg font-bold text-text-primary-light dark:text-text-primary-dark'>
									Welcome back,{" "}
									{currentUser.name.split(" ")[0]}! 👋
								</h1>
								<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1'>
									Stay updated with issues in your community
								</p>
							</div>
							<Link href='/add'>
								<Button size='sm'>
									<span className='material-symbols-outlined mr-1 text-lg'>
										add
									</span>
									Report
								</Button>
							</Link>
						</div>
					</div>

					{/* Quick Actions */}
					<div className='flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-thin'>
						<Link
							href='/explore'
							className='flex items-center gap-2 px-4 py-2.5 bg-card-light dark:bg-card-dark rounded-full border border-border-light dark:border-border-dark whitespace-nowrap hover:border-primary transition-colors'
						>
							<span className='material-symbols-outlined text-lg text-primary'>
								explore
							</span>
							<span className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
								Explore All
							</span>
						</Link>
						<Link
							href='/profile/issues'
							className='flex items-center gap-2 px-4 py-2.5 bg-card-light dark:bg-card-dark rounded-full border border-border-light dark:border-border-dark whitespace-nowrap hover:border-primary transition-colors'
						>
							<span className='material-symbols-outlined text-lg text-status-reported'>
								flag
							</span>
							<span className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
								My Reports
							</span>
						</Link>
						<Link
							href='/explore?filter=nearby'
							className='flex items-center gap-2 px-4 py-2.5 bg-card-light dark:bg-card-dark rounded-full border border-border-light dark:border-border-dark whitespace-nowrap hover:border-primary transition-colors'
						>
							<span className='material-symbols-outlined text-lg text-green-500'>
								near_me
							</span>
							<span className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
								Near Me
							</span>
						</Link>
						<Link
							href='/explore?filter=trending'
							className='flex items-center gap-2 px-4 py-2.5 bg-card-light dark:bg-card-dark rounded-full border border-border-light dark:border-border-dark whitespace-nowrap hover:border-primary transition-colors'
						>
							<span className='material-symbols-outlined text-lg text-red-500'>
								trending_up
							</span>
							<span className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
								Trending
							</span>
						</Link>
					</div>

					{/* Issue Feed */}
					<IssueList
						issues={issues}
						showFilters
						showSort
						emptyTitle='No issues in your feed'
						emptyDescription='Be the first to report an issue in your community'
						emptyAction={
							<Link href='/add'>
								<Button>
									<span className='material-symbols-outlined mr-2'>
										add
									</span>
									Report an Issue
								</Button>
							</Link>
						}
					/>
				</main>

				{/* Bottom Navigation */}
				<BottomNavigation />
			</div>
		</div>
	);
}
