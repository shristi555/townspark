"use client";

import { useState } from "react";
import { Modal } from "../ui";

export default function ImageGallery({ images = [], className = "" }) {
	const [selectedIndex, setSelectedIndex] = useState(null);

	const openLightbox = (index) => setSelectedIndex(index);
	const closeLightbox = () => setSelectedIndex(null);

	const goToPrevious = () => {
		setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
	};

	const goToNext = () => {
		setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
	};

	if (images.length === 0) return null;

	return (
		<>
			{/* Gallery Grid */}
			<div className={`grid gap-2 ${className}`}>
				{images.length === 1 ? (
					<div
						className='w-full aspect-video bg-center bg-cover bg-no-repeat rounded-xl cursor-pointer hover:opacity-90 transition-opacity'
						style={{ backgroundImage: `url("${images[0]}")` }}
						onClick={() => openLightbox(0)}
					/>
				) : images.length === 2 ? (
					<div className='grid grid-cols-2 gap-2'>
						{images.map((img, idx) => (
							<div
								key={idx}
								className='aspect-square bg-center bg-cover bg-no-repeat rounded-xl cursor-pointer hover:opacity-90 transition-opacity'
								style={{ backgroundImage: `url("${img}")` }}
								onClick={() => openLightbox(idx)}
							/>
						))}
					</div>
				) : images.length === 3 ? (
					<div className='grid grid-cols-2 gap-2'>
						<div
							className='row-span-2 bg-center bg-cover bg-no-repeat rounded-xl cursor-pointer hover:opacity-90 transition-opacity'
							style={{ backgroundImage: `url("${images[0]}")` }}
							onClick={() => openLightbox(0)}
						/>
						{images.slice(1).map((img, idx) => (
							<div
								key={idx}
								className='aspect-square bg-center bg-cover bg-no-repeat rounded-xl cursor-pointer hover:opacity-90 transition-opacity'
								style={{ backgroundImage: `url("${img}")` }}
								onClick={() => openLightbox(idx + 1)}
							/>
						))}
					</div>
				) : (
					<div className='grid grid-cols-2 gap-2'>
						{images.slice(0, 4).map((img, idx) => (
							<div
								key={idx}
								className='relative aspect-square bg-center bg-cover bg-no-repeat rounded-xl cursor-pointer hover:opacity-90 transition-opacity'
								style={{ backgroundImage: `url("${img}")` }}
								onClick={() => openLightbox(idx)}
							>
								{idx === 3 && images.length > 4 && (
									<div className='absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center'>
										<span className='text-white text-2xl font-bold'>
											+{images.length - 4}
										</span>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Lightbox Modal */}
			<Modal
				isOpen={selectedIndex !== null}
				onClose={closeLightbox}
				size='full'
				className='bg-black/95'
			>
				<div className='relative w-full h-full flex items-center justify-center'>
					{/* Close Button */}
					<button
						onClick={closeLightbox}
						className='absolute top-4 right-4 size-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10'
					>
						<span className='material-symbols-outlined'>close</span>
					</button>

					{/* Navigation Arrows */}
					{images.length > 1 && (
						<>
							<button
								onClick={goToPrevious}
								className='absolute left-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors'
							>
								<span className='material-symbols-outlined'>
									chevron_left
								</span>
							</button>
							<button
								onClick={goToNext}
								className='absolute right-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors'
							>
								<span className='material-symbols-outlined'>
									chevron_right
								</span>
							</button>
						</>
					)}

					{/* Image */}
					{selectedIndex !== null && (
						<img
							src={images[selectedIndex]}
							alt={`Image ${selectedIndex + 1}`}
							className='max-w-full max-h-full object-contain'
						/>
					)}

					{/* Counter */}
					{images.length > 1 && (
						<div className='absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 rounded-full text-white text-sm'>
							{selectedIndex + 1} / {images.length}
						</div>
					)}

					{/* Thumbnails */}
					{images.length > 1 && (
						<div className='absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2'>
							{images.map((img, idx) => (
								<button
									key={idx}
									onClick={() => setSelectedIndex(idx)}
									className={`size-12 rounded-lg bg-center bg-cover bg-no-repeat transition-all ${
										idx === selectedIndex
											? "ring-2 ring-white scale-110"
											: "opacity-60 hover:opacity-100"
									}`}
									style={{ backgroundImage: `url("${img}")` }}
								/>
							))}
						</div>
					)}
				</div>
			</Modal>
		</>
	);
}
