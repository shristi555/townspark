"use client";

import { useState } from "react";
import { Header, BottomNavigation } from "../components/layout";
import { IssueList } from "../components/features";
import { Input, FilterChip, Button } from "../components/ui";
import { issues, categories } from "../data/dummy_data";
import Link from "next/link";

export default function ExplorePage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [viewMode, setViewMode] = useState("list"); // list, map

	const filteredIssues = issues.filter((issue) => {
		const matchesSearch =
			!searchQuery ||
			issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			issue.description
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			issue.location?.address
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			issue.location?.area
				?.toLowerCase()
				.includes(searchQuery.toLowerCase());

		const matchesCategory =
			selectedCategory === "all" || issue.category === selectedCategory;

		return matchesSearch && matchesCategory;
	});

	return (
		<div className='min-h-screen bg-background-light dark:bg-background-dark'>
			<Header title='Explore Issues' showBackButton />

			<main className='max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6'>
				{/* Search & View Toggle */}
				<div className='flex flex-col sm:flex-row gap-4 mb-6'>
					<div className='flex-1'>
						<Input
							placeholder='Search issues by title, description, or location...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							icon='search'
							fullWidth
						/>
					</div>
					<div className='flex items-center gap-2'>
						<button
							onClick={() => setViewMode("list")}
							className={`flex items-center justify-center size-10 rounded-lg transition-colors ${
								viewMode === "list"
									? "bg-primary text-white"
									: "bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark"
							}`}
						>
							<span className='material-symbols-outlined'>
								view_list
							</span>
						</button>
						<button
							onClick={() => setViewMode("map")}
							className={`flex items-center justify-center size-10 rounded-lg transition-colors ${
								viewMode === "map"
									? "bg-primary text-white"
									: "bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark"
							}`}
						>
							<span className='material-symbols-outlined'>
								map
							</span>
						</button>
					</div>
				</div>

				{/* Category Filters */}
				<div className='flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-thin'>
					<FilterChip
						active={selectedCategory === "all"}
						onClick={() => setSelectedCategory("all")}
					>
						All Categories
					</FilterChip>
					{categories.map((cat) => (
						<FilterChip
							key={cat.id}
							active={selectedCategory === cat.name}
							onClick={() => setSelectedCategory(cat.name)}
							icon={cat.icon}
						>
							{cat.name}
						</FilterChip>
					))}
				</div>

				{/* Results Count */}
				<div className='flex items-center justify-between mb-4'>
					<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
						{filteredIssues.length} issue
						{filteredIssues.length !== 1 ? "s" : ""} found
					</p>
				</div>

				{/* Content */}
				{viewMode === "list" ? (
					<IssueList
						issues={filteredIssues}
						showFilters
						showSort
						emptyTitle='No issues found'
						emptyDescription={
							searchQuery
								? "Try adjusting your search or filters"
								: "Be the first to report an issue in this category"
						}
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
				) : (
					<div className='bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden'>
						{/* Map Placeholder */}
						<div className='aspect-video flex items-center justify-center bg-background-light dark:bg-background-dark'>
							<div className='text-center'>
								<span className='material-symbols-outlined text-5xl text-text-secondary-light dark:text-text-secondary-dark mb-2'>
									map
								</span>
								<p className='text-text-secondary-light dark:text-text-secondary-dark'>
									Map view coming soon
								</p>
								<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1'>
									Interactive map to explore issues near you
								</p>
							</div>
						</div>
					</div>
				)}
			</main>

			<BottomNavigation />
		</div>
	);
}
