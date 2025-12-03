"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { AuthGuard, useAuthStore } from "../z_internals/controllers/auth";
import {
	useProfileStore,
	selectMyProfile,
	selectIsLoading,
	selectIsUpdating,
	selectErrorMessage,
	selectUpdateSuccess,
	type ProfileIssue,
} from "../z_internals/controllers/profile";
import Scaffold from "../components/scaffold";
import { Loader, Modal } from "../components/ui";
import toaster from "../z_internals/services/messages/toast/toaster";
// import { useToast } from "../components/ui/toast";

// ============ Status Badge Component ============
function StatusBadge({ status }: { status: string }) {
	const statusConfig: Record<
		string,
		{ bg: string; text: string; dot: string; label: string; icon: string }
	> = {
		open: {
			bg: "bg-status-open/10",
			text: "text-status-open",
			dot: "bg-status-open",
			label: "Open",
			icon: "report",
		},
		in_progress: {
			bg: "bg-status-progress/10",
			text: "text-status-progress",
			dot: "bg-status-progress",
			label: "In Progress",
			icon: "hourglass_top",
		},
		resolved: {
			bg: "bg-status-resolved/10",
			text: "text-status-resolved",
			dot: "bg-status-resolved",
			label: "Resolved",
			icon: "task_alt",
		},
		closed: {
			bg: "bg-slate-500/10",
			text: "text-slate-600 dark:text-slate-400",
			dot: "bg-slate-500",
			label: "Closed",
			icon: "check_circle",
		},
	};

	const config = statusConfig[status] || statusConfig.open;

	return (
		<div
			className={`flex items-center justify-center px-2 py-1 rounded-full ${config.bg}`}
		>
			<p className={`${config.text} text-xs font-bold`}>{config.label}</p>
		</div>
	);
}

// ============ Issue List Item Component ============
function IssueListItem({ issue }: { issue: ProfileIssue }) {
	const statusConfig: Record<string, { color: string; icon: string }> = {
		open: { color: "text-status-open", icon: "report" },
		in_progress: { color: "text-status-progress", icon: "hourglass_top" },
		resolved: { color: "text-status-resolved", icon: "task_alt" },
		closed: { color: "text-slate-500", icon: "check_circle" },
	};

	const config = statusConfig[issue.status] || statusConfig.open;

	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			const now = new Date();
			const diffTime = Math.abs(now.getTime() - date.getTime());
			const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

			if (diffDays === 0) return "Today";
			if (diffDays === 1) return "Yesterday";
			if (diffDays < 7) return `${diffDays} days ago`;
			if (diffDays < 30)
				return `${Math.floor(diffDays / 7)} week${diffDays >= 14 ? "s" : ""} ago`;
			if (diffDays < 365)
				return `${Math.floor(diffDays / 30)} month${diffDays >= 60 ? "s" : ""} ago`;
			return `${Math.floor(diffDays / 365)} year${diffDays >= 730 ? "s" : ""} ago`;
		} catch {
			return dateString;
		}
	};

	return (
		<Link href={`/issue/${issue.id}`}>
			<div className='flex gap-4 bg-card-light dark:bg-card-dark px-4 py-4 justify-between items-center border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer'>
				<div className='flex items-start gap-4'>
					<div
						className={`${config.color} flex items-center justify-center rounded-lg ${config.color.replace("text-", "bg-")}/10 shrink-0 size-12`}
					>
						<span className='material-symbols-outlined'>
							{config.icon}
						</span>
					</div>
					<div className='flex flex-1 flex-col justify-center'>
						<p className='text-text-primary-light dark:text-text-primary-dark text-base font-medium leading-normal'>
							{issue.title}
						</p>
						<p className='text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal'>
							Posted: {formatDate(issue.created_at)}
						</p>
						<p className='text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal'>
							{issue.location}
						</p>
					</div>
				</div>
				<div className='shrink-0'>
					<StatusBadge status={issue.status} />
				</div>
			</div>
		</Link>
	);
}

// ============ Stats Card Component ============
function StatsCard({
	label,
	value,
	variant = "default",
}: {
	label: string;
	value: number | string;
	variant?: "default" | "accent";
}) {
	const baseClasses =
		"flex min-w-[100px] flex-1 flex-col gap-1 rounded-lg p-4 shadow-sm";
	const variantClasses =
		variant === "accent"
			? "bg-accent/20 dark:bg-accent/30 border border-accent/30 dark:border-accent/40"
			: "bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark";

	return (
		<div className={`${baseClasses} ${variantClasses}`}>
			<p
				className={`text-sm font-medium leading-normal ${
					variant === "accent"
						? "text-text-primary-light dark:text-text-primary-dark"
						: "text-text-secondary-light dark:text-text-secondary-dark"
				}`}
			>
				{label}
			</p>
			<p
				className={`tracking-light text-2xl font-bold leading-tight ${
					variant === "accent"
						? "text-accent"
						: "text-text-primary-light dark:text-text-primary-dark"
				}`}
			>
				{value}
			</p>
		</div>
	);
}

// ============ Edit Profile Modal ============
function EditProfileModal({
	isOpen,
	onClose,
	profile,
	showToast,
}: {
	isOpen: boolean;
	onClose: () => void;
	profile: any;
	showToast: (message: string, variant?: string) => void;
}) {
	const [fullName, setFullName] = useState(profile?.fullName || "");
	const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || "");
	const [address, setAddress] = useState(profile?.address || "");
	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const updateProfile = useProfileStore((state) => state.updateProfile);
	const isUpdating = useProfileStore(selectIsUpdating);
	const errorMessage = useProfileStore(selectErrorMessage);
	const updateSuccess = useProfileStore(selectUpdateSuccess);
	const clearUpdateSuccess = useProfileStore(
		(state) => state.clearUpdateSuccess
	);
	const clearError = useProfileStore((state) => state.clearError);

	useEffect(() => {
		if (profile) {
			setFullName(profile.fullName || "");
			setPhoneNumber(profile.phoneNumber || "");
			setAddress(profile.address || "");
		}
	}, [profile]);

	useEffect(() => {
		if (updateSuccess) {
			showToast("Profile updated successfully!", "success");
			clearUpdateSuccess();
			onClose();
		}
	}, [updateSuccess, showToast, clearUpdateSuccess, onClose]);

	useEffect(() => {
		if (errorMessage) {
			showToast(errorMessage, "error");
		}
	}, [errorMessage, showToast]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setProfileImage(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		clearError();

		await updateProfile(
			{
				full_name: fullName,
				phone_number: phoneNumber,
				address: address,
			},
			profileImage
		);
	};

	const handleClose = () => {
		clearError();
		setProfileImage(null);
		setPreviewUrl(null);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title='Edit Profile'
			footer={null}
		>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				{/* Profile Image */}
				<div className='flex flex-col items-center gap-4'>
					<div
						className='bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 shadow-md border-2 border-border-light dark:border-border-dark'
						style={{
							backgroundImage: `url('${
								previewUrl ||
								profile?.profileImage ||
								"/default-avatar.png"
							}')`,
						}}
					/>
					<label className='cursor-pointer'>
						<span className='text-primary text-sm font-medium hover:underline'>
							Change Photo
						</span>
						<input
							type='file'
							accept='image/*'
							onChange={handleImageChange}
							className='hidden'
						/>
					</label>
				</div>

				{/* Full Name */}
				<div>
					<label className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1'>
						Full Name
					</label>
					<input
						type='text'
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						className='w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary'
						placeholder='Enter your full name'
					/>
				</div>

				{/* Phone Number */}
				<div>
					<label className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1'>
						Phone Number
					</label>
					<input
						type='tel'
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
						className='w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary'
						placeholder='Enter your phone number'
					/>
				</div>

				{/* Address */}
				<div>
					<label className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1'>
						Address
					</label>
					<input
						type='text'
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						className='w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary'
						placeholder='Enter your address'
					/>
				</div>

				{/* Buttons */}
				<div className='flex gap-3 pt-4'>
					<button
						type='button'
						onClick={handleClose}
						className='flex-1 py-2 px-4 border border-border-light dark:border-border-dark rounded-lg text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
					>
						Cancel
					</button>
					<button
						type='submit'
						disabled={isUpdating}
						className='flex-1 py-2 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
					>
						{isUpdating ? (
							<>
								<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
								Saving...
							</>
						) : (
							"Save Changes"
						)}
					</button>
				</div>
			</form>
		</Modal>
	);
}

// ============ Profile Header Component ============
function ProfileHeader({
	profile,
	onEditClick,
}: {
	profile: any;
	onEditClick: () => void;
}) {
	const getInitial = (name: string) => {
		return name?.charAt(0)?.toUpperCase() || "U";
	};

	return (
		<div className='flex p-4 @container'>
			<div className='flex w-full flex-col gap-4 items-start'>
				<div className='flex gap-4 items-center w-full justify-between flex-wrap'>
					<div className='flex gap-4 items-center'>
						{profile?.profileImage ? (
							<div
								className='bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-20 w-20 shadow-md'
								style={{
									backgroundImage: `url('${profile.profileImage}')`,
								}}
							/>
						) : (
							<div className='flex items-center justify-center rounded-full min-h-20 w-20 shadow-md bg-primary text-white text-2xl font-bold'>
								{getInitial(profile?.fullName)}
							</div>
						)}
						<div className='flex flex-col justify-center'>
							<p className='text-text-primary-light dark:text-text-primary-dark text-[22px] font-bold leading-tight tracking-[-0.015em]'>
								{profile?.fullName || "User"}
							</p>
							<p className='text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal'>
								{profile?.email}
							</p>
							{profile?.address && (
								<p className='text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal'>
									{profile.address}
								</p>
							)}
						</div>
					</div>
					<button
						onClick={onEditClick}
						className='flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors'
					>
						<span className='material-symbols-outlined !text-xl'>
							edit
						</span>
						<span className='hidden sm:inline'>Edit Profile</span>
					</button>
				</div>
			</div>
		</div>
	);
}

// ============ Profile Stats Component ============
function ProfileStats({ profile }: { profile: any }) {
	return (
		<div className='flex flex-wrap gap-3 p-4'>
			<StatsCard
				label='Issues Posted'
				value={profile?.issuesReported ?? 0}
			/>
			<StatsCard
				label='Progress Updates'
				value={profile?.progressUpdates ?? 0}
			/>
			<StatsCard
				label='Issues Resolved'
				value={profile?.resolvedIssuesCount ?? 0}
				variant='accent'
			/>
		</div>
	);
}

// ============ Profile Tabs Component ============
function ProfileTabs({
	activeTab,
	onTabChange,
}: {
	activeTab: string;
	onTabChange: (tab: string) => void;
}) {
	const tabs = [
		{ id: "reports", label: "My Reports" },
		{ id: "followed", label: "Followed Issues" },
	];

	return (
		<div className='pb-3 pt-2'>
			<div className='flex border-b border-border-light dark:border-border-dark px-4 justify-between'>
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 flex-1 transition-colors ${
							activeTab === tab.id
								? "border-b-primary text-primary"
								: "border-b-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
						}`}
					>
						<p className='text-sm font-bold leading-normal tracking-[0.015em]'>
							{tab.label}
						</p>
					</button>
				))}
			</div>
		</div>
	);
}

// ============ Empty State Component ============
function EmptyIssueState({ message }: { message: string }) {
	return (
		<div className='flex flex-col items-center justify-center py-12 px-4 text-center'>
			<span className='material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark mb-4'>
				inbox
			</span>
			<p className='text-text-secondary-light dark:text-text-secondary-dark text-base'>
				{message}
			</p>
		</div>
	);
}

// ============ Main Profile Page UI ============
function ProfilePageUi() {
	const [activeTab, setActiveTab] = useState("reports");
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const myProfile = useProfileStore(selectMyProfile);
	const isLoading = useProfileStore(selectIsLoading);
	const errorMessage = useProfileStore(selectErrorMessage);
	const fetchMyProfile = useProfileStore((state) => state.fetchMyProfile);

	useEffect(() => {
		fetchMyProfile();
	}, [fetchMyProfile]);

	const handleCloseModal = useCallback(() => {
		setIsEditModalOpen(false);
	}, []);

	if (isLoading && !myProfile) {
		return (
			<Scaffold>
				<div className='flex items-center justify-center min-h-[60vh]'>
					<Loader size='lg' />
				</div>
			</Scaffold>
		);
	}

	if (errorMessage && !myProfile) {
		return (
			<Scaffold>
				<div className='flex flex-col items-center justify-center min-h-[60vh] px-4'>
					<span className='material-symbols-outlined text-6xl text-red-500 mb-4'>
						error
					</span>
					<p className='text-text-primary-light dark:text-text-primary-dark text-lg font-medium mb-2'>
						Failed to load profile
					</p>
					<p className='text-text-secondary-light dark:text-text-secondary-dark text-sm mb-4'>
						{errorMessage}
					</p>
					<button
						onClick={() => fetchMyProfile()}
						className='px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors'
					>
						Try Again
					</button>
				</div>
			</Scaffold>
		);
	}

	const issues = myProfile?.issues ?? [];

	return (
		<Scaffold>
			<div className='relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden'>
				{/* Top App Bar */}
				<div className='flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10'>
					<div className='w-12' /> {/* Spacer for centering */}
					<h2 className='text-text-primary-light dark:text-text-primary-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center'>
						My Profile
					</h2>
					<div className='flex w-12 items-center justify-end'>
						<Link
							href='/settings'
							className='flex items-center justify-center rounded-full h-12 w-12 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
						>
							<span className='material-symbols-outlined text-2xl text-text-primary-light dark:text-text-primary-dark'>
								settings
							</span>
						</Link>
					</div>
				</div>

				{/* Profile Header */}
				<ProfileHeader
					profile={myProfile}
					onEditClick={() => setIsEditModalOpen(true)}
				/>

				{/* Stats */}
				<ProfileStats profile={myProfile} />

				{/* Tabs */}
				<ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

				{/* Issues List */}
				<div className='flex flex-col gap-px'>
					{activeTab === "reports" && (
						<>
							{issues.length > 0 ? (
								issues.map((issue) => (
									<IssueListItem
										key={issue.id}
										issue={issue}
									/>
								))
							) : (
								<EmptyIssueState message="You haven't reported any issues yet. Start making a difference in your community!" />
							)}
						</>
					)}
					{activeTab === "followed" && (
						<EmptyIssueState message="You haven't followed any issues yet. Follow issues to track their progress!" />
					)}
				</div>

				{/* Loading Overlay */}
				{isLoading && myProfile && (
					<div className='fixed inset-0 bg-black/20 flex items-center justify-center z-50'>
						<Loader size='lg' />
					</div>
				)}
			</div>

			{/* Edit Profile Modal */}
			<EditProfileModal
				isOpen={isEditModalOpen}
				onClose={handleCloseModal}
				profile={myProfile}
				showToast={() => {
					toaster.info("Profile updated successfully!");
				}}
			/>
		</Scaffold>
	);
}

// ============ Main Profile Page (with AuthGuard) ============
function ProfilePage() {
	return (
		<AuthGuard>
			<ProfilePageUi />
		</AuthGuard>
	);
}

export default ProfilePage;
