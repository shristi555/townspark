"use client";

import { useState } from "react";
import { Header, BottomNavigation } from "../components/layout";
import { NotificationList } from "../components/features";
import { Tabs, TabPanel } from "../components/ui";
import { notifications } from "../data/dummy_data";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("all");

	const unreadNotifications = notifications.filter((n) => !n.read);
	const readNotifications = notifications.filter((n) => n.read);

	const tabs = [
		{ id: "all", label: "All", count: notifications.length },
		{ id: "unread", label: "Unread", count: unreadNotifications.length },
	];

	const handleNotificationClick = (notification) => {
		// Navigate to related issue if exists
		if (notification.issue) {
			router.push(`/issue/${notification.issue.id}`);
		}
	};

	const getFilteredNotifications = () => {
		if (activeTab === "unread") {
			return unreadNotifications;
		}
		return notifications;
	};

	return (
		<div className='min-h-screen bg-background-light dark:bg-background-dark'>
			<Header title='Notifications' showBackButton />

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
						onNotificationClick={handleNotificationClick}
					/>
				</TabPanel>

				<TabPanel id='unread' activeTab={activeTab}>
					<NotificationList
						notifications={getFilteredNotifications()}
						onNotificationClick={handleNotificationClick}
					/>
				</TabPanel>
			</main>

			<BottomNavigation />
		</div>
	);
}
