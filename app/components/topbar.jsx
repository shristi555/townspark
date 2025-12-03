"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "../z_internals/controllers/auth";

const navLinks = [
	{ name: "Dashboard", href: "/feed" },
	{ name: "Explore", href: "/issue/list" },
	{ name: "Report Issue", href: "/issue/new" },
	{ name: "My Issues", href: "/issue/myissues" },
];

export default function Topbar() {
	const pathname = usePathname();
	const router = useRouter();
	const userInfo = useAuthStore((state) => state.userInfo);
	const logout = useAuthStore((state) => state.logout);

	const [searchQuery, setSearchQuery] = useState("");
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showProfileMenu, setShowProfileMenu] = useState(false);

	const isActive = (href) => {
		if (href === "/feed") {
			return pathname === "/feed" || pathname === "/";
		}
		return pathname.startsWith(href);
	};

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(
				`/explore?search=${encodeURIComponent(searchQuery.trim())}`
			);
		}
	};

	const handleLogout = async () => {
		await logout();
		router.push("/login");
	};

	return (
		<>
			<header className='sticky top-0 z-20 flex items-center justify-between whitespace-nowrap border-b border-solid border-neutral-divider dark:border-slate-800 px-4 sm:px-8 lg:px-10 py-3 bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm'>
				{/* Logo */}
				<div className='flex items-center gap-8'>
					<Link
						href='/feed'
						className='flex items-center gap-3 text-primary dark:text-white hover:opacity-80 transition-opacity'
					>
						<span className='material-symbols-outlined text-3xl'>
							local_fire_department
						</span>
						<h2 className='text-xl font-bold tracking-[-0.015em] font-heading'>
							TownSpark
						</h2>
					</Link>
				</div>

				{/* Desktop Navigation */}
				<nav className='hidden md:flex items-center gap-1 ml-16'>
					{navLinks.map((link) => {
						const active = isActive(link.href);
						return (
							<Link
								key={link.name}
								href={link.href}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
									active
										? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-sky-300"
										: "text-text-secondary-light dark:text-text-secondary-dark hover:text-primary hover:bg-gray-100 dark:hover:text-primary dark:hover:bg-slate-800"
								}`}
							>
								{link.name}
							</Link>
						);
					})}
				</nav>

				{/* Right Section */}
				<div className='flex flex-1 justify-end gap-4 items-center'>
					{/* Search */}
					<form
						onSubmit={handleSearch}
						className='hidden lg:flex flex-col min-w-40 !h-10 max-w-64'
					>
						<div className='flex w-full flex-1 items-stretch rounded-lg h-full'>
							<div className='text-gray-500 dark:text-gray-400 flex bg-gray-100 dark:bg-slate-700 items-center justify-center pl-3 rounded-l-lg'>
								<span className='material-symbols-outlined'>
									search
								</span>
							</div>
							<input
								type='text'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-neutral-text dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-gray-100 dark:bg-slate-700 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 pl-2 text-sm font-normal leading-normal'
								placeholder='Search issues...'
							/>
						</div>
					</form>

					{/* Notifications */}
					<Link
						href='/notifications'
						className={`flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 transition-colors ${
							pathname === "/notifications"
								? "bg-primary/10 text-primary dark:bg-primary/20"
								: "bg-gray-100 dark:bg-slate-700 text-neutral-text dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
						}`}
					>
						<span className='material-symbols-outlined'>
							notifications
						</span>
					</Link>

					{/* Settings */}
					<Link
						href='/settings'
						className={`hidden sm:flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 transition-colors ${
							pathname === "/settings"
								? "bg-primary/10 text-primary dark:bg-primary/20"
								: "bg-gray-100 dark:bg-slate-700 text-neutral-text dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
						}`}
					>
						<span className='material-symbols-outlined'>
							settings
						</span>
					</Link>

					{/* Profile Dropdown */}
					<div className='relative'>
						<button
							type='button'
							onClick={() => setShowProfileMenu(!showProfileMenu)}
							className={`bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-background-dark transition-all ${
								pathname === "/profile"
									? "ring-primary"
									: "ring-transparent hover:ring-primary/50"
							}`}
							style={{
								backgroundImage: userInfo?.profileImage
									? `url("${userInfo.profileImage}")`
									: `url("https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.fullName || "User")}&background=0d83f2&color=fff")`,
							}}
						/>

						{/* Profile Dropdown Menu */}
						{showProfileMenu && (
							<>
								{/* Backdrop */}
								<div
									className='fixed inset-0 z-40'
									onClick={() => setShowProfileMenu(false)}
								/>
								<div className='absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg z-50 py-2'>
									<div className='px-4 py-3 border-b border-slate-200 dark:border-slate-700'>
										<p className='text-sm font-medium text-slate-900 dark:text-white truncate'>
											{userInfo?.fullName || "Guest User"}
										</p>
										<p className='text-xs text-slate-500 dark:text-slate-400 truncate'>
											{userInfo?.email || ""}
										</p>
									</div>
									<div className='py-1'>
										<Link
											href='/profile'
											onClick={() =>
												setShowProfileMenu(false)
											}
											className='flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
										>
											<span className='material-symbols-outlined text-xl'>
												person
											</span>
											My Profile
										</Link>
										<Link
											href='/settings'
											onClick={() =>
												setShowProfileMenu(false)
											}
											className='flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
										>
											<span className='material-symbols-outlined text-xl'>
												settings
											</span>
											Settings
										</Link>
									</div>
									<div className='border-t border-slate-200 dark:border-slate-700 py-1'>
										<button
											type='button'
											onClick={() => {
												setShowProfileMenu(false);
												handleLogout();
											}}
											className='flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800'
										>
											<span className='material-symbols-outlined text-xl'>
												logout
											</span>
											Sign Out
										</button>
									</div>
								</div>
							</>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button
						type='button'
						onClick={() => setShowMobileMenu(!showMobileMenu)}
						className='md:hidden flex items-center justify-center h-10 w-10 rounded-lg bg-gray-100 dark:bg-slate-700 text-neutral-text dark:text-gray-300'
					>
						<span className='material-symbols-outlined'>
							{showMobileMenu ? "close" : "menu"}
						</span>
					</button>
				</div>
			</header>

			{/* Mobile Navigation Menu */}
			{showMobileMenu && (
				<div className='md:hidden fixed inset-x-0 top-[65px] z-30 bg-white dark:bg-background-dark border-b border-neutral-divider dark:border-slate-800 shadow-lg'>
					<nav className='flex flex-col p-4 gap-1'>
						{navLinks.map((link) => {
							const active = isActive(link.href);
							return (
								<Link
									key={link.name}
									href={link.href}
									onClick={() => setShowMobileMenu(false)}
									className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
										active
											? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-sky-300"
											: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
									}`}
								>
									{link.name}
								</Link>
							);
						})}
						<div className='border-t border-neutral-divider dark:border-slate-800 mt-2 pt-2'>
							<Link
								href='/settings'
								onClick={() => setShowMobileMenu(false)}
								className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${
									pathname === "/settings"
										? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-sky-300"
										: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
								}`}
							>
								<span className='material-symbols-outlined'>
									settings
								</span>
								Settings
							</Link>
						</div>
					</nav>
					{/* Mobile Search */}
					<form onSubmit={handleSearch} className='px-4 pb-4'>
						<div className='flex w-full items-stretch rounded-lg h-10'>
							<div className='text-gray-500 dark:text-gray-400 flex bg-gray-100 dark:bg-slate-700 items-center justify-center pl-3 rounded-l-lg'>
								<span className='material-symbols-outlined'>
									search
								</span>
							</div>
							<input
								type='text'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-neutral-text dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-gray-100 dark:bg-slate-700 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 pl-2 text-sm font-normal leading-normal'
								placeholder='Search issues...'
							/>
						</div>
					</form>
				</div>
			)}
		</>
	);
}
