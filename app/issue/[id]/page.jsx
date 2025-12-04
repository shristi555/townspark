"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter, useParams } from "next/navigation";
import { useIssueStore } from "@/app/z_internals/controllers/issue";
import Card from "@/app/components/ui/card";
import Badge from "@/app/components/ui/badge";
import Button from "@/app/components/ui/button";
import { PageLoader } from "@/app/components/ui/loader";
import EmptyState from "@/app/components/ui/empty_state";

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

function formatDate(dateString) {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
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

// Progress timeline icons based on status
const statusIcons = {
	open: "upload",
	in_progress: "construction",
	resolved: "task_alt",
	closed: "cancel",
};

function ProgressTimeline({ status, progress, createdAt }) {
	const steps = [
		{
			key: "submitted",
			label: "Submitted",
			icon: "upload",
			date: createdAt,
			isCompleted: true,
		},
		{
			key: "acknowledged",
			label: "Acknowledged",
			icon: "verified_user",
			isCompleted: status !== "open",
		},
		{
			key: "in_progress",
			label: "Work in Progress",
			icon: "construction",
			isCompleted: status === "in_progress" || status === "resolved",
			isActive: status === "in_progress",
		},
		{
			key: "resolved",
			label: "Resolved",
			icon: "task_alt",
			isCompleted: status === "resolved" || status === "closed",
		},
	];

	return (
		<div className='px-4 pt-6 pb-2'>
			<h2 className='text-lg font-bold mb-4 text-text-primary-light dark:text-text-primary-dark'>
				Progress Timeline
			</h2>
			<div className='grid grid-cols-[auto_1fr] gap-x-4'>
				{steps.map((step, index) => (
					<Fragment key={step.key}>
						<div className='flex flex-col items-center gap-1'>
							<div
								className={`flex size-8 items-center justify-center rounded-full ${
									step.isCompleted || step.isActive
										? "bg-status-progress text-white"
										: "bg-border-light dark:bg-border-dark text-text-secondary-light dark:text-text-secondary-dark"
								}`}
							>
								<span className='material-symbols-outlined !text-xl'>
									{step.icon}
								</span>
							</div>
							{index < steps.length - 1 && (
								<div
									className={`w-0.5 grow ${
										step.isCompleted
											? "bg-status-progress"
											: "bg-border-light dark:bg-border-dark"
									}`}
								/>
							)}
						</div>
						<div
							className={`flex flex-1 flex-col ${index < steps.length - 1 ? "pb-6" : ""} pt-1`}
						>
							<p
								className={`text-base font-medium ${
									step.isCompleted || step.isActive
										? "text-text-primary-light dark:text-text-primary-dark"
										: "text-text-secondary-light dark:text-text-secondary-dark"
								}`}
							>
								{step.label}
							</p>
							{step.date && (
								<span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
									{formatDate(step.date)}
								</span>
							)}
						</div>
					</Fragment>
				))}
			</div>
		</div>
	);
}

function ImageGallery({ images }) {
	const [activeIndex, setActiveIndex] = useState(0);

	if (!images || images.length === 0) {
		return (
			<div className='aspect-video w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center'>
				<span className='material-symbols-outlined text-6xl text-primary/30'>
					image
				</span>
			</div>
		);
	}

	return (
		<div className='relative'>
			<div
				className='aspect-video w-full bg-cover bg-center bg-no-repeat'
				style={{
					backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 35%), url("${images[activeIndex]}")`,
				}}
			/>
			{images.length > 1 && (
				<div className='absolute bottom-4 left-0 right-0 flex justify-center gap-2'>
					{images.map((_, index) => (
						<button
							key={index}
							onClick={() => setActiveIndex(index)}
							className={`size-2 rounded-full transition-opacity ${
								index === activeIndex
									? "bg-white"
									: "bg-white/50 hover:bg-white/75"
							}`}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function ProgressUpdates({ progress }) {
	if (!progress || progress.length === 0) {
		return null;
	}

	return (
		<div className='px-4 pt-6 pb-2'>
			<h2 className='text-lg font-bold mb-4 text-text-primary-light dark:text-text-primary-dark'>
				Updates
			</h2>
			<div className='flex flex-col gap-4'>
				{progress.map((update) => (
					<Card
						key={update.id}
						className='bg-primary/5 border-primary/20'
					>
						<div className='flex items-center gap-3 mb-2'>
							<span className='material-symbols-outlined text-primary'>
								campaign
							</span>
							<p className='text-sm font-bold text-primary'>
								Update from{" "}
								{update.updated_by?.full_name || "Staff"}
							</p>
						</div>
						<p className='text-sm text-text-primary-light dark:text-text-primary-dark'>
							{update.description}
						</p>
						<p className='text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2'>
							{formatDate(update.created_at)}
						</p>
					</Card>
				))}
			</div>
		</div>
	);
}
function IssueDetailPageUi() {
	const router = useRouter();
	const params = useParams();
	const issueId = params?.id;

	const {
		currentIssue,
		currentIssueProgress,
		isLoadingDetails,
		isLoadingProgress,
		errorMessage,
		fetchIssueDetails,
		fetchIssueProgress,
		clearCurrentIssue,
		clearError,
	} = useIssueStore();

	useEffect(() => {
		if (!issueId) return;

		const id = parseInt(issueId, 10);
		if (isNaN(id)) {
			console.error("Invalid issue ID:", issueId);
			return;
		}

		fetchIssueDetails(id).catch((err) => {
			console.error("Failed to fetch issue details:", err);
		});

		fetchIssueProgress(id).catch((err) => {
			console.error("Failed to fetch issue progress:", err);
		});

		return () => {
			clearCurrentIssue();
			clearError();
		};
	}, [
		issueId,
		fetchIssueDetails,
		fetchIssueProgress,
		clearCurrentIssue,
		clearError,
	]);

	if (isLoadingDetails) {
		return (
			<div className='min-h-screen bg-background-light dark:bg-background-dark'>
				<PageLoader />
			</div>
		);
	}

	if (errorMessage && !currentIssue) {
		return (
			<div className='min-h-screen bg-background-light dark:bg-background-dark p-4'>
				<EmptyState
					icon='error'
					title='Issue Not Found'
					description={errorMessage}
					action={
						<Button
							variant='primary'
							onClick={() => router.push("/issue/list")}
						>
							View All Issues
						</Button>
					}
				/>
			</div>
		);
	}

	if (!currentIssue) {
		return (
			<div className='min-h-screen bg-background-light dark:bg-background-dark p-4'>
				<EmptyState
					icon='search_off'
					title='Issue Not Found'
					description="The issue you're looking for doesn't exist or has been removed."
					action={
						<Button
							variant='primary'
							onClick={() => router.push("/issue/list")}
						>
							View All Issues
						</Button>
					}
				/>
			</div>
		);
	}

	return (
		<div className='relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark'>
			{/* Header */}
			<header className='sticky top-0 z-10 flex items-center gap-2 border-b border-border-light dark:border-border-dark bg-background-light/85 dark:bg-background-dark/85 backdrop-blur-sm p-4'>
				<button
					onClick={() => router.back()}
					className='flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5'
				>
					<span className='material-symbols-outlined text-text-primary-light dark:text-text-primary-dark'>
						arrow_back
					</span>
				</button>
				<h1 className='flex-1 truncate text-lg font-bold text-text-primary-light dark:text-text-primary-dark'>
					{currentIssue.title}
				</h1>
			</header>

			{/* Main Content */}
			<main className='flex-1 pb-24'>
				{/* Hero Image */}
				<ImageGallery images={currentIssue.images} />

				{/* Status & Stats */}
				<div className='flex flex-col gap-px overflow-hidden border-y border-border-light dark:border-border-dark bg-border-light dark:bg-border-dark'>
					{/* Status */}
					<div className='flex items-center gap-4 bg-background-light dark:bg-background-dark px-4 min-h-14 justify-between'>
						<div className='flex items-center gap-4'>
							<div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
								<span className='material-symbols-outlined'>
									{statusIcons[currentIssue.status] || "info"}
								</span>
							</div>
							<p className='text-base font-medium text-text-primary-light dark:text-text-primary-dark'>
								Status
							</p>
						</div>
						<Badge
							variant={getStatusBadgeVariant(currentIssue.status)}
							size='lg'
						>
							{formatStatus(currentIssue.status)}
						</Badge>
					</div>

					{/* Category */}
					<div className='flex items-center gap-4 bg-background-light dark:bg-background-dark px-4 min-h-14 justify-between'>
						<div className='flex items-center gap-4'>
							<div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
								<span className='material-symbols-outlined'>
									category
								</span>
							</div>
							<p className='text-base font-normal text-text-primary-light dark:text-text-primary-dark'>
								{currentIssue.category?.name || "Uncategorized"}
							</p>
						</div>
					</div>

					{/* Issue ID */}
					<div className='flex items-center gap-4 bg-background-light dark:bg-background-dark px-4 min-h-14 justify-between'>
						<div className='flex items-center gap-4'>
							<div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
								<span className='material-symbols-outlined'>
									tag
								</span>
							</div>
							<p className='text-base font-normal text-text-primary-light dark:text-text-primary-dark'>
								Issue ID
							</p>
						</div>
						<p className='text-base font-normal text-text-secondary-light dark:text-text-secondary-dark'>
							#{currentIssue.id}
						</p>
					</div>

					{/* Reported By */}
					<div className='flex items-center gap-4 bg-background-light dark:bg-background-dark px-4 min-h-14 justify-between'>
						<div className='flex items-center gap-4'>
							<div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
								<span className='material-symbols-outlined'>
									person
								</span>
							</div>
							<p className='text-base font-normal text-text-primary-light dark:text-text-primary-dark'>
								Reported by
							</p>
						</div>
						<p className='text-base font-normal text-text-secondary-light dark:text-text-secondary-dark'>
							{currentIssue.reported_by?.full_name || "Anonymous"}
						</p>
					</div>
				</div>

				{/* Description */}
				<div className='px-4 pt-6 pb-2'>
					<h2 className='text-lg font-bold mb-2 text-text-primary-light dark:text-text-primary-dark'>
						Description
					</h2>
					<p className='text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed'>
						{currentIssue.description}
					</p>
				</div>

				{/* Location */}
				<div className='px-4 pt-6 pb-2'>
					<h2 className='text-lg font-bold mb-4 text-text-primary-light dark:text-text-primary-dark'>
						Location
					</h2>
					<Card className='overflow-hidden' padding={false}>
						<div className='h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center'>
							<span className='material-symbols-outlined text-4xl text-primary/50'>
								map
							</span>
						</div>
						<div className='p-4'>
							<div className='flex items-center gap-2'>
								<span className='material-symbols-outlined text-primary'>
									location_on
								</span>
								<p className='font-medium text-text-primary-light dark:text-text-primary-dark'>
									{currentIssue.location}
								</p>
							</div>
						</div>
					</Card>
				</div>

				{/* Progress Timeline */}
				<ProgressTimeline
					status={currentIssue.status}
					progress={currentIssueProgress}
					createdAt={currentIssue.created_at}
				/>

				{/* Progress Updates */}
				<ProgressUpdates progress={currentIssueProgress} />

				{/* Metadata */}
				<div className='px-4 pt-6 pb-2'>
					<h2 className='text-lg font-bold mb-4 text-text-primary-light dark:text-text-primary-dark'>
						Details
					</h2>
					<div className='flex flex-col gap-2 text-sm'>
						<div className='flex justify-between'>
							<span className='text-text-secondary-light dark:text-text-secondary-dark'>
								Created
							</span>
							<span className='text-text-primary-light dark:text-text-primary-dark'>
								{formatDate(currentIssue.created_at)}
							</span>
						</div>
						<div className='flex justify-between'>
							<span className='text-text-secondary-light dark:text-text-secondary-dark'>
								Last Updated
							</span>
							<span className='text-text-primary-light dark:text-text-primary-dark'>
								{formatTimeAgo(currentIssue.updated_at)}
							</span>
						</div>
						{currentIssue.image_count > 0 && (
							<div className='flex justify-between'>
								<span className='text-text-secondary-light dark:text-text-secondary-dark'>
									Images
								</span>
								<span className='text-text-primary-light dark:text-text-primary-dark'>
									{currentIssue.image_count}
								</span>
							</div>
						)}
					</div>
				</div>
			</main>

			{/* Bottom Action Bar */}
			<div className='fixed bottom-0 left-0 right-0 border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-4'>
				<div className='flex gap-3'>
					<Button
						variant='secondary'
						fullWidth
						onClick={() => router.push("/issue/list")}
					>
						<span className='material-symbols-outlined'>list</span>
						All Issues
					</Button>
					<Button
						variant='primary'
						fullWidth
						onClick={() => router.push("/issue/new")}
					>
						<span className='material-symbols-outlined'>add</span>
						Report Issue
					</Button>
				</div>
			</div>
		</div>
	);
}

export default function IssueDetailPage() {
	return (
		<div>
			<IssueDetailPageUi />
		</div>
	);
}
