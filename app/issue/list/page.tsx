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
import { Issue } from "@/app/z_internals/models/issue_model";
import Scaffold from "@/app/components/scaffold";

type StatusFilter = "all" | "open" | "in_progress" | "resolved" | "closed";

const statusFilters: { label: string; value: StatusFilter }[] = [
	{ label: "All", value: "all" },
	{ label: "Open", value: "open" },
	{ label: "In Progress", value: "in_progress" },
	{ label: "Resolved", value: "resolved" },
	{ label: "Closed", value: "closed" },
];

function getStatusBadgeVariant(status: string) {
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

function formatStatus(status: string) {
	return status
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function formatTimeAgo(dateString: string): string {
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

function IssueCard({ issue, onClick }: { issue: Issue; onClick: () => void }) {
	const imageUrl = issue.images?.[0] || null;

	return (
		<Card
			padding={false}
			hover
			onClick={onClick}
			className='overflow-hidden'
		>
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
							icon={null}
						>
							{formatStatus(issue.status)}
						</Badge>
					</div>
				</div>
			)}

			{/* Content Section */}
			<div className='flex flex-col gap-3 p-4'>
				{!imageUrl && (
					<div className='flex justify-end'>
						<Badge
							variant={getStatusBadgeVariant(issue.status)}
							size='md'
							icon={null}
						>
							{formatStatus(issue.status)}
						</Badge>
					</div>
				)}

				<h3 className='text-lg font-bold leading-tight tracking-tight text-text-primary-light dark:text-text-primary-dark'>
					{issue.title}
				</h3>

				<div className='flex items-center gap-2'>
					<span className='material-symbols-outlined text-sm text-text-secondary-light dark:text-text-secondary-dark'>
						location_on
					</span>
					<p className='text-base font-normal text-text-secondary-light dark:text-text-secondary-dark'>
						{issue.location}
					</p>
				</div>

				<div className='flex items-center gap-2'>
					<span className='material-symbols-outlined text-sm text-text-secondary-light dark:text-text-secondary-dark'>
						category
					</span>
					<p className='text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark'>
						{issue.category?.name || "Uncategorized"}
					</p>
				</div>

				<div className='border-t border-border-light dark:border-border-dark' />

				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<div className='size-6 rounded-full bg-primary/20 flex items-center justify-center'>
							<span className='text-xs font-bold text-primary'>
								{issue.reported_by?.full_name?.charAt(0) || "?"}
							</span>
						</div>
						<span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
							{issue.reported_by?.full_name || "Anonymous"}
						</span>
					</div>
					<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
						{formatTimeAgo(issue.created_at)}
					</p>
				</div>
			</div>
		</Card>
	);
}

function IssueListPageUi() {
	const router = useRouter();
	const { issues, isLoading, errorMessage, fetchIssues } = useIssueStore();
	const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

	useEffect(() => {
		fetchIssues().catch((err) => {
			console.error("Failed to fetch issues:", err);
		});
	}, [fetchIssues]);

	const filteredIssues =
		activeFilter === "all"
			? issues
			: issues.filter((issue) => issue.status === activeFilter);

	const handleIssueClick = (issueId: number) => {
		router.push(`/issue/${issueId}`);
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
					All Issues
				</h1>
				<Button
					size='icon'
					variant='primary'
					onClick={handleAddIssue}
					className='rounded-full'
					icon='add'
				/>
			</header>

			{/* Filter Chips */}
			<div className='p-4 pb-2'>
				<FilterChipGroup>
					{statusFilters.map((filter) => (
						<FilterChip
							key={filter.value}
							label={filter.label}
							icon={null}
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
								onClick={() => fetchIssues()}
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
								? "No Issues Found"
								: `No ${formatStatus(activeFilter)} Issues`
						}
						description={
							activeFilter === "all"
								? "Be the first to report an issue in your community."
								: `There are no issues with status "${formatStatus(activeFilter)}" at the moment.`
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
							<IssueCard
								key={issue.id}
								issue={issue}
								onClick={() => handleIssueClick(issue.id)}
							/>
						))}
					</div>
				)}
			</main>
		</div>
	);
}

export default function IssueListPage() {
	return (
		<Scaffold>
			<IssueListPageUi />
		</Scaffold>
	);
}
