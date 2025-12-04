"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useIssueStore } from "@/app/z_internals/controllers/issue";
import Card from "@/app/components/ui/card";
import Badge from "@/app/components/ui/badge";
import { PageLoader } from "@/app/components/ui/loader";
import EmptyState from "@/app/components/ui/empty_state";
import FilterChip, { FilterChipGroup } from "@/app/components/ui/filter_chip";
import Button from "@/app/components/ui/button";
import Scaffold from "@/app/components/scaffold";

const statusFilters = [
	{ label: "All", value: "all" },
	{ label: "Open", value: "open" },
	{ label: "In Progress", value: "in_progress" },
	{ label: "Resolved", value: "resolved" },
	{ label: "Closed", value: "closed" },
];

function getStatusBadgeVariant(status) {
	switch (status) {
		case "open":
			return "reported";
		case "in_progress":
			return "progress";
		case "resolved":
			return "resolved";
		case "closed":
			return "default";
		default:
			return "default";
	}
}

function formatStatus(status) {
	return status
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function formatTimeAgo(dateString) {
	const date = new Date(dateString);
	const now = new Date();
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	const intervals = [
		{ label: "year", seconds: 31536000 },
		{ label: "month", seconds: 2592000 },
		{ label: "week", seconds: 604800 },
		{ label: "day", seconds: 86400 },
		{ label: "hour", seconds: 3600 },
		{ label: "minute", seconds: 60 },
	];

	for (const interval of intervals) {
		const count = Math.floor(seconds / interval.seconds);
		if (count >= 1) {
			return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
		}
	}
	return "Just now";
}

function MyIssueCard({ issue, onView, onEdit }) {
	const imageUrl = issue.images?.[0] || null;

	return (
		<Card padding={false} className='overflow-hidden'>
			{/* Image Section */}
			{imageUrl && (
				<div className='relative w-full'>
					<div
						className='aspect-video w-full bg-cover bg-center bg-no-repeat bg-gray-200 dark:bg-gray-700'
						style={{ backgroundImage: `url("${imageUrl}")` }}
					/>
					<div className='absolute right-3 top-3'>
						<Badge
							variant={getStatusBadgeVariant(issue.status)}
							size='md'
						>
							{formatStatus(issue.status)}
						</Badge>
					</div>
				</div>
			)}

			{/* Content Section */}
			<div className='flex w-full grow flex-col gap-3 p-4'>
				{!imageUrl && (
					<div className='flex justify-end'>
						<Badge
							variant={getStatusBadgeVariant(issue.status)}
							size='md'
						>
							{formatStatus(issue.status)}
						</Badge>
					</div>
				)}

				<h3 className='text-lg font-bold leading-tight tracking-tight text-text-primary-light dark:text-text-primary-dark'>
					{issue.title}
				</h3>

				<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2'>
					{issue.description}
				</p>

				<div className='flex items-center gap-2'>
					<span className='material-symbols-outlined text-sm text-text-secondary-light dark:text-text-secondary-dark'>
						location_on
					</span>
					<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
						{issue.location}
					</p>
				</div>

				<div className='flex items-center gap-2'>
					<span className='material-symbols-outlined text-sm text-text-secondary-light dark:text-text-secondary-dark'>
						category
					</span>
					<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
						{issue.category?.name || "Uncategorized"}
					</p>
				</div>

				<div className='border-t border-border-light dark:border-border-dark' />

				<div className='flex items-center justify-between'>
					<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
						{formatTimeAgo(issue.created_at)}
					</p>
					<div className='flex items-center gap-2'>
						<Button
							size='sm'
							variant='secondary'
							onClick={() => onView(issue.id)}
						>
							<span className='material-symbols-outlined text-base'>
								visibility
							</span>
							View
						</Button>
						{/* Only allow editing for open issues */}
						{issue.status === "open" && (
							<Button
								size='sm'
								variant='primary'
								onClick={() => onEdit(issue.id)}
							>
								<span className='material-symbols-outlined text-base'>
									edit
								</span>
								Edit
							</Button>
						)}
					</div>
				</div>
			</div>
		</Card>
	);
}

function MyIssuesPageUi() {
	const router = useRouter();
	const {
		myIssues,
		isLoading,
		errorMessage,
		fetchMyIssues,
		deleteIssue,
		isDeleting,
	} = useIssueStore();
	const [activeFilter, setActiveFilter] = useState("all");
	const [deletingId, setDeletingId] = useState(null);

	useEffect(() => {
		fetchMyIssues().catch((err) => {
			console.error("Failed to fetch my issues:", err);
		});
	}, [fetchMyIssues]);

	const filteredIssues =
		activeFilter === "all"
			? myIssues
			: myIssues.filter((issue) => issue.status === activeFilter);

	const handleViewIssue = (issueId) => {
		router.push(`/issue/${issueId}`);
	};

	const handleEditIssue = (issueId) => {
		router.push(`/issue/edit?id=${issueId}`);
	};

	const handleAddIssue = () => {
		router.push("/issue/new");
	};

	return (
		<div className='relative flex min-h-screen w-full flex-col'>
			{/* Header */}
			<header className='sticky top-0 z-10 flex items-center justify-between border-b border-border-light dark:border-border-dark bg-background-light/85 dark:bg-background-dark/85 backdrop-blur-sm p-4'>
				<button
					onClick={() => router.back()}
					className='flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5'
				>
					<span className='material-symbols-outlined text-text-primary-light dark:text-text-primary-dark'>
						arrow_back_ios_new
					</span>
				</button>
				<h1 className='flex-1 text-center text-lg font-bold text-text-primary-light dark:text-text-primary-dark'>
					My Issues
				</h1>
				<Button
					size='icon'
					variant='primary'
					onClick={handleAddIssue}
					className='rounded-full'
				>
					<span className='material-symbols-outlined'>add</span>
				</Button>
			</header>

			{/* Stats */}
			<div className='grid grid-cols-4 gap-2 p-4 pb-2'>
				<div className='flex flex-col items-center p-3 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark'>
					<span className='text-2xl font-bold text-text-primary-light dark:text-text-primary-dark'>
						{myIssues.length}
					</span>
					<span className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
						Total
					</span>
				</div>
				<div className='flex flex-col items-center p-3 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark'>
					<span className='text-2xl font-bold text-status-reported'>
						{myIssues.filter((i) => i.status === "open").length}
					</span>
					<span className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
						Open
					</span>
				</div>
				<div className='flex flex-col items-center p-3 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark'>
					<span className='text-2xl font-bold text-status-progress'>
						{
							myIssues.filter((i) => i.status === "in_progress")
								.length
						}
					</span>
					<span className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
						In Progress
					</span>
				</div>
				<div className='flex flex-col items-center p-3 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark'>
					<span className='text-2xl font-bold text-status-resolved'>
						{myIssues.filter((i) => i.status === "resolved").length}
					</span>
					<span className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
						Resolved
					</span>
				</div>
			</div>

			{/* Filter Chips */}
			<div className='px-4 pb-2'>
				<FilterChipGroup>
					{statusFilters.map((filter) => (
						<FilterChip
							key={filter.value}
							label={filter.label}
							isActive={activeFilter === filter.value}
							onClick={() => setActiveFilter(filter.value)}
						/>
					))}
				</FilterChipGroup>
			</div>

			{/* Main Content */}
			<main className='flex-1 p-4 pt-2'>
				{isLoading ? (
					<PageLoader />
				) : errorMessage ? (
					<EmptyState
						icon='error'
						title='Error Loading Issues'
						description={errorMessage}
						action={
							<Button
								variant='primary'
								onClick={() => fetchMyIssues()}
							>
								Try Again
							</Button>
						}
					/>
				) : filteredIssues.length === 0 ? (
					<EmptyState
						icon='report'
						title={
							activeFilter === "all"
								? "No Issues Reported"
								: `No ${formatStatus(activeFilter)} Issues`
						}
						description={
							activeFilter === "all"
								? "You haven't reported any issues yet. Start by reporting an issue in your community."
								: `You don't have any issues with status "${formatStatus(activeFilter)}".`
						}
						action={
							activeFilter === "all" ? (
								<Button
									variant='primary'
									onClick={handleAddIssue}
								>
									Report an Issue
								</Button>
							) : (
								<Button
									variant='secondary'
									onClick={() => setActiveFilter("all")}
								>
									View All Issues
								</Button>
							)
						}
					/>
				) : (
					<div className='flex flex-col gap-4'>
						{filteredIssues.map((issue) => (
							<MyIssueCard
								key={issue.id}
								issue={issue}
								onView={handleViewIssue}
								onEdit={handleEditIssue}
							/>
						))}
					</div>
				)}
			</main>
		</div>
	);
}

export default function MyIssuesPage() {
	return (
		<Scaffold>
			<MyIssuesPageUi />
		</Scaffold>
	);
}
