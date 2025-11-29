"use client";

import Link from "next/link";
import { useTheme } from "../../contexts/theme_context";
import { useAuth } from "../../contexts/auth_context";
import { Avatar } from "../ui";

export default function Header({
	title,
	showBackButton = false,
	backHref = "/",
	onBackClick,
	showSearch = false,
	showNotifications = true,
	showThemeToggle = true,
	showUserMenu = true,
	actions,
	className = "",
}) {
	const { darkMode, toggleDarkMode } = useTheme();
	const { user, isAuthenticated } = useAuth();

	const handleBack = () => {
		if (onBackClick) {
			onBackClick();
		} else if (typeof window !== "undefined") {
			window.history.back();
		}
	};

	return (
		<header
			className={`flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-4 sm:px-10 py-3 bg-card-light dark:bg-card-dark ${className}`}
		>
			{/* Left Section */}
			<div className='flex items-center gap-4 text-text-primary-light dark:text-text-primary-dark'>
				{showBackButton && (
					<button
						onClick={handleBack}
						className='flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors'
					>
						<span className='material-symbols-outlined'>
							arrow_back
						</span>
					</button>
				)}
				{title ? (
					<h1 className='text-lg font-bold leading-tight tracking-[-0.015em]'>
						{title}
					</h1>
				) : (
					<Link href='/' className='flex items-center gap-3'>
						<div className='size-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-600'>
							<span className='material-symbols-outlined text-white text-lg'>
								location_city
							</span>
						</div>
						<h2 className='text-lg font-bold leading-tight tracking-[-0.015em]'>
							TownSpark
						</h2>
					</Link>
				)}
			</div>

			{/* Right Section */}
			<div className='flex items-center gap-2 sm:gap-4'>
				{showSearch && (
					<Link
						href='/search'
						className='flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-primary-light dark:text-text-primary-dark'
					>
						<span className='material-symbols-outlined'>
							search
						</span>
					</Link>
				)}

				{showThemeToggle && (
					<button
						onClick={toggleDarkMode}
						className='flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-primary-light dark:text-text-primary-dark'
						aria-label='Toggle theme'
					>
						<span className='material-symbols-outlined'>
							{darkMode ? "light_mode" : "dark_mode"}
						</span>
					</button>
				)}

				{showNotifications && (
					<Link
						href='/notifications'
						className='flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-primary-light dark:text-text-primary-dark relative'
					>
						<span className='material-symbols-outlined'>
							notifications
						</span>
						{/* Notification badge */}
						<span className='absolute top-1 right-1 size-2.5 bg-status-reported rounded-full border-2 border-card-light dark:border-card-dark' />
					</Link>
				)}

				{showUserMenu &&
					(isAuthenticated && user ? (
						<Link
							href='/profile'
							className='flex items-center gap-2'
						>
							<Avatar
								src={user.avatar}
								name={user.full_name || user.username}
								size='sm'
							/>
						</Link>
					) : (
						<Link
							href='/login'
							className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors'
						>
							Sign In
						</Link>
					))}

				{/* Custom actions */}
				{actions}
			</div>
		</header>
	);
}
