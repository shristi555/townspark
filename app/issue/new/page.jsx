"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useIssueStore } from "@/app/z_internals/controllers/issue";
import Card from "@/app/components/ui/card";
import Input from "@/app/components/ui/input";
import Textarea from "@/app/components/ui/textarea";
import Select from "@/app/components/ui/select";
import Button from "@/app/components/ui/button";
import ImageUploader from "@/app/components/ui/image_uploader";
import { PageLoader } from "@/app/components/ui/loader";
import { AuthGuard } from "@/app/z_internals/controllers/auth";
import Scaffold from "@/app/components/scaffold";

function NewIssuePageUi() {
	const router = useRouter();
	const {
		categories,
		isCreating,
		isLoading,
		errorMessage,
		validationErrors,
		fetchCategories,
		createIssue,
		clearError,
	} = useIssueStore();

	// Form state
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [category, setCategory] = useState("");
	const [images, setImages] = useState([]);
	const [submitError, setSubmitError] = useState(null);
	const [isSubmitted, setIsSubmitted] = useState(false);

	// Fetch categories on mount
	useEffect(() => {
		fetchCategories().catch((err) => {
			console.error("Failed to fetch categories:", err);
		});

		// Clear errors when leaving page
		return () => {
			clearError();
		};
	}, [fetchCategories, clearError]);

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
		setIsSubmitted(true);

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
			// Prepare files for upload
			const files = {};
			images.forEach((img, index) => {
				if (img.file) {
					files[`image_${index}`] = img.file;
				}
			});

			const result = await createIssue(
				{
					title: title.trim(),
					description: description.trim(),
					location: location.trim(),
					category: parseInt(category, 10),
				},
				Object.keys(files).length > 0 ? files : null
			);

			if (result) {
				// Success - navigate to the issue detail page
				router.push(`/issue/${result.id}`);
			} else if (errorMessage) {
				// Error from store
				setSubmitError(errorMessage);
			}
		} catch (err) {
			console.error("Failed to create issue:", err);
			setSubmitError("An unexpected error occurred. Please try again.");
		}
	};

	// Category options for select
	const categoryOptions = categories.map((cat) => ({
		value: cat.id,
		label: cat.name,
	}));

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
					Report an Issue
				</h1>
				<div className='w-10' /> {/* Spacer for alignment */}
			</header>

			{/* Main Content */}
			<main className='flex-1 p-4'>
				{isLoading && categories.length === 0 ? (
					<PageLoader />
				) : (
					<form
						onSubmit={handleSubmit}
						className='flex flex-col gap-6'
					>
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
									info
								</span>
								<div>
									<p className='font-medium text-text-primary-light dark:text-text-primary-dark'>
										Reporting Guidelines
									</p>
									<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1'>
										Please provide accurate details about
										the issue. Include photos if possible to
										help authorities understand and resolve
										the issue faster.
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
							helperText='A brief, descriptive title for the issue'
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
							helperText='Choose the category that best describes your issue'
						/>

						{/* Location */}
						<Input
							label='Location *'
							placeholder='e.g., 123 Main St, near the park'
							icon='location_on'
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							error={getFieldError("location")}
							helperText='Provide a specific address or landmark'
						/>

						{/* Description */}
						<Textarea
							label='Description *'
							placeholder='Describe the issue in detail. What did you observe? How severe is it?'
							rows={5}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							error={getFieldError("description")}
							helperText='The more details you provide, the easier it is to resolve'
						/>

						{/* Images */}
						<ImageUploader
							label='Add Photos'
							images={images}
							maxImages={5}
							onImagesChange={setImages}
						/>

						{/* Submit Button */}
						<div className='flex flex-col gap-3 pt-4'>
							<Button
								type='submit'
								variant='primary'
								size='lg'
								fullWidth
								loading={isCreating}
								disabled={isCreating}
							>
								{isCreating ? "Submitting..." : "Submit Issue"}
							</Button>
							<Button
								type='button'
								variant='ghost'
								size='md'
								fullWidth
								onClick={() => router.back()}
								disabled={isCreating}
							>
								Cancel
							</Button>
						</div>
					</form>
				)}
			</main>
		</div>
	);
}

export default function NewIssuePage() {
	return (
		<Scaffold>
			<AuthGuard>
				<NewIssuePageUi />
			</AuthGuard>
		</Scaffold>
	);
}
