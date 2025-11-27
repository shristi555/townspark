"use client";

import { useState } from "react";
import IssueCard from "./issue_card";
import { FilterChip, EmptyState, Loader } from "../ui";

const statusFilters = [
	{ value: "all", label: "All" },
	{ value: "reported", label: "Reported" },
	{ value: "acknowledged", label: "Acknowledged" },
	{ value: "in-progress", label: "In Progress" },
	{ value: "resolved", label: "Resolved" },
];

const sortOptions = [
	{ value: "recent", label: "Most Recent" },
	{ value: "popular", label: "Most Popular" },
	{ value: "nearby", label: "Nearby" },
];

export default function IssueList({
	issues = [],
	loading = false,
	showFilters = true,
	showSort = true,
	emptyTitle = "No issues found",
	emptyDescription = "Be the first to report an issue in your community",
	emptyAction,
	cardVariant = "default",
	className = "",
}) {
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortBy, setSortBy] = useState("recent");

	const filteredIssues = issues.filter((issue) => {
		if (statusFilter === "all") return true;
		return issue.status === statusFilter;
	});

	const sortedIssues = [...filteredIssues].sort((a, b) => {
		if (sortBy === "recent") {
			return new Date(b.createdAt) - new Date(a.createdAt);
		}
		if (sortBy === "popular") {
			return (b.upvotes || 0) - (a.upvotes || 0);
		}
		return 0;
	});

	if (loading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<Loader size='lg' />
			</div>
		);
	}

	return (
		<div className={className}>
			{/* Filters */}
			{(showFilters || showSort) && (
				<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4'>
					{showFilters && (
						<div className='flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-thin'>
							{statusFilters.map((filter) => (
								<FilterChip
									key={filter.value}
									active={statusFilter === filter.value}
									onClick={() =>
										setStatusFilter(filter.value)
									}
								>
									{filter.label}
								</FilterChip>
							))}
						</div>
					)}

					{showSort && (
						<div className='flex items-center gap-2'>
							<span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
								Sort:
							</span>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className='text-sm bg-transparent border border-border-light dark:border-border-dark rounded-lg px-2 py-1 text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50'
							>
								{sortOptions.map((option) => (
									<option
										key={option.value}
										value={option.value}
									>
										{option.label}
									</option>
								))}
							</select>
						</div>
					)}
				</div>
			)}

			{/* Issue List */}
			{sortedIssues.length === 0 ? (
				<EmptyState
					icon='search_off'
					title={emptyTitle}
					description={emptyDescription}
					action={emptyAction}
				/>
			) : (
				<div className='flex flex-col gap-4'>
					{sortedIssues.map((issue) => (
						<IssueCard
							key={issue.id}
							issue={issue}
							variant={cardVariant}
						/>
					))}
				</div>
			)}
		</div>
	);
}
