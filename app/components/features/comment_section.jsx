"use client";

import { useState } from "react";
import { Avatar, Button, Badge } from "../ui";

export default function CommentSection({
	comments = [],
	onAddComment,
	currentUser,
	className = "",
}) {
	const [newComment, setNewComment] = useState("");
	const [replyingTo, setReplyingTo] = useState(null);

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

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		onAddComment?.({
			content: newComment,
			replyTo: replyingTo,
		});
		setNewComment("");
		setReplyingTo(null);
	};

	const Comment = ({ comment, isReply = false }) => (
		<div className={`flex gap-3 ${isReply ? "ml-12" : ""}`}>
			<Avatar
				src={comment.author?.avatar}
				name={comment.author?.name}
				size={isReply ? "xs" : "sm"}
			/>
			<div className='flex-1 min-w-0'>
				<div className='flex items-center gap-2 flex-wrap'>
					<span className='text-sm font-semibold text-text-primary-light dark:text-text-primary-dark'>
						{comment.author?.name || "Anonymous"}
					</span>
					{comment.author?.isResolver && (
						<Badge status='acknowledged' size='sm'>
							Resolver
						</Badge>
					)}
					{comment.author?.isAdmin && (
						<Badge size='sm' className='bg-purple-500 text-white'>
							Admin
						</Badge>
					)}
					<span className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
						{formatDate(comment.createdAt)}
					</span>
				</div>
				<p className='text-sm text-text-primary-light dark:text-text-primary-dark mt-1'>
					{comment.content}
				</p>
				<div className='flex items-center gap-4 mt-2'>
					<button className='flex items-center gap-1 text-xs text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors'>
						<span className='material-symbols-outlined text-sm'>
							thumb_up
						</span>
						<span>{comment.likes || 0}</span>
					</button>
					<button
						onClick={() => setReplyingTo(comment.id)}
						className='text-xs text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors'
					>
						Reply
					</button>
				</div>

				{/* Replies */}
				{comment.replies?.length > 0 && (
					<div className='flex flex-col gap-3 mt-3'>
						{comment.replies.map((reply) => (
							<Comment key={reply.id} comment={reply} isReply />
						))}
					</div>
				)}
			</div>
		</div>
	);

	return (
		<div className={className}>
			{/* Comment Input */}
			<form onSubmit={handleSubmit} className='flex gap-3 mb-6'>
				<Avatar
					src={currentUser?.avatar}
					name={currentUser?.name}
					size='sm'
				/>
				<div className='flex-1'>
					{replyingTo && (
						<div className='flex items-center gap-2 text-xs text-text-secondary-light dark:text-text-secondary-dark mb-2'>
							<span>Replying to comment</span>
							<button
								type='button'
								onClick={() => setReplyingTo(null)}
								className='text-primary hover:underline'
							>
								Cancel
							</button>
						</div>
					)}
					<div className='flex gap-2'>
						<input
							type='text'
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder='Add a comment...'
							className='flex-1 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-full px-4 py-2 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary/50'
						/>
						<Button
							type='submit'
							size='sm'
							disabled={!newComment.trim()}
							className='rounded-full px-4'
						>
							Post
						</Button>
					</div>
				</div>
			</form>

			{/* Comments List */}
			<div className='flex flex-col gap-4'>
				{comments.length === 0 ? (
					<p className='text-center text-text-secondary-light dark:text-text-secondary-dark py-8'>
						No comments yet. Be the first to comment!
					</p>
				) : (
					comments.map((comment) => (
						<Comment key={comment.id} comment={comment} />
					))
				)}
			</div>
		</div>
	);
}
