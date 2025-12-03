"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthGuard, useAuthStore } from "../z_internals/controllers/auth";
import Scaffold from "../components/scaffold";
import { Loader } from "../components/ui";

// ============ Quick Action Card ============
function QuickActionCard({
	icon,
	title,
	description,
	href,
	color = "primary",
}: {
	icon: string;
	title: string;
	description: string;
	href: string;
	color?: "primary" | "green" | "orange" | "purple" | "red";
}) {
	const colorClasses = {
		primary: "bg-primary/10 text-primary dark:bg-primary/20",
		green: "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
		orange: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
		purple: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
		red: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
	};

	return (
		<Link
			href={href}
			className='group flex flex-col gap-3 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 hover:border-primary/30 dark:hover:border-primary/30 transition-all hover:shadow-lg'
		>
			<div
				className={`flex items-center justify-center w-12 h-12 rounded-lg ${colorClasses[color]}`}
			>
				<span className='material-symbols-outlined text-2xl'>
					{icon}
				</span>
			</div>
			<div>
				<h3 className='text-base font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors'>
					{title}
				</h3>
				<p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
					{description}
				</p>
			</div>
		</Link>
	);
}

// ============ Stats Card ============
function StatsCard({
	icon,
	label,
	value,
	trend,
	trendValue,
}: {
	icon: string;
	label: string;
	value: string | number;
	trend?: "up" | "down" | "neutral";
	trendValue?: string;
}) {
	const trendColors = {
		up: "text-green-600 dark:text-green-400",
		down: "text-red-600 dark:text-red-400",
		neutral: "text-slate-500 dark:text-slate-400",
	};

	return (
		<div className='flex flex-col gap-2 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50'>
			<div className='flex items-center gap-2 text-slate-500 dark:text-slate-400'>
				<span className='material-symbols-outlined text-xl'>
					{icon}
				</span>
				<span className='text-sm font-medium'>{label}</span>
			</div>
			<div className='flex items-end gap-2'>
				<span className='text-2xl font-bold text-slate-900 dark:text-white'>
					{value}
				</span>
				{trend && trendValue && (
					<span
						className={`text-sm font-medium ${trendColors[trend]}`}
					>
						{trend === "up" ? "↑" : trend === "down" ? "↓" : ""}{" "}
						{trendValue}
					</span>
				)}
			</div>
		</div>
	);
}

// ============ Activity Item ============
function ActivityItem({
	icon,
	iconColor,
	title,
	time,
	isLast = false,
}: {
	icon: string;
	iconColor: string;
	title: string;
	time: string;
	isLast?: boolean;
}) {
	const iconColors: Record<string, string> = {
		green: "bg-green-500/20 text-green-500 dark:text-green-400",
		blue: "bg-blue-500/20 text-blue-500 dark:text-blue-400",
		orange: "bg-orange-500/20 text-orange-500 dark:text-orange-400",
		red: "bg-red-500/20 text-red-500 dark:text-red-400",
		purple: "bg-purple-500/20 text-purple-500 dark:text-purple-400",
	};

	return (
		<div className='grid grid-cols-[32px_1fr] gap-x-4'>
			<div className='flex flex-col items-center gap-1.5 pt-1'>
				<div
					className={`flex items-center justify-center size-8 rounded-full ${iconColors[iconColor]}`}
				>
					<span className='material-symbols-outlined text-lg'>
						{icon}
					</span>
				</div>
				{!isLast && (
					<div className='w-px bg-slate-200 dark:bg-slate-700 h-full min-h-[20px]' />
				)}
			</div>
			<div className={`flex flex-1 flex-col ${isLast ? "" : "pb-4"}`}>
				<p className='text-slate-900 dark:text-white text-sm font-medium leading-normal'>
					{title}
				</p>
				<p className='text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal'>
					{time}
				</p>
			</div>
		</div>
	);
}

// ============ Navigation Link Card ============
function NavLinkCard({
	icon,
	title,
	description,
	href,
	badge,
}: {
	icon: string;
	title: string;
	description: string;
	href: string;
	badge?: string | number;
}) {
	return (
		<Link
			href={href}
			className='group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 hover:border-primary/30 dark:hover:border-primary/30 transition-all hover:shadow-md'
		>
			<div className='flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-colors'>
				<span className='material-symbols-outlined'>{icon}</span>
			</div>
			<div className='flex-1 min-w-0'>
				<h4 className='text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate'>
					{title}
				</h4>
				<p className='text-xs text-slate-500 dark:text-slate-400 truncate'>
					{description}
				</p>
			</div>
			{badge !== undefined && (
				<div className='flex items-center justify-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold'>
					{badge}
				</div>
			)}
			<span className='material-symbols-outlined text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors'>
				chevron_right
			</span>
		</Link>
	);
}

// ============ Main Feed Page ============
function FeedPageContent() {
	const router = useRouter();
	const userInfo = useAuthStore((state) => state.userInfo);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Simulate loading data
		const timer = setTimeout(() => setIsLoading(false), 500);
		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-[60vh]'>
				<Loader />
			</div>
		);
	}

	return (
		<div className='flex flex-col gap-6'>
			{/* Welcome Header */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white'>
						Welcome back
						{userInfo?.fullName
							? `, ${userInfo.fullName.split(" ")[0]}`
							: ""}
						! 👋
					</h1>
					<p className='text-slate-500 dark:text-slate-400 mt-1'>
						Here&apos;s what&apos;s happening in your community
						today.
					</p>
				</div>
				<Link
					href='/issue/new'
					className='inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm'
				>
					<span className='material-symbols-outlined text-xl'>
						add
					</span>
					Report Issue
				</Link>
			</div>

			{/* Stats Overview */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
				<StatsCard
					icon='report'
					label='Total Issues'
					value='156'
					trend='up'
					trendValue='12%'
				/>
				<StatsCard
					icon='hourglass_top'
					label='In Progress'
					value='23'
					trend='neutral'
					trendValue='same'
				/>
				<StatsCard
					icon='task_alt'
					label='Resolved'
					value='98'
					trend='up'
					trendValue='8%'
				/>
				<StatsCard
					icon='groups'
					label='Community Members'
					value='1.2k'
					trend='up'
					trendValue='5%'
				/>
			</div>

			{/* Quick Actions */}
			<div>
				<h2 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>
					Quick Actions
				</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
					<QuickActionCard
						icon='add_circle'
						title='Report Issue'
						description='Submit a new community issue'
						href='/issue/new'
						color='primary'
					/>
					<QuickActionCard
						icon='list_alt'
						title='My Issues'
						description="View issues you've reported"
						href='/issue/myissues'
						color='green'
					/>
					<QuickActionCard
						icon='explore'
						title='Explore'
						description='Discover issues in your area'
						href='/explore'
						color='orange'
					/>
					<QuickActionCard
						icon='map'
						title='Map View'
						description='See issues on an interactive map'
						href='/issue/list'
						color='purple'
					/>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Activity Feed - Takes 2 columns */}
				<div className='lg:col-span-2 flex flex-col gap-4'>
					<div className='flex items-center justify-between'>
						<h2 className='text-lg font-semibold text-slate-900 dark:text-white'>
							Recent Activity
						</h2>
						<Link
							href='/issue/list'
							className='text-sm text-primary hover:text-primary/80 font-medium'
						>
							View All
						</Link>
					</div>
					<div className='bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200/50 dark:border-slate-800/50'>
						<ActivityItem
							icon='task_alt'
							iconColor='green'
							title="'Broken Streetlight on Oak Ave' has been resolved"
							time='2 hours ago'
						/>
						<ActivityItem
							icon='chat_bubble'
							iconColor='blue'
							title="New comment on 'Pothole on Main St.'"
							time='5 hours ago'
						/>
						<ActivityItem
							icon='assignment_ind'
							iconColor='orange'
							title="'Park Cleanup Request' assigned to Public Works"
							time='1 day ago'
						/>
						<ActivityItem
							icon='thumb_up'
							iconColor='purple'
							title='Your issue received 10 upvotes'
							time='2 days ago'
						/>
						<ActivityItem
							icon='add_circle'
							iconColor='blue'
							title="New issue reported: 'Graffiti on Bridge'"
							time='3 days ago'
							isLast
						/>
					</div>
				</div>

				{/* Right Sidebar - Navigation Links */}
				<div className='flex flex-col gap-4'>
					<h2 className='text-lg font-semibold text-slate-900 dark:text-white'>
						Navigation
					</h2>
					<div className='flex flex-col gap-3'>
						<NavLinkCard
							icon='person'
							title='My Profile'
							description='View and edit your profile'
							href='/profile'
						/>
						<NavLinkCard
							icon='notifications'
							title='Notifications'
							description='Stay updated on your issues'
							href='/feed'
							badge='3'
						/>
						<NavLinkCard
							icon='settings'
							title='Settings'
							description='Configure your preferences'
							href='/settings'
						/>
						<NavLinkCard
							icon='help'
							title='Help & Support'
							description='Get assistance'
							href='/contact'
						/>
						<NavLinkCard
							icon='info'
							title='About TownSpark'
							description='Learn about our mission'
							href='/about'
						/>
					</div>
				</div>
			</div>

			{/* Issue Categories */}
			<div>
				<div className='flex items-center justify-between mb-4'>
					<h2 className='text-lg font-semibold text-slate-900 dark:text-white'>
						Browse by Category
					</h2>
					<Link
						href='/explore'
						className='text-sm text-primary hover:text-primary/80 font-medium'
					>
						View All Categories
					</Link>
				</div>
				<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'>
					{[
						{ icon: "construction", label: "Roads", count: 45 },
						{ icon: "lightbulb", label: "Lighting", count: 23 },
						{ icon: "park", label: "Parks", count: 18 },
						{ icon: "delete", label: "Sanitation", count: 32 },
						{ icon: "water_drop", label: "Water", count: 12 },
						{ icon: "more_horiz", label: "Other", count: 26 },
					].map((category) => (
						<Link
							key={category.label}
							href={`/explore?category=${category.label.toLowerCase()}`}
							className='group flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 hover:border-primary/30 dark:hover:border-primary/30 transition-all hover:shadow-md'
						>
							<div className='flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-colors'>
								<span className='material-symbols-outlined'>
									{category.icon}
								</span>
							</div>
							<span className='text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors'>
								{category.label}
							</span>
							<span className='text-xs text-slate-500 dark:text-slate-400'>
								{category.count} issues
							</span>
						</Link>
					))}
				</div>
			</div>

			{/* Footer Links */}
			<div className='flex flex-wrap items-center justify-center gap-4 py-6 border-t border-slate-200 dark:border-slate-800'>
				<Link
					href='/about'
					className='text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors'
				>
					About
				</Link>
				<Link
					href='/contact'
					className='text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors'
				>
					Contact
				</Link>
				<Link
					href='/privacy'
					className='text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors'
				>
					Privacy Policy
				</Link>
				<Link
					href='/terms'
					className='text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors'
				>
					Terms of Service
				</Link>
			</div>
		</div>
	);
}

// ============ Main Export with Auth Guard ============
export default function FeedPage() {
	return (
		<AuthGuard>
			<Scaffold>
				<FeedPageContent />
			</Scaffold>
		</AuthGuard>
	);
}
