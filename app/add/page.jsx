"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header, BottomNavigation } from "../components/layout";
import {
	Button,
	Input,
	Textarea,
	Select,
	ImageUploader,
	Loader,
} from "../components/ui";
import { useAuth } from "../contexts/auth_context";
import { useCategories, useAreas } from "../hooks";
import { IssueService } from "../modules/issues";

export default function ReportIssuePage() {
	const router = useRouter();
	const { user, isAuthenticated, loading: authLoading } = useAuth();
	const [loading, setLoading] = useState(false);
	const [images, setImages] = useState([]);
	const [apiError, setApiError] = useState("");
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		urgency: "normal",
		location: "",
		area: "",
		is_anonymous: false,
	});
	const [errors, setErrors] = useState({});
	const [coords, setCoords] = useState({ latitude: null, longitude: null });

	// Fetch categories and areas from API
	const { data: categories, loading: categoriesLoading } = useCategories();
	const { data: areas, loading: areasLoading } = useAreas();

	// Urgency levels (static)
	const urgencyLevels = [
		{ id: "low", name: "Low" },
		{ id: "normal", name: "Normal" },
		{ id: "high", name: "High" },
		{ id: "critical", name: "Critical" },
	];

	// Redirect if not authenticated
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [authLoading, isAuthenticated, router]);

	if (authLoading || !user) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark'>
				<Loader size='lg' />
			</div>
		);
	}

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
		setApiError("");
	};

	const validate = () => {
		const newErrors = {};
		if (!formData.title.trim()) {
			newErrors.title = "Title is required";
		}
		if (!formData.description.trim()) {
			newErrors.description = "Description is required";
		}
		if (!formData.category) {
			newErrors.category = "Please select a category";
		}
		if (!formData.location.trim()) {
			newErrors.location = "Location is required";
		}
		return newErrors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = validate();
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setLoading(true);
		setApiError("");

		try {
			const issueData = {
				title: formData.title,
				description: formData.description,
				category: formData.category,
				urgency_level: formData.urgency,
				location: formData.location,
				area: formData.area || undefined,
				latitude: coords.latitude,
				longitude: coords.longitude,
				is_anonymous: formData.is_anonymous,
			};

			const response = await IssueService.createIssue(issueData, images);

			if (response.success) {
				// Navigate to feed with success message
				router.push("/feed?reported=true");
			} else {
				setApiError(
					response.error ||
						"Failed to submit report. Please try again."
				);
			}
		} catch (error) {
			console.error("Submit error:", error);
			setApiError("An unexpected error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleGetLocation = () => {
		if (!navigator.geolocation) {
			setApiError("Geolocation is not supported by your browser.");
			return;
		}

		// Show loading state while getting location
		setApiError("");

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setCoords({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				});
				// In real app, we'd reverse geocode this
				setFormData((prev) => ({
					...prev,
					location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
				}));
			},
			(error) => {
				// Handle specific geolocation errors
				let errorMessage =
					"Unable to get your location. Please enter it manually.";

				switch (error.code) {
					case error.PERMISSION_DENIED:
						errorMessage =
							"Location permission denied. Please allow location access in your browser settings.";
						break;
					case error.POSITION_UNAVAILABLE:
						errorMessage =
							"Location information is unavailable. Please enter it manually.";
						break;
					case error.TIMEOUT:
						errorMessage =
							"Location request timed out. Please try again.";
						break;
				}

				console.error("Geolocation error:", error.code, error.message);
				setApiError(errorMessage);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			}
		);
	};

	return (
		<div className='min-h-screen bg-background-light dark:bg-background-dark'>
			<Header title='Report an Issue' showBackButton />

			<main className='max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6'>
				{/* Info Banner */}
				<div className='mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl'>
					<div className='flex items-start gap-3'>
						<span className='material-symbols-outlined text-primary'>
							info
						</span>
						<div>
							<p className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
								Tips for a good report
							</p>
							<ul className='text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1 list-disc list-inside'>
								<li>Add clear photos showing the issue</li>
								<li>Provide an accurate location</li>
								<li>Describe the problem in detail</li>
							</ul>
						</div>
					</div>
				</div>

				<form onSubmit={handleSubmit} className='space-y-6'>
					{apiError && (
						<div className='p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm'>
							{apiError}
						</div>
					)}

					{/* Images */}
					<ImageUploader
						images={images}
						onImagesChange={setImages}
						maxImages={5}
						label='Photos'
					/>

					{/* Title */}
					<Input
						label='Issue Title'
						name='title'
						placeholder='Brief description of the issue'
						value={formData.title}
						onChange={handleChange}
						error={errors.title}
						fullWidth
					/>

					{/* Description */}
					<Textarea
						label='Description'
						name='description'
						placeholder='Provide more details about the issue. What is the problem? How long has it been there?'
						value={formData.description}
						onChange={handleChange}
						error={errors.description}
						rows={4}
						fullWidth
					/>

					{/* Category & Urgency */}
					<div className='grid sm:grid-cols-2 gap-4'>
						<Select
							label='Category'
							name='category'
							placeholder='Select category'
							value={formData.category}
							onChange={handleChange}
							error={errors.category}
							options={(categories || []).map((c) => ({
								value: c.id || c.slug || c.name,
								label: c.name,
							}))}
							loading={categoriesLoading}
							fullWidth
						/>

						<Select
							label='Urgency Level'
							name='urgency'
							value={formData.urgency}
							onChange={handleChange}
							options={urgencyLevels.map((u) => ({
								value: u.id,
								label: u.name,
							}))}
							fullWidth
						/>
					</div>

					{/* Location */}
					<div>
						<Input
							label='Location'
							name='location'
							placeholder='Enter the address or location'
							value={formData.location}
							onChange={handleChange}
							error={errors.location}
							icon='location_on'
							fullWidth
						/>
						<button
							type='button'
							onClick={handleGetLocation}
							className='mt-2 flex items-center gap-2 text-sm text-primary hover:underline'
						>
							<span className='material-symbols-outlined text-lg'>
								my_location
							</span>
							Use my current location
						</button>
					</div>

					{/* Area (Optional) */}
					<Select
						label='Area (Optional)'
						name='area'
						placeholder='Select area if known'
						value={formData.area}
						onChange={handleChange}
						options={(areas || []).map((a) => ({
							value: a.id || a.slug || a.name,
							label: a.name,
						}))}
						loading={areasLoading}
						fullWidth
					/>

					{/* Anonymous Checkbox */}
					<label className='flex items-center gap-3 cursor-pointer'>
						<input
							type='checkbox'
							name='is_anonymous'
							checked={formData.is_anonymous}
							onChange={handleChange}
							className='w-4 h-4 text-primary rounded border-border-light dark:border-border-dark focus:ring-primary'
						/>
						<span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
							Submit anonymously (your name won't be shown)
						</span>
					</label>

					{/* Submit */}
					<div className='flex gap-4 pt-4'>
						<Button
							type='button'
							variant='outline'
							onClick={() => router.back()}
							className='flex-1'
						>
							Cancel
						</Button>
						<Button
							type='submit'
							loading={loading}
							className='flex-1'
						>
							<span className='material-symbols-outlined mr-2'>
								send
							</span>
							Submit Report
						</Button>
					</div>
				</form>
			</main>

			<BottomNavigation />
		</div>
	);
}
