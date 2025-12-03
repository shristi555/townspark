"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { AuthGuard, useAuthStore } from "../z_internals/controllers/auth";
import { useTheme } from "../contexts/theme_context";
import Scaffold from "../components/scaffold";
import { Loader, Modal } from "../components/ui";
import toaster from "../z_internals/services/messages/toast/toaster";

// ============ Types ============
type SettingsSection =
	| "account"
	| "notifications"
	| "privacy"
	| "appearance"
	| "help";

interface NotificationSettings {
	inAppAlerts: boolean;
	emailNotifications: boolean;
	issueUpdates: boolean;
	newComments: boolean;
	weeklyDigest: boolean;
}

// ============ Toggle Switch Component ============
function ToggleSwitch({
	checked,
	onChange,
	disabled = false,
}: {
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
}) {
	return (
		<label className='relative inline-flex items-center cursor-pointer'>
			<input
				type='checkbox'
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				disabled={disabled}
				className='sr-only peer'
			/>
			<div
				className={`w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
			/>
		</label>
	);
}

// ============ Settings Navigation Item ============
function SettingsNavItem({
	icon,
	label,
	active,
	onClick,
}: {
	icon: string;
	label: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type='button'
			onClick={onClick}
			className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-colors ${
				active
					? "bg-primary/10 dark:bg-primary/20 text-primary"
					: "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
			}`}
		>
			<span
				className={`material-symbols-outlined text-xl ${active ? "text-primary" : ""}`}
				style={{
					fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
				}}
			>
				{icon}
			</span>
			<span className='text-sm font-medium'>{label}</span>
		</button>
	);
}

// ============ Card Component ============
function SettingsCard({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 ${className}`}
		>
			{children}
		</div>
	);
}

// ============ Settings Page Content ============
function SettingsPageContent() {
	const router = useRouter();
	const { theme, toggleTheme } = useTheme();
	const userInfo = useAuthStore((state) => state.userInfo);
	const updateProfile = useAuthStore((state) => state.updateProfile);
	const logout = useAuthStore((state) => state.logout);

	const [activeSection, setActiveSection] =
		useState<SettingsSection>("account");
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	// Form states
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [address, setAddress] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");

	// Notification settings
	const [notifications, setNotifications] = useState<NotificationSettings>({
		inAppAlerts: true,
		emailNotifications: false,
		issueUpdates: true,
		newComments: true,
		weeklyDigest: false,
	});

	useEffect(() => {
		if (userInfo) {
			setFullName(userInfo.fullName || "");
			setEmail(userInfo.email || "");
			setAddress(userInfo.address || "");
			setPhoneNumber(userInfo.phoneNumber || "");
		}
		setIsLoading(false);
	}, [userInfo]);

	const handleSaveProfile = async () => {
		setIsSaving(true);
		try {
			await updateProfile({
				full_name: fullName,
				address: address,
				phone_number: phoneNumber,
			});
			toaster.success("Profile updated successfully!");
		} catch {
			toaster.error("Failed to update profile. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeleteAccount = () => {
		// Just show the modal - functionality for future
		setShowDeleteModal(false);
		toaster.info("Account deletion will be available soon.");
	};

	const handleLogout = async () => {
		await logout();
		router.push("/login");
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-[60vh]'>
				<Loader />
			</div>
		);
	}

	return (
		<div className='flex flex-col lg:flex-row gap-6'>
			{/* Sidebar Navigation */}
			<aside className='lg:w-64 flex-shrink-0'>
				<div className='sticky top-24'>
					{/* User Info */}
					<div className='flex items-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800'>
						<div
							className='bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12'
							style={{
								backgroundImage: userInfo?.profileImage
									? `url("${userInfo.profileImage}")`
									: `url("https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.fullName || "User")}&background=0d83f2&color=fff")`,
							}}
						/>
						<div className='min-w-0'>
							<h2 className='text-base font-medium text-slate-900 dark:text-white truncate'>
								{userInfo?.fullName || "User"}
							</h2>
							<p className='text-sm text-slate-500 dark:text-slate-400 truncate'>
								{userInfo?.email || ""}
							</p>
						</div>
					</div>

					{/* Navigation */}
					<nav className='flex flex-col gap-1'>
						<SettingsNavItem
							icon='person'
							label='Account'
							active={activeSection === "account"}
							onClick={() => setActiveSection("account")}
						/>
						<SettingsNavItem
							icon='notifications'
							label='Notifications'
							active={activeSection === "notifications"}
							onClick={() => setActiveSection("notifications")}
						/>
						<SettingsNavItem
							icon='palette'
							label='Appearance'
							active={activeSection === "appearance"}
							onClick={() => setActiveSection("appearance")}
						/>
						<SettingsNavItem
							icon='shield'
							label='Privacy'
							active={activeSection === "privacy"}
							onClick={() => setActiveSection("privacy")}
						/>
						<SettingsNavItem
							icon='help_center'
							label='Help & Support'
							active={activeSection === "help"}
							onClick={() => setActiveSection("help")}
						/>
					</nav>

					{/* Logout Button */}
					<div className='mt-6 pt-6 border-t border-slate-200 dark:border-slate-800'>
						<button
							type='button'
							onClick={handleLogout}
							className='flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
						>
							<span className='material-symbols-outlined text-xl'>
								logout
							</span>
							<span className='text-sm font-medium'>
								Sign Out
							</span>
						</button>
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<main className='flex-1 max-w-3xl'>
				<header className='mb-8'>
					<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
						Settings
					</h1>
					<p className='text-slate-500 dark:text-slate-400 mt-1'>
						Manage your account, notifications, and preferences.
					</p>
				</header>

				{/* Account Section */}
				{activeSection === "account" && (
					<div className='flex flex-col gap-6'>
						<SettingsCard>
							<h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>
								Profile Information
							</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<label className='flex flex-col'>
									<span className='text-slate-700 dark:text-slate-300 text-sm font-medium pb-2'>
										Full Name
									</span>
									<input
										type='text'
										value={fullName}
										onChange={(e) =>
											setFullName(e.target.value)
										}
										className='form-input w-full rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal'
									/>
								</label>
								<label className='flex flex-col'>
									<span className='text-slate-700 dark:text-slate-300 text-sm font-medium pb-2'>
										Phone Number
									</span>
									<input
										type='tel'
										value={phoneNumber}
										onChange={(e) =>
											setPhoneNumber(e.target.value)
										}
										className='form-input w-full rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal'
										placeholder='Enter your phone number'
									/>
								</label>
							</div>
							<div className='mt-4'>
								<label className='flex flex-col'>
									<span className='text-slate-700 dark:text-slate-300 text-sm font-medium pb-2'>
										Email Address
									</span>
									<input
										type='email'
										value={email}
										disabled
										className='form-input w-full max-w-md rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal cursor-not-allowed opacity-70'
									/>
								</label>
							</div>
							<div className='mt-4'>
								<label className='flex flex-col'>
									<span className='text-slate-700 dark:text-slate-300 text-sm font-medium pb-2'>
										Address
									</span>
									<textarea
										value={address}
										onChange={(e) =>
											setAddress(e.target.value)
										}
										rows={3}
										className='form-textarea w-full rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-base font-normal resize-none'
										placeholder='Enter your address...'
									/>
								</label>
							</div>
							<div className='flex justify-end mt-6'>
								<button
									type='button'
									onClick={handleSaveProfile}
									disabled={isSaving}
									className='px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
								>
									{isSaving && (
										<span className='material-symbols-outlined animate-spin text-lg'>
											progress_activity
										</span>
									)}
									{isSaving ? "Saving..." : "Save Changes"}
								</button>
							</div>
						</SettingsCard>

						<SettingsCard>
							<h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-2'>
								Change Password
							</h3>
							<p className='text-sm text-slate-500 dark:text-slate-400 mb-4'>
								Update your password to keep your account
								secure.
							</p>
							<Link
								href='/profile'
								className='inline-flex px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
							>
								Change Password
							</Link>
						</SettingsCard>

						<SettingsCard className='border-red-200 dark:border-red-900/50'>
							<h3 className='text-lg font-semibold text-red-600 dark:text-red-400 mb-2'>
								Delete Account
							</h3>
							<p className='text-sm text-slate-500 dark:text-slate-400 mb-4'>
								Permanently delete your account and all
								associated data. This action cannot be undone.
							</p>
							<button
								type='button'
								onClick={() => setShowDeleteModal(true)}
								className='px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors'
							>
								Delete My Account
							</button>
						</SettingsCard>
					</div>
				)}

				{/* Notifications Section */}
				{activeSection === "notifications" && (
					<div className='flex flex-col gap-6'>
						<SettingsCard>
							<h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-6'>
								Notification Preferences
							</h3>
							<div className='flex flex-col divide-y divide-slate-200 dark:divide-slate-800'>
								<div className='flex items-center justify-between py-4 first:pt-0'>
									<div>
										<h4 className='font-medium text-slate-800 dark:text-slate-200'>
											In-App Alerts
										</h4>
										<p className='text-sm text-slate-500 dark:text-slate-400'>
											Receive alerts for issue updates and
											new comments directly in the app.
										</p>
									</div>
									<ToggleSwitch
										checked={notifications.inAppAlerts}
										onChange={(checked) =>
											setNotifications((prev) => ({
												...prev,
												inAppAlerts: checked,
											}))
										}
									/>
								</div>
								<div className='flex items-center justify-between py-4'>
									<div>
										<h4 className='font-medium text-slate-800 dark:text-slate-200'>
											Email Notifications
										</h4>
										<p className='text-sm text-slate-500 dark:text-slate-400'>
											Get important updates delivered to
											your inbox.
										</p>
									</div>
									<ToggleSwitch
										checked={
											notifications.emailNotifications
										}
										onChange={(checked) =>
											setNotifications((prev) => ({
												...prev,
												emailNotifications: checked,
											}))
										}
									/>
								</div>
								<div className='flex items-center justify-between py-4'>
									<div>
										<h4 className='font-medium text-slate-800 dark:text-slate-200'>
											Issue Status Updates
										</h4>
										<p className='text-sm text-slate-500 dark:text-slate-400'>
											Be notified when issues you follow
											change status.
										</p>
									</div>
									<ToggleSwitch
										checked={notifications.issueUpdates}
										onChange={(checked) =>
											setNotifications((prev) => ({
												...prev,
												issueUpdates: checked,
											}))
										}
									/>
								</div>
								<div className='flex items-center justify-between py-4'>
									<div>
										<h4 className='font-medium text-slate-800 dark:text-slate-200'>
											New Comments
										</h4>
										<p className='text-sm text-slate-500 dark:text-slate-400'>
											Get notified when someone comments
											on your issues.
										</p>
									</div>
									<ToggleSwitch
										checked={notifications.newComments}
										onChange={(checked) =>
											setNotifications((prev) => ({
												...prev,
												newComments: checked,
											}))
										}
									/>
								</div>
								<div className='flex items-center justify-between py-4 last:pb-0'>
									<div>
										<h4 className='font-medium text-slate-800 dark:text-slate-200'>
											Weekly Digest
										</h4>
										<p className='text-sm text-slate-500 dark:text-slate-400'>
											Receive a weekly summary of
											community activity.
										</p>
									</div>
									<ToggleSwitch
										checked={notifications.weeklyDigest}
										onChange={(checked) =>
											setNotifications((prev) => ({
												...prev,
												weeklyDigest: checked,
											}))
										}
									/>
								</div>
							</div>
						</SettingsCard>
					</div>
				)}

				{/* Appearance Section */}
				{activeSection === "appearance" && (
					<div className='flex flex-col gap-6'>
						<SettingsCard>
							<h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-6'>
								Theme
							</h3>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<button
									type='button'
									onClick={() =>
										theme !== "light" && toggleTheme()
									}
									className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
										theme === "light"
											? "border-primary bg-primary/5"
											: "border-slate-200 dark:border-slate-700 hover:border-primary/50"
									}`}
								>
									<div className='w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm'>
										<span className='material-symbols-outlined text-3xl text-amber-500'>
											light_mode
										</span>
									</div>
									<div className='text-center'>
										<h4 className='font-medium text-slate-900 dark:text-white'>
											Light Mode
										</h4>
										<p className='text-sm text-slate-500 dark:text-slate-400'>
											Bright and clean interface
										</p>
									</div>
									{theme === "light" && (
										<span className='material-symbols-outlined text-primary'>
											check_circle
										</span>
									)}
								</button>
								<button
									type='button'
									onClick={() =>
										theme !== "dark" && toggleTheme()
									}
									className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
										theme === "dark"
											? "border-primary bg-primary/5"
											: "border-slate-200 dark:border-slate-700 hover:border-primary/50"
									}`}
								>
									<div className='w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-sm'>
										<span className='material-symbols-outlined text-3xl text-indigo-400'>
											dark_mode
										</span>
									</div>
									<div className='text-center'>
										<h4 className='font-medium text-slate-900 dark:text-white'>
											Dark Mode
										</h4>
										<p className='text-sm text-slate-500 dark:text-slate-400'>
											Easy on the eyes at night
										</p>
									</div>
									{theme === "dark" && (
										<span className='material-symbols-outlined text-primary'>
											check_circle
										</span>
									)}
								</button>
							</div>
						</SettingsCard>
					</div>
				)}

				{/* Privacy Section */}
				{activeSection === "privacy" && (
					<div className='flex flex-col gap-6'>
						<SettingsCard>
							<h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-6'>
								Privacy Settings
							</h3>
							<div className='flex flex-col divide-y divide-slate-200 dark:divide-slate-800'>
								<div className='flex items-center justify-between py-4 first:pt-0'>
									<div>
										<h4 className='font-medium text-slate-800 dark:text-slate-200'>
											Show Profile Publicly
										</h4>
										<p className='text-sm text-slate-500 dark:text-slate-400'>
											Allow other users to view your
											profile and activity.
										</p>
									</div>
									<ToggleSwitch
										checked={true}
										onChange={() => {}}
										disabled
									/>
								</div>
								<div className='flex items-center justify-between py-4'>
									<div>
										<h4 className='font-medium text-slate-800 dark:text-slate-200'>
											Show Email on Profile
										</h4>
										<p className='text-sm text-slate-500 dark:text-slate-400'>
											Display your email address on your
											public profile.
										</p>
									</div>
									<ToggleSwitch
										checked={false}
										onChange={() => {}}
										disabled
									/>
								</div>
								<div className='flex items-center justify-between py-4 last:pb-0'>
									<div>
										<h4 className='font-medium text-slate-800 dark:text-slate-200'>
											Allow Location Tracking
										</h4>
										<p className='text-sm text-slate-500 dark:text-slate-400'>
											Enable location services for better
											issue reporting.
										</p>
									</div>
									<ToggleSwitch
										checked={true}
										onChange={() => {}}
										disabled
									/>
								</div>
							</div>
							<p className='text-xs text-slate-400 dark:text-slate-500 mt-6 italic'>
								Privacy settings management coming soon.
							</p>
						</SettingsCard>

						<SettingsCard>
							<h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>
								Data & Privacy
							</h3>
							<div className='flex flex-col gap-3'>
								<Link
									href='/privacy'
									className='flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
								>
									<div className='flex items-center gap-3'>
										<span className='material-symbols-outlined text-slate-500 dark:text-slate-400'>
											description
										</span>
										<span className='text-sm font-medium text-slate-700 dark:text-slate-300'>
											Privacy Policy
										</span>
									</div>
									<span className='material-symbols-outlined text-slate-400'>
										chevron_right
									</span>
								</Link>
								<Link
									href='/terms'
									className='flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
								>
									<div className='flex items-center gap-3'>
										<span className='material-symbols-outlined text-slate-500 dark:text-slate-400'>
											gavel
										</span>
										<span className='text-sm font-medium text-slate-700 dark:text-slate-300'>
											Terms of Service
										</span>
									</div>
									<span className='material-symbols-outlined text-slate-400'>
										chevron_right
									</span>
								</Link>
							</div>
						</SettingsCard>
					</div>
				)}

				{/* Help Section */}
				{activeSection === "help" && (
					<div className='flex flex-col gap-6'>
						<SettingsCard>
							<h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>
								Help & Support
							</h3>
							<div className='flex flex-col gap-3'>
								<Link
									href='/contact'
									className='flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
								>
									<div className='flex items-center gap-4'>
										<div className='flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary'>
											<span className='material-symbols-outlined'>
												mail
											</span>
										</div>
										<div>
											<h4 className='font-medium text-slate-800 dark:text-slate-200'>
												Contact Us
											</h4>
											<p className='text-sm text-slate-500 dark:text-slate-400'>
												Get in touch with our support
												team
											</p>
										</div>
									</div>
									<span className='material-symbols-outlined text-slate-400'>
										chevron_right
									</span>
								</Link>
								<Link
									href='/about'
									className='flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
								>
									<div className='flex items-center gap-4'>
										<div className='flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400'>
											<span className='material-symbols-outlined'>
												info
											</span>
										</div>
										<div>
											<h4 className='font-medium text-slate-800 dark:text-slate-200'>
												About TownSpark
											</h4>
											<p className='text-sm text-slate-500 dark:text-slate-400'>
												Learn about our mission and team
											</p>
										</div>
									</div>
									<span className='material-symbols-outlined text-slate-400'>
										chevron_right
									</span>
								</Link>
							</div>
						</SettingsCard>

						<SettingsCard>
							<h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>
								App Information
							</h3>
							<div className='flex flex-col gap-2 text-sm'>
								<div className='flex justify-between py-2'>
									<span className='text-slate-500 dark:text-slate-400'>
										Version
									</span>
									<span className='text-slate-700 dark:text-slate-300 font-medium'>
										1.0.0
									</span>
								</div>
								<div className='flex justify-between py-2'>
									<span className='text-slate-500 dark:text-slate-400'>
										Platform
									</span>
									<span className='text-slate-700 dark:text-slate-300 font-medium'>
										Web
									</span>
								</div>
								<div className='flex justify-between py-2'>
									<span className='text-slate-500 dark:text-slate-400'>
										Build
									</span>
									<span className='text-slate-700 dark:text-slate-300 font-medium'>
										Production
									</span>
								</div>
							</div>
						</SettingsCard>
					</div>
				)}
			</main>

			{/* Delete Account Modal */}
			<Modal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				title='Delete Account'
				footer={null}
			>
				<div className='flex flex-col gap-4'>
					<p className='text-slate-600 dark:text-slate-400'>
						Are you sure you want to delete your account? This
						action is permanent and cannot be undone.
					</p>
					<div className='p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800'>
						<p className='text-sm text-red-600 dark:text-red-400'>
							<strong>Warning:</strong> All your data, including
							issues, comments, and profile information will be
							permanently deleted.
						</p>
					</div>
					<div className='flex gap-3 justify-end mt-2'>
						<button
							type='button'
							onClick={() => setShowDeleteModal(false)}
							className='px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
						>
							Cancel
						</button>
						<button
							type='button'
							onClick={handleDeleteAccount}
							className='px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors'
						>
							Delete Account
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
}

// ============ Main Export with Auth Guard ============
export default function SettingsPage() {
	return (
		<AuthGuard>
			<Scaffold>
				<SettingsPageContent />
			</Scaffold>
		</AuthGuard>
	);
}
