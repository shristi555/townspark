"use client";

import { useState, useEffect, useCallback } from "react";
import { Header, BottomNavigation } from "../components/layout";
import { IssueList } from "../components/features";
import { Input, FilterChip, Button, Loader } from "../components/ui";
import { useCategories } from "../hooks";
import { IssueService } from "../modules/issues";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ExplorePage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [viewMode, setViewMode] = useState("list"); // list, map

	// State for issues
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pagination, setPagination] = useState(null);

	const router = useRouter();

	// Fetch categories from API
	const { data: categories, loading: categoriesLoading } = useCategories();

	// Fetch issues
	const fetchIssues = useCallback(
		async (params = {}) => {
			setLoading(true);
			setError(null);

			try {
				const queryParams = {
					search: searchQuery || undefined,
					category:
						selectedCategory !== "all"
							? selectedCategory
							: undefined,
					...params,
				};

				const response = await IssueService.getIssues(queryParams);

				if (response.success) {
					setIssues(response.data.results || response.data);
					setPagination({
						count: response.data.count,
						next: response.data.next,
						previous: response.data.previous,
					});
				} else {
					// Extract error message safely
					const errorMsg =
						response.errorMessage ||
						(typeof response.error === "string"
							? response.error
							: response.error?.message ||
								response.error?.detail ||
								"Failed to load issues");
					setError(errorMsg);
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		},
		[searchQuery, selectedCategory]
	);

	// Fetch issues on mount and when filters change
	useEffect(() => {
		const debounceTimer = setTimeout(() => {
			fetchIssues();
		}, 300); // Debounce search

		return () => clearTimeout(debounceTimer);
	}, [fetchIssues]);

	const handleFilterChange = (newFilters) => {
		fetchIssues(newFilters);
	};

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
					{(categories || []).map((cat) => (
						<FilterChip
							key={cat.id || cat.name}
							active={
								selectedCategory ===
								(cat.id || cat.slug || cat.name)
							}
							onClick={() =>
								setSelectedCategory(
									cat.id || cat.slug || cat.name
								)
							}
							icon={cat.icon}
						>
							{cat.name}
						</FilterChip>
					))}
				</div>

				{/* Results Count */}
				<div className='flex items-center justify-between mb-4'>
					<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
						{issues.length} issue
						{issues.length !== 1 ? "s" : ""} found
						{pagination?.count && ` of ${pagination.count} total`}
					</p>
				</div>

				{/* Content */}
				{viewMode === "list" ? (
					<IssueList
						issues={issues}
						loading={loading}
						error={error}
						showFilters
						showSort
						onFilterChange={handleFilterChange}
						pagination={pagination}
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
