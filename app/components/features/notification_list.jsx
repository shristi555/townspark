"use client";

import { useState } from "react";
import { NotificationItem } from "./notification_item";
import { EmptyState, Loader } from "../ui";

export function NotificationList({
	notifications = [],
	loading = false,
	onMarkAsRead,
	onMarkAllRead,
	emptyMessage = "No notifications yet",
	emptyDescription = "You'll see notifications here when there's activity on your issues.",
}) {
	const [filter, setFilter] = useState("all");

	const unreadCount = notifications.filter((n) => !n.read).length;

	const filteredNotifications = notifications.filter((notification) => {
		if (filter === "unread") return !notification.read;
		if (filter === "read") return notification.read;
		return true;
	});

	if (loading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<Loader size='lg' />
			</div>
		);
	}

	return (
		<div>
			{/* Header */}
			<div className='flex items-center justify-between mb-4'>
				<div className='flex items-center gap-2'>
					<button
						onClick={() => setFilter("all")}
						className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
							filter === "all"
								? "bg-primary text-white"
								: "bg-black/5 dark:bg-white/10 text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/10 dark:hover:bg-white/20"
						}`}
					>
						All
					</button>
					<button
						onClick={() => setFilter("unread")}
						className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
							filter === "unread"
								? "bg-primary text-white"
								: "bg-black/5 dark:bg-white/10 text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/10 dark:hover:bg-white/20"
						}`}
					>
						Unread ({unreadCount})
					</button>
					<button
						onClick={() => setFilter("read")}
						className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
							filter === "read"
								? "bg-primary text-white"
								: "bg-black/5 dark:bg-white/10 text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/10 dark:hover:bg-white/20"
						}`}
					>
						Read
					</button>
				</div>
				{unreadCount > 0 && onMarkAllRead && (
					<button
						onClick={onMarkAllRead}
						className='text-sm font-medium text-primary hover:text-primary/80 transition-colors'
					>
						Mark all as read
					</button>
				)}
			</div>

			{/* Notifications List */}
			{filteredNotifications.length === 0 ? (
				<EmptyState
					icon='notifications_off'
					title={
						filter === "unread"
							? "No unread notifications"
							: emptyMessage
					}
					description={
						filter === "unread"
							? "You're all caught up!"
							: emptyDescription
					}
				/>
			) : (
				<div className='space-y-2'>
					{filteredNotifications.map((notification) => (
						<NotificationItem
							key={notification.id}
							notification={notification}
							onClick={() => onMarkAsRead?.(notification.id)}
						/>
					))}
				</div>
			)}
		</div>
	);
}
