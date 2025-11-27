"use client";

import Link from "next/link";
import { Avatar, Badge } from "../ui";

export default function IssueCard({
	issue,
	variant = "default", // default, compact, detailed
	showAuthor = true,
	showActions = true,
	onClick,
	className = "",
}) {
	const {
		id,
		title,
		description,
		status,
		category,
		location,
		images,
		author,
		upvotes,
		comments,
		createdAt,
		urgency,
	} = issue;

	// Handle location being either an object or string
	const locationText =
		typeof location === "object"
			? location?.address || location?.area
			: location;

	const CardWrapper = onClick ? "div" : Link;
	const cardProps = onClick
		? { onClick, role: "button", tabIndex: 0 }
		: { href: `/issue/${id}` };

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return date.toLocaleDateString();
	};

	if (variant === "compact") {
		return (
			<CardWrapper
				{...cardProps}
				className={`flex items-center gap-3 p-3 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark hover:shadow-md transition-shadow cursor-pointer ${className}`}
			>
				{images?.[0] && (
					<div
						className='size-12 bg-center bg-cover bg-no-repeat rounded-lg shrink-0'
						style={{ backgroundImage: `url("${images[0]}")` }}
					/>
				)}
				<div className='flex-1 min-w-0'>
					<p className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate'>
						{title}
					</p>
					<p className='text-xs text-text-secondary-light dark:text-text-secondary-dark truncate'>
						{locationText}
					</p>
				</div>
				<Badge status={status} size='sm' />
			</CardWrapper>
		);
	}

	return (
		<CardWrapper
			{...cardProps}
			className={`block bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow cursor-pointer overflow-hidden ${className}`}
		>
			{/* Author Header */}
			{showAuthor && author && (
				<div className='flex items-center gap-3 p-4 pb-2'>
					<Avatar src={author.avatar} name={author.name} size='sm' />
					<div className='flex-1 min-w-0'>
						<p className='text-sm font-semibold text-text-primary-light dark:text-text-primary-dark truncate'>
							{author.name}
						</p>
						<p className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
							{formatDate(createdAt)}
						</p>
					</div>
					<Badge status={status} size='sm' />
				</div>
			)}

			{/* Image */}
			{images?.[0] && (
				<div
					className='w-full aspect-video bg-center bg-cover bg-no-repeat'
					style={{ backgroundImage: `url("${images[0]}")` }}
				/>
			)}

			{/* Content */}
			<div className='p-4'>
				{/* Category & Urgency */}
				<div className='flex items-center gap-2 mb-2'>
					{category && (
						<span className='text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full'>
							{category}
						</span>
					)}
					{urgency && urgency !== "normal" && (
						<span
							className={`text-xs font-medium px-2 py-0.5 rounded-full ${
								urgency === "critical"
									? "text-red-600 bg-red-100 dark:bg-red-900/30"
									: urgency === "high"
										? "text-orange-600 bg-orange-100 dark:bg-orange-900/30"
										: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
							}`}
						>
							{urgency.charAt(0).toUpperCase() + urgency.slice(1)}
						</span>
					)}
				</div>

				{/* Title */}
				<h3 className='text-base font-bold text-text-primary-light dark:text-text-primary-dark leading-tight mb-1'>
					{title}
				</h3>

				{/* Description */}
				{description && variant === "detailed" && (
					<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2 mb-2'>
						{description}
					</p>
				)}

				{/* Location */}
				{locationText && (
					<div className='flex items-center gap-1 text-text-secondary-light dark:text-text-secondary-dark mb-3'>
						<span className='material-symbols-outlined text-sm'>
							location_on
						</span>
						<span className='text-xs truncate'>{locationText}</span>
					</div>
				)}

				{/* Actions */}
				{showActions && (
					<div className='flex items-center gap-4 pt-2 border-t border-border-light dark:border-border-dark'>
						<button className='flex items-center gap-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors'>
							<span className='material-symbols-outlined text-lg'>
								thumb_up
							</span>
							<span className='text-sm font-medium'>
								{upvotes || 0}
							</span>
						</button>
						<button className='flex items-center gap-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors'>
							<span className='material-symbols-outlined text-lg'>
								chat_bubble
							</span>
							<span className='text-sm font-medium'>
								{comments || 0}
							</span>
						</button>
						<button className='flex items-center gap-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors ml-auto'>
							<span className='material-symbols-outlined text-lg'>
								share
							</span>
						</button>
						<button className='flex items-center gap-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors'>
							<span className='material-symbols-outlined text-lg'>
								bookmark
							</span>
						</button>
					</div>
				)}
			</div>
		</CardWrapper>
	);
}
