"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../z_internals/controllers/auth";

const navItems = [
	{
		name: "Dashboard",
		href: "/feed",
		icon: "dashboard",
		activeIcon: "dashboard",
	},
	{
		name: "Explore",
		href: "/issue/list",
		icon: "explore",
		activeIcon: "explore",
	},
	{
		name: "My Issues",
		href: "/issue/myissues",
		icon: "report",
		activeIcon: "report",
	},
	{
		name: "Report Issue",
		href: "/issue/new",
		icon: "add_circle",
		activeIcon: "add_circle",
	},
	{
		name: "Notifications",
		href: "/notifications",
		icon: "notifications",
		activeIcon: "notifications",
	},
	{
		name: "Settings",
		href: "/settings",
		icon: "settings",
		activeIcon: "settings",
	},
];

export default function Sidebar() {
	const pathname = usePathname();
	const userInfo = useAuthStore((state) => state.userInfo);

	const isActive = (href) => {
		if (href === "/feed") {
			return pathname === "/feed" || pathname === "/";
		}
		return pathname.startsWith(href);
	};

	return (
		<aside className='hidden lg:flex sticky top-[65px] h-[calc(100vh-65px)] w-64 flex-col justify-between border-r border-neutral-divider dark:border-slate-800 p-4 bg-white dark:bg-background-dark'>
			<div className='flex flex-col gap-4'>
				{/* User Profile Section */}
				<Link
					href='/profile'
					className={`flex gap-3 items-center p-2 rounded-lg transition-colors ${
						pathname === "/profile"
							? "bg-primary/10 dark:bg-primary/20"
							: "hover:bg-gray-100 dark:hover:bg-slate-800"
					}`}
				>
					<div
						className='bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-background-dark ring-primary/20'
						style={{
							backgroundImage: userInfo?.profileImage
								? `url("${userInfo.profileImage}")`
								: `url("https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.fullName || "User")}&background=0d83f2&color=fff")`,
						}}
					/>
					<div className='flex flex-col min-w-0'>
						<h1 className='text-neutral-text dark:text-white text-sm font-medium leading-normal truncate'>
							{userInfo?.fullName || "Guest User"}
						</h1>
						<p className='text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal'>
							{pathname === "/profile"
								? "Viewing Profile"
								: "View Profile"}
						</p>
					</div>
				</Link>

				{/* Navigation Links */}
				<nav className='flex flex-col gap-2 mt-4'>
					{navItems.map((item) => {
						const active = isActive(item.href);
						return (
							<Link
								key={item.name}
								href={item.href}
								className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
									active
										? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-sky-300"
										: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
								}`}
							>
								<span
									className='material-symbols-outlined'
									style={{
										fontVariationSettings: active
											? "'FILL' 1"
											: "'FILL' 0",
									}}
								>
									{active ? item.activeIcon : item.icon}
								</span>
								<p className='text-sm font-medium leading-normal'>
									{item.name}
								</p>
							</Link>
						);
					})}
				</nav>
			</div>

			{/* Bottom Links */}
			<div className='flex flex-col gap-1 border-t border-neutral-divider dark:border-slate-800 pt-4'>
				<Link
					href='/about'
					className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
						pathname === "/about"
							? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-sky-300"
							: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
					}`}
				>
					<span className='material-symbols-outlined'>info</span>
					<p className='text-sm font-medium leading-normal'>About</p>
				</Link>
				<Link
					href='/contact'
					className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
						pathname === "/contact"
							? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-sky-300"
							: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
					}`}
				>
					<span className='material-symbols-outlined'>help</span>
					<p className='text-sm font-medium leading-normal'>
						Help & Support
					</p>
				</Link>
			</div>
		</aside>
	);
}
