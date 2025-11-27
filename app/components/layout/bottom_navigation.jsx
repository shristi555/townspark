"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
	{ href: "/feed", icon: "home", label: "Home" },
	{ href: "/explore", icon: "explore", label: "Explore" },
	{ href: "/add", icon: "add_circle", label: "Report" },
	{ href: "/notifications", icon: "notifications", label: "Alerts" },
	{ href: "/profile", icon: "person", label: "Profile" },
];

export default function BottomNavigation({ className = "" }) {
	const pathname = usePathname();

	return (
		<nav
			className={`md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center border-t border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark py-2 z-50 ${className}`}
		>
			{navItems.map((item) => {
				const isActive =
					pathname === item.href ||
					pathname.startsWith(`${item.href}/`);
				const isReport = item.href === "/add";

				return (
					<Link
						key={item.href}
						href={item.href}
						className={`flex flex-col items-center gap-1 px-3 py-1.5 transition-colors ${
							isReport
								? "relative -mt-6"
								: isActive
									? "text-primary"
									: "text-text-secondary-light dark:text-text-secondary-dark"
						}`}
					>
						{isReport ? (
							<span className='flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30'>
								<span className='material-symbols-outlined text-3xl'>
									{item.icon}
								</span>
							</span>
						) : (
							<>
								<span
									className={`material-symbols-outlined text-2xl ${
										isActive ? "filled" : ""
									}`}
									style={{
										fontVariationSettings: isActive
											? "'FILL' 1, 'wght' 400"
											: "'FILL' 0, 'wght' 400",
									}}
								>
									{item.icon}
								</span>
								<span className='text-xs font-medium'>
									{item.label}
								</span>
							</>
						)}
					</Link>
				);
			})}
		</nav>
	);
}
