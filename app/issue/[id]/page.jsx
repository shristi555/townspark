"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
	Loader,
} from "../../components/ui";
import { useAuth } from "../../contexts/auth_context";
import { useIssue, useComments, useIssueMutations } from "../../hooks";
import { ResolverService } from "../../modules/resolver";

export default function IssueDetailPage() {
	const params = useParams();
	const router = useRouter();
	const { user, isAuthenticated, loading: authLoading } = useAuth();

	// Fetch issue details
	const {
		issue,
		loading: issueLoading,
		error,
		refetch: refetchIssue,
		setIssue,
	} = useIssue(params.id);

	// Fetch comments
	const {
		comments,
		loading: commentsLoading,
		addComment,
		deleteComment,
		refetch: refetchComments,
	} = useComments(params.id);

	// Issue mutations
	const { upvote, removeUpvote, bookmark, removeBookmark } =
		useIssueMutations();

	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [upvoted, setUpvoted] = useState(false);
	const [bookmarked, setBookmarked] = useState(false);

	// Initialize upvote/bookmark state from issue data
	useEffect(() => {
		if (issue) {
			setUpvoted(issue.has_upvoted || false);
			setBookmarked(issue.has_bookmarked || false);
		}
	}, [issue]);

	const isResolver = user?.role === "resolver" || user?.role === "admin";

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleUpvote = async () => {
		if (!isAuthenticated) {
			router.push("/login");
			return;
		}

		try {
			if (upvoted) {
				const response = await removeUpvote(params.id);
				if (response.success) {
					setUpvoted(false);
					setIssue((prev) => ({
						...prev,
						upvotes_count: (prev?.upvotes_count || 1) - 1,
					}));
				}
			} else {
				const response = await upvote(params.id);
				if (response.success) {
					setUpvoted(true);
					setIssue((prev) => ({
						...prev,
						upvotes_count: (prev?.upvotes_count || 0) + 1,
					}));
				}
			}
		} catch (error) {
			console.error("Upvote error:", error);
		}
	};

	const handleBookmark = async () => {
		if (!isAuthenticated) {
			router.push("/login");
			return;
		}

		try {
			if (bookmarked) {
				const response = await removeBookmark(params.id);
				if (response.success) {
					setBookmarked(false);
				}
			} else {
				const response = await bookmark(params.id);
				if (response.success) {
					setBookmarked(true);
				}
			}
		} catch (error) {
			console.error("Bookmark error:", error);
		}
	};

	const handleAddComment = async (content) => {
		if (!isAuthenticated) {
			router.push("/login");
			return;
		}
		return addComment(content);
	};

	// Show loading state
	if (issueLoading || authLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark'>
				<Loader size='lg' />
			</div>
		);
	}

	// Show error state
	if (error || !issue) {
		return (
			<div className='min-h-screen bg-background-light dark:bg-background-dark'>
				<Header title='Issue Details' showBackButton />
				<div className='flex flex-col items-center justify-center p-12'>
					<span className='material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark mb-4'>
						error
					</span>
					<h2 className='text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2'>
						Issue Not Found
					</h2>
					<p className='text-text-secondary-light dark:text-text-secondary-dark mb-4'>
						{error ||
							"The issue you're looking for doesn't exist or has been removed."}
					</p>
					<Button onClick={() => router.push("/feed")}>
						Back to Feed
					</Button>
				</div>
			</div>
		);
	}

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
									src={
										issue.author?.profile_image ||
										issue.author?.avatar
									}
									name={
										issue.author?.full_name ||
										issue.author?.name ||
										"Anonymous"
									}
									size='md'
								/>
								<div className='flex-1 min-w-0'>
									<p className='font-semibold text-text-primary-light dark:text-text-primary-dark'>
										{issue.is_anonymous
											? "Anonymous"
											: issue.author?.full_name ||
												issue.author?.name}
									</p>
									<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
										Posted on{" "}
										{formatDate(
											issue.created_at || issue.createdAt
										)}
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
										{issue.upvotes_count ||
											issue.upvotes ||
											0}
									</span>
								</button>

								<button className='flex items-center gap-2 px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary-light dark:text-text-secondary-dark transition-colors'>
									<span className='material-symbols-outlined'>
										chat_bubble
									</span>
									<span className='text-sm font-medium'>
										{issue.comments_count ||
											issue.comments ||
											0}
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
								comments={comments || issue.commentsList || []}
								loading={commentsLoading}
								currentUser={user}
								onAddComment={handleAddComment}
								onDeleteComment={deleteComment}
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
								updates={
									issue.status_updates ||
									issue.statusUpdates ||
									[]
								}
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
										Category
									</span>
									<span className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
										{issue.category || "Uncategorized"}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
										Assigned To
									</span>
									<span className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
										{issue.assigned_to?.full_name ||
											issue.assignedTo ||
											"Unassigned"}
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
				issueId={issue.id}
				onSuccess={() => {
					setShowUpdateModal(false);
					refetchIssue();
				}}
			/>

			<BottomNavigation />
		</div>
	);
}

function UpdateStatusModal({
	isOpen,
	onClose,
	currentStatus,
	issueId,
	onSuccess,
}) {
	const [status, setStatus] = useState(currentStatus);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const response = await ResolverService.updateIssueStatus(issueId, {
				status,
				resolution_notes: message,
			});

			if (response.success) {
				onSuccess?.();
			} else {
				// Extract error message safely
				const errorMsg =
					response.errorMessage ||
					(typeof response.error === "string"
						? response.error
						: response.error?.message ||
							response.error?.detail ||
							"Failed to update status");
				setError(errorMsg);
			}
		} catch (err) {
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Update Issue Status'
			size='md'
		>
			<form onSubmit={handleSubmit} className='space-y-4'>
				{error && (
					<div className='p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm'>
						{error}
					</div>
				)}

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
						disabled={loading}
					>
						Cancel
					</Button>
					<Button type='submit' className='flex-1' loading={loading}>
						Update Status
					</Button>
				</div>
			</form>
		</Modal>
	);
}
