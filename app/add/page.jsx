"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, BottomNavigation } from "../components/layout";
import {
	Button,
	Input,
	Textarea,
	Select,
	ImageUploader,
} from "../components/ui";
import { categories, urgencyLevels, departments } from "../data/dummy_data";

export default function ReportIssuePage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [images, setImages] = useState([]);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		urgency: "normal",
		location: "",
		department: "",
	});
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
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
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setLoading(false);

		// Navigate to feed with success message
		router.push("/feed?reported=true");
	};

	const handleGetLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					// In real app, we'd reverse geocode this
					setFormData((prev) => ({
						...prev,
						location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
					}));
				},
				(error) => {
					console.error("Error getting location:", error);
				}
			);
		}
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
							options={categories.map((c) => ({
								value: c.id,
								label: c.name,
							}))}
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

					{/* Department (Optional) */}
					<Select
						label='Relevant Department (Optional)'
						name='department'
						placeholder='Select department if known'
						value={formData.department}
						onChange={handleChange}
						options={departments.map((d) => ({
							value: d.id,
							label: d.name,
						}))}
						fullWidth
					/>

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
