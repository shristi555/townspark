"use client";

import { Avatar, Badge } from "../ui";

export function NotificationItem({ notification, onClick, className = "" }) {
	const { id, type, title, message, read, createdAt, actor, issue } =
		notification;

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

	const getIcon = () => {
		switch (type) {
			case "status_update":
				return "update";
			case "comment":
				return "chat_bubble";
			case "upvote":
				return "thumb_up";
			case "mention":
				return "alternate_email";
			case "resolution":
				return "check_circle";
			case "assignment":
				return "assignment_ind";
			case "system":
				return "info";
			default:
				return "notifications";
		}
	};

	const getIconColor = () => {
		switch (type) {
			case "status_update":
				return "text-blue-500";
			case "comment":
				return "text-green-500";
			case "upvote":
				return "text-red-500";
			case "mention":
				return "text-purple-500";
			case "resolution":
				return "text-status-resolved";
			case "assignment":
				return "text-orange-500";
			default:
				return "text-primary";
		}
	};

	return (
		<div
			onClick={() => onClick?.(notification)}
			className={`flex gap-3 p-4 cursor-pointer transition-colors ${
				read
					? "bg-card-light dark:bg-card-dark"
					: "bg-primary/5 dark:bg-primary/10"
			} hover:bg-black/5 dark:hover:bg-white/5 ${className}`}
		>
			{/* Icon or Avatar */}
			<div className='shrink-0'>
				{actor ? (
					<Avatar src={actor.avatar} name={actor.name} size='sm' />
				) : (
					<div
						className={`size-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center ${getIconColor()}`}
					>
						<span className='material-symbols-outlined text-xl'>
							{getIcon()}
						</span>
					</div>
				)}
			</div>

			{/* Content */}
			<div className='flex-1 min-w-0'>
				<div className='flex items-start justify-between gap-2'>
					<p
						className={`text-sm ${
							read
								? "text-text-primary-light dark:text-text-primary-dark"
								: "text-text-primary-light dark:text-text-primary-dark font-semibold"
						}`}
					>
						{title}
					</p>
					{!read && (
						<span className='size-2 rounded-full bg-primary shrink-0 mt-1.5' />
					)}
				</div>
				{message && (
					<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2 mt-0.5'>
						{message}
					</p>
				)}
				<div className='flex items-center gap-2 mt-1'>
					<span className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
						{formatDate(createdAt)}
					</span>
					{issue && (
						<>
							<span className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
								•
							</span>
							<span className='text-xs text-primary truncate max-w-[150px]'>
								{issue.title}
							</span>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
