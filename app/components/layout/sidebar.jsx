"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "../ui";
import { currentUser } from "../../data/dummy_data";
import { useTheme } from "../../contexts/theme_context";

const mainNavItems = [
	{ href: "/feed", icon: "home", label: "Home Feed" },
	{ href: "/explore", icon: "explore", label: "Explore" },
	{ href: "/add", icon: "add_circle", label: "Report Issue" },
	{ href: "/notifications", icon: "notifications", label: "Notifications" },
];

const accountNavItems = [
	{ href: "/profile", icon: "person", label: "My Profile" },
	{ href: "/profile/issues", icon: "assignment", label: "My Issues" },
	{ href: "/settings", icon: "settings", label: "Settings" },
];

const resolverNavItems = [
	{ href: "/resolver", icon: "dashboard", label: "Dashboard" },
	{
		href: "/resolver/assigned",
		icon: "assignment_ind",
		label: "Assigned Issues",
	},
	{ href: "/resolver/resolved", icon: "check_circle", label: "Resolved" },
];

const adminNavItems = [
	{ href: "/admin", icon: "admin_panel_settings", label: "Admin Panel" },
	{ href: "/admin/users", icon: "group", label: "User Management" },
	{
		href: "/admin/resolvers",
		icon: "support_agent",
		label: "Resolver Management",
	},
	{ href: "/admin/analytics", icon: "analytics", label: "Analytics" },
	{ href: "/admin/content", icon: "article", label: "Content Management" },
];

export default function Sidebar({
	isOpen,
	onClose,
	showResolverNav = false,
	showAdminNav = false,
	className = "",
}) {
	const pathname = usePathname();
	const { darkMode, toggleDarkMode } = useTheme();

	const NavLink = ({ item }) => {
		const isActive =
			pathname === item.href || pathname.startsWith(`${item.href}/`);
		return (
			<Link
				href={item.href}
				onClick={onClose}
				className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
					isActive
						? "bg-primary/10 text-primary"
						: "text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/10"
				}`}
			>
				<span
					className='material-symbols-outlined text-xl'
					style={{
						fontVariationSettings: isActive
							? "'FILL' 1, 'wght' 400"
							: "'FILL' 0, 'wght' 400",
					}}
				>
					{item.icon}
				</span>
				<span className='text-sm font-medium'>{item.label}</span>
			</Link>
		);
	};

	const NavSection = ({ title, items }) => (
		<div className='px-3 py-2'>
			{title && (
				<h3 className='text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider px-3 py-2'>
					{title}
				</h3>
			)}
			<div className='flex flex-col gap-1'>
				{items.map((item) => (
					<NavLink key={item.href} item={item} />
				))}
			</div>
		</div>
	);

	return (
		<>
			{/* Overlay */}
			{isOpen && (
				<div
					className='fixed inset-0 bg-black/50 z-40 md:hidden'
					onClick={onClose}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed top-0 left-0 bottom-0 w-72 bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark z-50 transform transition-transform duration-300 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				} md:translate-x-0 md:static md:z-auto overflow-y-auto ${className}`}
			>
				{/* Header */}
				<div className='flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark'>
					<Link
						href='/'
						className='flex items-center gap-3'
						onClick={onClose}
					>
						<div className='size-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-600'>
							<span className='material-symbols-outlined text-white text-lg'>
								location_city
							</span>
						</div>
						<span className='text-lg font-bold text-text-primary-light dark:text-text-primary-dark'>
							TownSpark
						</span>
					</Link>
					<button
						onClick={onClose}
						className='md:hidden flex items-center justify-center size-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-primary-light dark:text-text-primary-dark'
					>
						<span className='material-symbols-outlined'>close</span>
					</button>
				</div>

				{/* User Info */}
				<div className='p-4 border-b border-border-light dark:border-border-dark'>
					<Link
						href='/profile'
						onClick={onClose}
						className='flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors'
					>
						<Avatar
							src={currentUser.avatar}
							name={currentUser.name}
							size='md'
						/>
						<div className='flex-1 min-w-0'>
							<p className='text-sm font-semibold text-text-primary-light dark:text-text-primary-dark truncate'>
								{currentUser.name}
							</p>
							<p className='text-xs text-text-secondary-light dark:text-text-secondary-dark truncate'>
								@{currentUser.username}
							</p>
						</div>
					</Link>
				</div>

				{/* Navigation */}
				<div className='flex flex-col py-2'>
					<NavSection items={mainNavItems} />

					<div className='h-px bg-border-light dark:bg-border-dark mx-4 my-2' />

					<NavSection title='Account' items={accountNavItems} />

					{showResolverNav && (
						<>
							<div className='h-px bg-border-light dark:bg-border-dark mx-4 my-2' />
							<NavSection
								title='Resolver'
								items={resolverNavItems}
							/>
						</>
					)}

					{showAdminNav && (
						<>
							<div className='h-px bg-border-light dark:bg-border-dark mx-4 my-2' />
							<NavSection title='Admin' items={adminNavItems} />
						</>
					)}
				</div>

				{/* Footer */}
				<div className='mt-auto p-4 border-t border-border-light dark:border-border-dark'>
					{/* Theme Toggle */}
					<button
						onClick={toggleDarkMode}
						className='flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors'
					>
						<span className='material-symbols-outlined text-xl'>
							{darkMode ? "light_mode" : "dark_mode"}
						</span>
						<span className='text-sm font-medium'>
							{darkMode ? "Light Mode" : "Dark Mode"}
						</span>
					</button>

					{/* Logout */}
					<button className='flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-status-reported hover:bg-status-reported/10 transition-colors'>
						<span className='material-symbols-outlined text-xl'>
							logout
						</span>
						<span className='text-sm font-medium'>Logout</span>
					</button>
				</div>
			</aside>
		</>
	);
}
