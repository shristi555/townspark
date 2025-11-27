"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Header, BottomNavigation } from "../../components/layout";
import {
	CommentSection,
	StatusTimeline,
	ImageGallery,
} from "../../components/features";
import {
	Avatar,
	Badge,
	Button,
	Modal,
	Select,
	Textarea,
} from "../../components/ui";
import { issues, currentUser } from "../../data/dummy_data";

export default function IssueDetailPage() {
	const params = useParams();
	const issue = issues.find((i) => i.id === params.id) || issues[0];
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [upvoted, setUpvoted] = useState(false);
	const [bookmarked, setBookmarked] = useState(false);

	const isResolver =
		currentUser.role === "resolver" || currentUser.role === "admin";

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleUpvote = () => {
		setUpvoted(!upvoted);
	};

	const handleBookmark = () => {
		setBookmarked(!bookmarked);
	};

	return (
		<div className='min-h-screen bg-background-light dark:bg-background-dark'>
			<Header title='Issue Details' showBackButton />

			<main className='max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6'>
				<div className='grid lg:grid-cols-3 gap-6'>
					{/* Main Content */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Issue Header Card */}
						<div className='bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden'>
							{/* Author Info */}
							<div className='flex items-center gap-3 p-4 border-b border-border-light dark:border-border-dark'>
								<Avatar
									src={issue.author?.avatar}
									name={issue.author?.name}
									size='md'
								/>
								<div className='flex-1 min-w-0'>
									<p className='font-semibold text-text-primary-light dark:text-text-primary-dark'>
										{issue.author?.name}
									</p>
									<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
										Posted on {formatDate(issue.createdAt)}
									</p>
								</div>
								<Badge status={issue.status} />
							</div>

							{/* Images */}
							{issue.images?.length > 0 && (
								<div className='p-4 border-b border-border-light dark:border-border-dark'>
									<ImageGallery images={issue.images} />
								</div>
							)}

							{/* Content */}
							<div className='p-4'>
								{/* Tags */}
								<div className='flex items-center gap-2 flex-wrap mb-3'>
									{issue.category && (
										<span className='text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full'>
											{issue.category}
										</span>
									)}
									{issue.urgency &&
										issue.urgency !== "normal" && (
											<span
												className={`text-xs font-medium px-2.5 py-1 rounded-full ${
													issue.urgency === "critical"
														? "text-red-600 bg-red-100 dark:bg-red-900/30"
														: issue.urgency ===
															  "high"
															? "text-orange-600 bg-orange-100 dark:bg-orange-900/30"
															: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
												}`}
											>
												{issue.urgency
													.charAt(0)
													.toUpperCase() +
													issue.urgency.slice(1)}{" "}
												Priority
											</span>
										)}
								</div>

								{/* Title */}
								<h1 className='text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-3'>
									{issue.title}
								</h1>

								{/* Description */}
								<p className='text-text-secondary-light dark:text-text-secondary-dark leading-relaxed'>
									{issue.description}
								</p>

								{/* Location */}
								{issue.location && (
									<div className='flex items-center gap-2 mt-4 p-3 bg-background-light dark:bg-background-dark rounded-lg'>
										<span className='material-symbols-outlined text-primary'>
											location_on
										</span>
										<span className='text-sm text-text-primary-light dark:text-text-primary-dark'>
											{typeof issue.location === "object"
												? issue.location.address ||
													issue.location.area
												: issue.location}
										</span>
										<button className='ml-auto text-primary text-sm hover:underline'>
											View on Map
										</button>
									</div>
								)}
							</div>

							{/* Actions */}
							<div className='flex items-center gap-2 px-4 py-3 border-t border-border-light dark:border-border-dark'>
								<button
									onClick={handleUpvote}
									className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
										upvoted
											? "bg-primary/10 text-primary"
											: "hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary-light dark:text-text-secondary-dark"
									}`}
								>
									<span
										className='material-symbols-outlined'
										style={{
											fontVariationSettings: upvoted
												? "'FILL' 1"
												: "'FILL' 0",
										}}
									>
										thumb_up
									</span>
									<span className='text-sm font-medium'>
										{(issue.upvotes || 0) +
											(upvoted ? 1 : 0)}
									</span>
								</button>

								<button className='flex items-center gap-2 px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary-light dark:text-text-secondary-dark transition-colors'>
									<span className='material-symbols-outlined'>
										chat_bubble
									</span>
									<span className='text-sm font-medium'>
										{issue.comments || 0}
									</span>
								</button>

								<div className='flex-1' />

								<button className='flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary-light dark:text-text-secondary-dark transition-colors'>
									<span className='material-symbols-outlined'>
										share
									</span>
								</button>

								<button
									onClick={handleBookmark}
									className={`flex items-center justify-center size-10 rounded-full transition-colors ${
										bookmarked
											? "text-primary"
											: "hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary-light dark:text-text-secondary-dark"
									}`}
								>
									<span
										className='material-symbols-outlined'
										style={{
											fontVariationSettings: bookmarked
												? "'FILL' 1"
												: "'FILL' 0",
										}}
									>
										bookmark
									</span>
								</button>
							</div>
						</div>

						{/* Comments Section */}
						<div className='bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4'>
							<h2 className='text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4'>
								Comments
							</h2>
							<CommentSection
								comments={issue.commentsList || []}
								currentUser={currentUser}
								onAddComment={(comment) =>
									console.log("Add comment:", comment)
								}
							/>
						</div>
					</div>

					{/* Sidebar */}
					<div className='space-y-6'>
						{/* Resolver Actions */}
						{isResolver && (
							<div className='bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4'>
								<h3 className='font-semibold text-text-primary-light dark:text-text-primary-dark mb-4'>
									Resolver Actions
								</h3>
								<div className='space-y-3'>
									<Button
										fullWidth
										onClick={() => setShowUpdateModal(true)}
									>
										<span className='material-symbols-outlined mr-2'>
											edit_note
										</span>
										Update Status
									</Button>
									<Button variant='outline' fullWidth>
										<span className='material-symbols-outlined mr-2'>
											assignment_ind
										</span>
										Assign to Team
									</Button>
								</div>
							</div>
						)}

						{/* Status Timeline */}
						<div className='bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4'>
							<StatusTimeline
								currentStatus={issue.status}
								updates={issue.statusUpdates || []}
							/>
						</div>

						{/* Issue Info */}
						<div className='bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4'>
							<h3 className='font-semibold text-text-primary-light dark:text-text-primary-dark mb-4'>
								Issue Information
							</h3>
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
										Issue ID
									</span>
									<span className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
										#{issue.id}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
										Department
									</span>
									<span className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
										{issue.department || "Unassigned"}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
										Assigned To
									</span>
									<span className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
										{issue.assignedTo || "Unassigned"}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* Update Status Modal */}
			<UpdateStatusModal
				isOpen={showUpdateModal}
				onClose={() => setShowUpdateModal(false)}
				currentStatus={issue.status}
			/>

			<BottomNavigation />
		</div>
	);
}

function UpdateStatusModal({ isOpen, onClose, currentStatus }) {
	const [status, setStatus] = useState(currentStatus);
	const [message, setMessage] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Update status:", { status, message });
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Update Issue Status'
			size='md'
		>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<Select
					label='New Status'
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					options={[
						{ value: "reported", label: "Reported" },
						{ value: "acknowledged", label: "Acknowledged" },
						{ value: "in-progress", label: "In Progress" },
						{ value: "resolved", label: "Resolved" },
					]}
					fullWidth
				/>

				<Textarea
					label='Update Message'
					placeholder='Add a message about this status update...'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					rows={3}
					fullWidth
				/>

				<div className='flex gap-3 pt-4'>
					<Button
						type='button'
						variant='outline'
						onClick={onClose}
						className='flex-1'
					>
						Cancel
					</Button>
					<Button type='submit' className='flex-1'>
						Update Status
					</Button>
				</div>
			</form>
		</Modal>
	);
}
