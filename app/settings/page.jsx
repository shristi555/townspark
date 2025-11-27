"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, BottomNavigation } from "../components/layout";
import { Input, Select, Button, Toggle, Card } from "../components/ui";
import { useTheme } from "../contexts/theme_context";
import { currentUser } from "../data/dummy_data";

export default function SettingsPage() {
	const router = useRouter();
	const { isDarkMode, toggleTheme } = useTheme();
	const [notifications, setNotifications] = useState({
		email: true,
		push: true,
		statusUpdates: true,
		comments: true,
		mentions: true,
	});

	const settingsSections = [
		{
			title: "Appearance",
			icon: "palette",
			settings: [
				{
					id: "darkMode",
					label: "Dark Mode",
					description: "Use dark theme for the app",
					type: "toggle",
					value: isDarkMode,
					onChange: toggleTheme,
				},
			],
		},
		{
			title: "Notifications",
			icon: "notifications",
			settings: [
				{
					id: "email",
					label: "Email Notifications",
					description: "Receive email updates about your issues",
					type: "toggle",
					value: notifications.email,
					onChange: () =>
						setNotifications((prev) => ({
							...prev,
							email: !prev.email,
						})),
				},
				{
					id: "push",
					label: "Push Notifications",
					description: "Receive push notifications on your device",
					type: "toggle",
					value: notifications.push,
					onChange: () =>
						setNotifications((prev) => ({
							...prev,
							push: !prev.push,
						})),
				},
				{
					id: "statusUpdates",
					label: "Status Updates",
					description: "Get notified when your issue status changes",
					type: "toggle",
					value: notifications.statusUpdates,
					onChange: () =>
						setNotifications((prev) => ({
							...prev,
							statusUpdates: !prev.statusUpdates,
						})),
				},
				{
					id: "comments",
					label: "Comments",
					description:
						"Get notified about new comments on your issues",
					type: "toggle",
					value: notifications.comments,
					onChange: () =>
						setNotifications((prev) => ({
							...prev,
							comments: !prev.comments,
						})),
				},
				{
					id: "mentions",
					label: "Mentions",
					description: "Get notified when someone mentions you",
					type: "toggle",
					value: notifications.mentions,
					onChange: () =>
						setNotifications((prev) => ({
							...prev,
							mentions: !prev.mentions,
						})),
				},
			],
		},
	];

	return (
		<div className='min-h-screen bg-background-light dark:bg-background-dark pb-20 md:pb-0'>
			<Header title='Settings' showBackButton backHref='/profile' />

			<main className='max-w-2xl mx-auto px-4 py-6'>
				{/* Account Section */}
				<Card className='p-4 mb-6'>
					<div className='flex items-center gap-3 mb-4'>
						<span className='material-symbols-outlined text-primary'>
							account_circle
						</span>
						<h2 className='font-semibold text-text-primary-light dark:text-text-primary-dark'>
							Account
						</h2>
					</div>
					<div className='space-y-4'>
						<div className='flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg'>
							<div>
								<p className='font-medium text-text-primary-light dark:text-text-primary-dark'>
									{currentUser.name}
								</p>
								<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
									{currentUser.email}
								</p>
							</div>
							<Button
								variant='outline'
								size='sm'
								onClick={() => router.push("/profile")}
							>
								Edit
							</Button>
						</div>
						<button
							onClick={() => router.push("/login")}
							className='w-full flex items-center justify-between p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left'
						>
							<div className='flex items-center gap-3'>
								<span className='material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark'>
									lock
								</span>
								<span className='text-text-primary-light dark:text-text-primary-dark'>
									Change Password
								</span>
							</div>
							<span className='material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark'>
								chevron_right
							</span>
						</button>
					</div>
				</Card>

				{/* Settings Sections */}
				{settingsSections.map((section) => (
					<Card key={section.title} className='p-4 mb-6'>
						<div className='flex items-center gap-3 mb-4'>
							<span className='material-symbols-outlined text-primary'>
								{section.icon}
							</span>
							<h2 className='font-semibold text-text-primary-light dark:text-text-primary-dark'>
								{section.title}
							</h2>
						</div>
						<div className='space-y-1'>
							{section.settings.map((setting) => (
								<div
									key={setting.id}
									className='flex items-center justify-between p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors'
								>
									<div className='flex-1 mr-4'>
										<p className='font-medium text-text-primary-light dark:text-text-primary-dark'>
											{setting.label}
										</p>
										<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
											{setting.description}
										</p>
									</div>
									{setting.type === "toggle" && (
										<Toggle
											checked={setting.value}
											onChange={setting.onChange}
										/>
									)}
								</div>
							))}
						</div>
					</Card>
				))}

				{/* Privacy & Security */}
				<Card className='p-4 mb-6'>
					<div className='flex items-center gap-3 mb-4'>
						<span className='material-symbols-outlined text-primary'>
							security
						</span>
						<h2 className='font-semibold text-text-primary-light dark:text-text-primary-dark'>
							Privacy & Security
						</h2>
					</div>
					<div className='space-y-1'>
						{[
							{
								label: "Privacy Policy",
								icon: "policy",
								href: "#",
							},
							{
								label: "Terms of Service",
								icon: "description",
								href: "#",
							},
							{
								label: "Data & Privacy",
								icon: "admin_panel_settings",
								href: "#",
							},
						].map((item) => (
							<button
								key={item.label}
								className='w-full flex items-center justify-between p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left'
							>
								<div className='flex items-center gap-3'>
									<span className='material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark'>
										{item.icon}
									</span>
									<span className='text-text-primary-light dark:text-text-primary-dark'>
										{item.label}
									</span>
								</div>
								<span className='material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark'>
									chevron_right
								</span>
							</button>
						))}
					</div>
				</Card>

				{/* Help & Support */}
				<Card className='p-4 mb-6'>
					<div className='flex items-center gap-3 mb-4'>
						<span className='material-symbols-outlined text-primary'>
							help
						</span>
						<h2 className='font-semibold text-text-primary-light dark:text-text-primary-dark'>
							Help & Support
						</h2>
					</div>
					<div className='space-y-1'>
						{[
							{
								label: "Help Center",
								icon: "help_center",
								href: "#",
							},
							{
								label: "Contact Support",
								icon: "support_agent",
								href: "#",
							},
							{
								label: "Report a Bug",
								icon: "bug_report",
								href: "#",
							},
							{
								label: "Send Feedback",
								icon: "feedback",
								href: "#",
							},
						].map((item) => (
							<button
								key={item.label}
								className='w-full flex items-center justify-between p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left'
							>
								<div className='flex items-center gap-3'>
									<span className='material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark'>
										{item.icon}
									</span>
									<span className='text-text-primary-light dark:text-text-primary-dark'>
										{item.label}
									</span>
								</div>
								<span className='material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark'>
									chevron_right
								</span>
							</button>
						))}
					</div>
				</Card>

				{/* App Info */}
				<Card className='p-4 mb-6'>
					<div className='flex items-center gap-3 mb-4'>
						<span className='material-symbols-outlined text-primary'>
							info
						</span>
						<h2 className='font-semibold text-text-primary-light dark:text-text-primary-dark'>
							About
						</h2>
					</div>
					<div className='space-y-3'>
						<div className='flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg'>
							<span className='text-text-secondary-light dark:text-text-secondary-dark'>
								Version
							</span>
							<span className='text-text-primary-light dark:text-text-primary-dark'>
								1.0.0
							</span>
						</div>
						<div className='flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg'>
							<span className='text-text-secondary-light dark:text-text-secondary-dark'>
								Build
							</span>
							<span className='text-text-primary-light dark:text-text-primary-dark'>
								2024.1
							</span>
						</div>
					</div>
				</Card>

				{/* Danger Zone */}
				<Card className='p-4 border-red-200 dark:border-red-900'>
					<div className='flex items-center gap-3 mb-4'>
						<span className='material-symbols-outlined text-red-500'>
							warning
						</span>
						<h2 className='font-semibold text-red-500'>
							Danger Zone
						</h2>
					</div>
					<div className='space-y-3'>
						<button className='w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left'>
							<div className='flex items-center gap-3'>
								<span className='material-symbols-outlined text-red-500'>
									logout
								</span>
								<span className='text-red-500'>Sign Out</span>
							</div>
						</button>
						<button className='w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left'>
							<div className='flex items-center gap-3'>
								<span className='material-symbols-outlined text-red-500'>
									delete_forever
								</span>
								<span className='text-red-500'>
									Delete Account
								</span>
							</div>
						</button>
					</div>
				</Card>
			</main>

			<BottomNavigation />
		</div>
	);
}
