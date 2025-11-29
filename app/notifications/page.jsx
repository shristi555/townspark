"use client";

import { useState, useEffect } from "react";
import { Header, BottomNavigation } from "../components/layout";
import { NotificationList } from "../components/features";
import { Tabs, TabPanel, Button, Loader } from "../components/ui";
import { useAuth } from "../contexts/auth_context";
import { useNotifications } from "../hooks";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
	const router = useRouter();
	const { isAuthenticated, loading: authLoading } = useAuth();
	const [activeTab, setActiveTab] = useState("all");

	// Fetch notifications from API
	const {
		notifications,
		unreadCount,
		loading,
		error,
		markAsRead,
		markAllAsRead,
		refetch,
	} = useNotifications();

	// Redirect if not authenticated
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [authLoading, isAuthenticated, router]);

	if (authLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark'>
				<Loader size='lg' />
			</div>
		);
	}

	const unreadNotifications = notifications.filter(
		(n) => !n.is_read && !n.read
	);
	const readNotifications = notifications.filter((n) => n.is_read || n.read);

	const tabs = [
		{ id: "all", label: "All", count: notifications.length },
		{ id: "unread", label: "Unread", count: unreadNotifications.length },
	];

	const handleNotificationClick = async (notification) => {
		// Mark as read if unread
		if (!notification.is_read && !notification.read) {
			await markAsRead(notification.id);
		}

		// Navigate to related issue if exists
		if (notification.issue?.id || notification.issue) {
			const issueId = notification.issue?.id || notification.issue;
			router.push(`/issue/${issueId}`);
		}
	};

	const handleMarkAllRead = async () => {
		await markAllAsRead();
	};

	const getFilteredNotifications = () => {
		if (activeTab === "unread") {
			return unreadNotifications;
		}
		return notifications;
	};

	return (
		<div className='min-h-screen bg-background-light dark:bg-background-dark'>
			<Header
				title='Notifications'
				showBackButton
				actions={
					unreadNotifications.length > 0 && (
						<Button
							variant='ghost'
							size='sm'
							onClick={handleMarkAllRead}
						>
							Mark all read
						</Button>
					)
				}
			/>

			<main className='max-w-2xl mx-auto pb-24 md:pb-6'>
				<div className='bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark'>
					<Tabs
						tabs={tabs}
						activeTab={activeTab}
						onChange={setActiveTab}
						className='px-4'
					/>
				</div>

				<TabPanel id='all' activeTab={activeTab}>
					<NotificationList
						notifications={getFilteredNotifications()}
						loading={loading}
						onNotificationClick={handleNotificationClick}
					/>
				</TabPanel>

				<TabPanel id='unread' activeTab={activeTab}>
					<NotificationList
						notifications={getFilteredNotifications()}
						loading={loading}
						onNotificationClick={handleNotificationClick}
					/>
				</TabPanel>
			</main>

			<BottomNavigation />
		</div>
	);
}
