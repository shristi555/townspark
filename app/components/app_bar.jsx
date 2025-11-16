"use client";

import { useTheme } from "../contexts/theme_context";

export default function AppBar({ onMenuClick }) {
	const { theme, toggleTheme } = useTheme();

	return (
		<header className='sticky top-0 z-10 flex h-16 items-center justify-between bg-white dark:bg-zinc-900 px-4 shadow-sm'>
			<div className='flex items-center gap-3'>
				<button
					onClick={onMenuClick}
					className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors'
					aria-label='Open menu'
				>
					<span className='material-symbols-outlined text-2xl'>
						menu
					</span>
				</button>
				<h1 className='text-xl font-bold text-gray-900 dark:text-white'>
					Community Reports
				</h1>
			</div>
			<div className='flex items-center gap-2'>
				<button
					onClick={toggleTheme}
					className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors'
					aria-label='Toggle theme'
				>
					<span className='material-symbols-outlined text-2xl'>
						{theme === "dark" ? "light_mode" : "dark_mode"}
					</span>
				</button>
				<button
					className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors'
					aria-label='Search'
				>
					<span className='material-symbols-outlined text-2xl'>
						search
					</span>
				</button>
				<button
					className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors'
					aria-label='Filter'
				>
					<span className='material-symbols-outlined text-2xl'>
						filter_list
					</span>
				</button>
			</div>
		</header>
	);
}
