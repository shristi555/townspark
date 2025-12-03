"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useIssueStore } from "@/app/z_internals/controllers/issue";
import Card from "@/app/components/ui/card";
import Input from "@/app/components/ui/input";
import Textarea from "@/app/components/ui/textarea";
import Select from "@/app/components/ui/select";
import Button from "@/app/components/ui/button";
import ImageUploader from "@/app/components/ui/image_uploader";
import { PageLoader } from "@/app/components/ui/loader";
import EmptyState from "@/app/components/ui/empty_state";

function EditIssueForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const issueId = searchParams.get("id");

	const {
		currentIssue,
		categories,
		isUpdating,
		isLoading,
		isLoadingDetails,
		errorMessage,
		validationErrors,
		fetchCategories,
		fetchIssueDetails,
		updateIssue,
		clearError,
		clearCurrentIssue,
	} = useIssueStore();

	// Form state
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [category, setCategory] = useState("");
	const [status, setStatus] = useState("");
	const [images, setImages] = useState([]);
	const [submitError, setSubmitError] = useState(null);
	const [isInitialized, setIsInitialized] = useState(false);

	// Fetch issue and categories on mount
	useEffect(() => {
		if (!issueId) {
			setSubmitError("No issue ID provided.");
			return;
		}

		const initialize = async () => {
			try {
				await Promise.all([
					fetchIssueDetails(parseInt(issueId, 10)),
					fetchCategories(),
				]);
			} catch (err) {
				console.error("Failed to load issue data:", err);
			}
		};

		initialize();

		// Cleanup on unmount
		return () => {
			clearError();
			clearCurrentIssue();
		};
	}, [
		issueId,
		fetchIssueDetails,
		fetchCategories,
		clearError,
		clearCurrentIssue,
	]);

	// Populate form when issue is loaded
	useEffect(() => {
		if (currentIssue && !isInitialized) {
			setTitle(currentIssue.title || "");
			setDescription(currentIssue.description || "");
			setLocation(currentIssue.location || "");
			setCategory(currentIssue.category?.id?.toString() || "");
			setStatus(currentIssue.status || "open");

			// Load existing images
			if (currentIssue.images && currentIssue.images.length > 0) {
				const existingImages = currentIssue.images.map(
					(url, index) => ({
						id: `existing-${index}`,
						url: url,
						preview: url,
					})
				);
				setImages(existingImages);
			}

			setIsInitialized(true);
		}
	}, [currentIssue, isInitialized]);

	// Get field error helper
	const getFieldError = useCallback(
		(fieldName) => {
			if (!validationErrors || !(fieldName in validationErrors))
				return null;
			return validationErrors[fieldName]?.[0] ?? null;
		},
		[validationErrors]
	);

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitError(null);

		// Client-side validation
		if (!title.trim()) {
			setSubmitError("Please enter a title for your issue.");
			return;
		}
		if (!description.trim()) {
			setSubmitError("Please provide a description of the issue.");
			return;
		}
		if (!location.trim()) {
			setSubmitError("Please specify the location of the issue.");
			return;
		}
		if (!category) {
			setSubmitError("Please select a category for your issue.");
			return;
		}

		try {
			const result = await updateIssue(parseInt(issueId, 10), {
				title: title.trim(),
				description: description.trim(),
				location: location.trim(),
				category: parseInt(category, 10),
				status: status,
			});

			if (result) {
				// Success - navigate to the issue detail page
				router.push(`/issue/${issueId}`);
			} else if (errorMessage) {
				setSubmitError(errorMessage);
			}
		} catch (err) {
			console.error("Failed to update issue:", err);
			setSubmitError("An unexpected error occurred. Please try again.");
		}
	};

	// Category options for select
	const categoryOptions = categories.map((cat) => ({
		value: cat.id,
		label: cat.name,
	}));

	// Status options (only for user's own issues that are still open)
	const statusOptions = [
		{ value: "open", label: "Open" },
		{ value: "closed", label: "Closed (Cancel Issue)" },
	];

	// Show loading state
	if (isLoadingDetails || (isLoading && categories.length === 0)) {
		return <PageLoader />;
	}

	// Show error if issue not found
	if (!currentIssue && !isLoadingDetails && issueId) {
		return (
			<div className='p-4'>
				<EmptyState
					icon='error'
					title='Issue Not Found'
					description="The issue you're trying to edit doesn't exist or you don't have permission to edit it."
					action={
						<Button
							variant='primary'
							onClick={() => router.push("/issue/myissues")}
						>
							Go to My Issues
						</Button>
					}
				/>
			</div>
		);
	}

	// Check if user can edit (only open issues can be edited)
	if (currentIssue && currentIssue.status !== "open") {
		return (
			<div className='p-4'>
				<EmptyState
					icon='lock'
					title='Cannot Edit Issue'
					description='This issue is no longer open and cannot be edited. Only open issues can be modified.'
					action={
						<Button
							variant='primary'
							onClick={() => router.push(`/issue/${issueId}`)}
						>
							View Issue
						</Button>
					}
				/>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className='flex flex-col gap-6'>
			{/* Error Alert */}
			{(submitError || errorMessage) && (
				<div className='flex items-start gap-3 p-4 bg-status-reported/10 border border-status-reported/20 rounded-lg'>
					<span className='material-symbols-outlined text-status-reported shrink-0'>
						error
					</span>
					<div className='flex-1'>
						<p className='font-medium text-status-reported'>
							Error
						</p>
						<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
							{submitError || errorMessage}
						</p>
					</div>
					<button
						type='button'
						onClick={() => {
							setSubmitError(null);
							clearError();
						}}
						className='shrink-0 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
					>
						<span className='material-symbols-outlined text-xl'>
							close
						</span>
					</button>
				</div>
			)}

			{/* Info Card */}
			<Card className='bg-primary/5 border-primary/20'>
				<div className='flex items-start gap-3'>
					<span className='material-symbols-outlined text-primary shrink-0'>
						edit_note
					</span>
					<div>
						<p className='font-medium text-text-primary-light dark:text-text-primary-dark'>
							Editing Issue #{issueId}
						</p>
						<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1'>
							Update the issue details below. You can only edit
							issues that are still open.
						</p>
					</div>
				</div>
			</Card>

			{/* Title */}
			<Input
				label='Issue Title *'
				placeholder='e.g., Pothole on Main Street'
				icon='title'
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				error={getFieldError("title")}
			/>

			{/* Category */}
			<Select
				label='Category *'
				placeholder='Select a category'
				options={categoryOptions}
				value={category}
				onChange={(e) => setCategory(e.target.value)}
				loading={isLoading && categories.length === 0}
				error={getFieldError("category")}
			/>

			{/* Location */}
			<Input
				label='Location *'
				placeholder='e.g., 123 Main St, near the park'
				icon='location_on'
				value={location}
				onChange={(e) => setLocation(e.target.value)}
				error={getFieldError("location")}
			/>

			{/* Description */}
			<Textarea
				label='Description *'
				placeholder='Describe the issue in detail'
				rows={5}
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				error={getFieldError("description")}
			/>

			{/* Status */}
			<Select
				label='Status'
				placeholder='Select status'
				options={statusOptions}
				value={status}
				onChange={(e) => setStatus(e.target.value)}
				error={getFieldError("status")}
				helperText="You can close this issue if it's no longer relevant"
			/>

			{/* Current Images (Read-only) */}
			{images.length > 0 && (
				<div>
					<p className='text-text-primary-light dark:text-text-primary-dark text-base font-medium leading-normal pb-2'>
						Current Images
					</p>
					<div className='grid grid-cols-4 sm:grid-cols-5 gap-2'>
						{images.map((image) => (
							<div
								key={image.id}
								className='relative aspect-square'
							>
								<div
									className='w-full h-full bg-center bg-no-repeat bg-cover rounded-lg'
									style={{
										backgroundImage: `url("${image.preview || image.url}")`,
									}}
								/>
							</div>
						))}
					</div>
					<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2'>
						Note: Image editing is not available. Create a new issue
						if you need different images.
					</p>
				</div>
			)}

			{/* Submit Buttons */}
			<div className='flex flex-col gap-3 pt-4'>
				<Button
					type='submit'
					variant='primary'
					size='lg'
					fullWidth
					loading={isUpdating}
					disabled={isUpdating}
				>
					{isUpdating ? "Saving..." : "Save Changes"}
				</Button>
				<Button
					type='button'
					variant='ghost'
					size='md'
					fullWidth
					onClick={() => router.back()}
					disabled={isUpdating}
				>
					Cancel
				</Button>
			</div>
		</form>
	);
}

export default function EditIssuePage() {
	const router = useRouter();

	return (
		<div className='relative flex min-h-screen w-full flex-col'>
			{/* Header */}
			<header className='sticky top-0 z-10 flex items-center justify-between border-b border-border-light dark:border-border-dark bg-background-light/85 dark:bg-background-dark/85 backdrop-blur-sm p-4'>
				<button
					onClick={() => router.back()}
					className='flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5'
				>
					<span className='material-symbols-outlined text-text-primary-light dark:text-text-primary-dark'>
						close
					</span>
				</button>
				<h1 className='flex-1 text-center text-lg font-bold text-text-primary-light dark:text-text-primary-dark'>
					Edit Issue
				</h1>
				<div className='w-10' />
			</header>

			{/* Main Content */}
			<main className='flex-1 p-4'>
				<Suspense fallback={<PageLoader />}>
					<EditIssueForm />
				</Suspense>
			</main>
		</div>
	);
}
