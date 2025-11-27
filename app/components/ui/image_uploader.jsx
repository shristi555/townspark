"use client";

import { useRef } from "react";

export default function ImageUploader({
	images = [],
	maxImages = 5,
	onImagesChange,
	label,
	className = "",
}) {
	const fileInputRef = useRef(null);

	const handleFileSelect = (e) => {
		const files = Array.from(e.target.files);
		const remainingSlots = maxImages - images.length;

		if (files.length > remainingSlots) {
			alert(`You can only add ${remainingSlots} more image(s)`);
		}

		const newFiles = files.slice(0, remainingSlots);
		const newImages = newFiles.map((file) => ({
			id: Date.now() + Math.random(),
			file,
			preview: URL.createObjectURL(file),
		}));

		onImagesChange?.([...images, ...newImages]);
	};

	const removeImage = (id) => {
		const filtered = images.filter((img) => img.id !== id);
		onImagesChange?.(filtered);
	};

	return (
		<div className={className}>
			{label && (
				<p className='text-text-primary-light dark:text-text-primary-dark text-base font-medium leading-normal pb-2'>
					{label} (up to {maxImages})
				</p>
			)}
			<div className='grid grid-cols-4 sm:grid-cols-5 gap-2'>
				{/* Existing images */}
				{images.map((image) => (
					<div key={image.id} className='relative aspect-square'>
						<div
							className='w-full h-full bg-center bg-no-repeat bg-cover rounded-lg'
							style={{
								backgroundImage: `url("${image.preview || image.url}")`,
							}}
						/>
						<button
							type='button'
							onClick={() => removeImage(image.id)}
							className='absolute -top-1 -right-1 size-5 bg-status-reported text-white rounded-full flex items-center justify-center shadow-md'
						>
							<span className='material-symbols-outlined text-sm'>
								close
							</span>
						</button>
					</div>
				))}
				{/* Add button */}
				{images.length < maxImages && (
					<button
						type='button'
						onClick={() => fileInputRef.current?.click()}
						className='aspect-square flex items-center justify-center rounded-lg border-2 border-dashed border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark bg-black/5 dark:bg-white/5 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors'
					>
						<span className='material-symbols-outlined text-2xl'>
							add_a_photo
						</span>
					</button>
				)}
			</div>
			<input
				ref={fileInputRef}
				type='file'
				accept='image/*'
				multiple
				onChange={handleFileSelect}
				className='hidden'
			/>
		</div>
	);
}

export function FileDropzone({
	onFileSelect,
	accept = "image/*,application/pdf",
	label = "Upload File",
	description = "Click to upload or drag and drop",
	subDescription = "PDF, PNG, or JPG",
	className = "",
}) {
	const fileInputRef = useRef(null);

	return (
		<div className={className}>
			{label && (
				<p className='text-text-primary-light dark:text-text-primary-dark text-base font-medium leading-normal pb-2'>
					{label}
				</p>
			)}
			<label
				className='flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg cursor-pointer bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors'
				onClick={() => fileInputRef.current?.click()}
			>
				<div className='flex flex-col items-center justify-center py-5'>
					<span className='material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark mb-2 text-2xl'>
						cloud_upload
					</span>
					<p className='mb-1 text-sm text-text-secondary-light dark:text-text-secondary-dark'>
						<span className='font-semibold'>{description}</span>
					</p>
					<p className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
						{subDescription}
					</p>
				</div>
				<input
					ref={fileInputRef}
					type='file'
					accept={accept}
					className='hidden'
					onChange={(e) => onFileSelect?.(e.target.files[0])}
				/>
			</label>
		</div>
	);
}
