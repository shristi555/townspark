"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header, BottomNavigation } from "../components/layout";
import {
	Input,
	Select,
	Button,
	Toggle,
	Card,
	Modal,
	Loader,
} from "../components/ui";
import { useTheme } from "../contexts/theme_context";
import { useAuth } from "../contexts/auth_context";
import { AuthService, UserService } from "../modules";

export default function SettingsPage() {
	const router = useRouter();
	const { isDarkMode, toggleTheme } = useTheme();
	const {
		user,
		isAuthenticated,
		isLoading: authLoading,
		logout,
		refreshUser,
	} = useAuth();

	const [notifications, setNotifications] = useState({
		email: true,
		push: true,
		statusUpdates: true,
		comments: true,
		mentions: true,
	});

	// Password change state
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [passwordData, setPasswordData] = useState({
		old_password: "",
		new_password: "",
		confirm_password: "",
	});
	const [passwordLoading, setPasswordLoading] = useState(false);
	const [passwordError, setPasswordError] = useState("");
	const [passwordSuccess, setPasswordSuccess] = useState(false);

	// Delete account state
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);

	// Redirect if not authenticated
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [authLoading, isAuthenticated, router]);

	const handlePasswordChange = async (e) => {
		e.preventDefault();
		setPasswordError("");
		setPasswordSuccess(false);

		if (passwordData.new_password !== passwordData.confirm_password) {
			setPasswordError("New passwords do not match");
			return;
		}

		if (passwordData.new_password.length < 8) {
			setPasswordError("Password must be at least 8 characters");
			return;
		}

		setPasswordLoading(true);
		try {
			const response = await AuthService.changePassword(
				passwordData.old_password,
				passwordData.new_password
			);

			if (response.success) {
				setPasswordSuccess(true);
				setPasswordData({
					old_password: "",
					new_password: "",
					confirm_password: "",
				});
				setTimeout(() => {
					setShowPasswordModal(false);
					setPasswordSuccess(false);
				}, 2000);
			} else {
				setPasswordError(
					response.message || "Failed to change password"
				);
			}
		} catch (error) {
			setPasswordError("An error occurred. Please try again.");
		} finally {
			setPasswordLoading(false);
		}
	};

	const handleSignOut = async () => {
		await logout();
		router.push("/login");
	};

	const handleDeleteAccount = async () => {
		setDeleteLoading(true);
		try {
			// Note: The API might need a delete account endpoint
			// For now, we'll just sign out
			await logout();
			router.push("/login");
		} catch (error) {
			console.error("Failed to delete account:", error);
		} finally {
			setDeleteLoading(false);
			setShowDeleteModal(false);
		}
	};

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
				{/* Loading State */}
				{authLoading && (
					<div className='flex justify-center py-8'>
						<Loader size='lg' />
					</div>
				)}

				{!authLoading && user && (
					<>
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
											{user.full_name || user.username}
										</p>
										<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
											{user.email}
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
									onClick={() => setShowPasswordModal(true)}
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
								<button
									onClick={handleSignOut}
									className='w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left'
								>
									<div className='flex items-center gap-3'>
										<span className='material-symbols-outlined text-red-500'>
											logout
										</span>
										<span className='text-red-500'>
											Sign Out
										</span>
									</div>
								</button>
								<button
									onClick={() => setShowDeleteModal(true)}
									className='w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left'
								>
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
					</>
				)}
			</main>

			{/* Password Change Modal */}
			{showPasswordModal && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
					<Card className='w-full max-w-md p-6'>
						<div className='flex items-center justify-between mb-6'>
							<h2 className='text-xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
								Change Password
							</h2>
							<button
								onClick={() => {
									setShowPasswordModal(false);
									setPasswordError("");
									setPasswordSuccess(false);
									setPasswordData({
										old_password: "",
										new_password: "",
										confirm_password: "",
									});
								}}
								className='text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
							>
								<span className='material-symbols-outlined'>
									close
								</span>
							</button>
						</div>

						{passwordSuccess ? (
							<div className='text-center py-4'>
								<span className='material-symbols-outlined text-green-500 text-5xl mb-4'>
									check_circle
								</span>
								<p className='text-text-primary-light dark:text-text-primary-dark'>
									Password changed successfully!
								</p>
							</div>
						) : (
							<form
								onSubmit={handlePasswordChange}
								className='space-y-4'
							>
								{passwordError && (
									<div className='p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm'>
										{passwordError}
									</div>
								)}

								<Input
									type='password'
									label='Current Password'
									placeholder='Enter current password'
									value={passwordData.old_password}
									onChange={(e) =>
										setPasswordData((prev) => ({
											...prev,
											old_password: e.target.value,
										}))
									}
									required
								/>

								<Input
									type='password'
									label='New Password'
									placeholder='Enter new password'
									value={passwordData.new_password}
									onChange={(e) =>
										setPasswordData((prev) => ({
											...prev,
											new_password: e.target.value,
										}))
									}
									required
								/>

								<Input
									type='password'
									label='Confirm New Password'
									placeholder='Confirm new password'
									value={passwordData.confirm_password}
									onChange={(e) =>
										setPasswordData((prev) => ({
											...prev,
											confirm_password: e.target.value,
										}))
									}
									required
								/>

								<div className='flex gap-3 pt-2'>
									<Button
										type='button'
										variant='outline'
										className='flex-1'
										onClick={() => {
											setShowPasswordModal(false);
											setPasswordError("");
											setPasswordData({
												old_password: "",
												new_password: "",
												confirm_password: "",
											});
										}}
									>
										Cancel
									</Button>
									<Button
										type='submit'
										className='flex-1'
										disabled={passwordLoading}
									>
										{passwordLoading
											? "Changing..."
											: "Change Password"}
									</Button>
								</div>
							</form>
						)}
					</Card>
				</div>
			)}

			{/* Delete Account Confirmation Modal */}
			{showDeleteModal && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
					<Card className='w-full max-w-md p-6'>
						<div className='text-center'>
							<span className='material-symbols-outlined text-red-500 text-5xl mb-4'>
								warning
							</span>
							<h2 className='text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2'>
								Delete Account
							</h2>
							<p className='text-text-secondary-light dark:text-text-secondary-dark mb-6'>
								Are you sure you want to delete your account?
								This action cannot be undone.
							</p>
							<div className='flex gap-3'>
								<Button
									variant='outline'
									className='flex-1'
									onClick={() => setShowDeleteModal(false)}
								>
									Cancel
								</Button>
								<Button
									variant='primary'
									className='flex-1 bg-red-500 hover:bg-red-600'
									onClick={handleDeleteAccount}
									disabled={deleteLoading}
								>
									{deleteLoading
										? "Deleting..."
										: "Delete Account"}
								</Button>
							</div>
						</div>
					</Card>
				</div>
			)}

			<BottomNavigation />
		</div>
	);
}
