"use client";

export default function Sidebar() {
	return (
		<>
			<aside className='hidden lg:flex sticky top-[65px] h-[calc(100vh-65px)] w-64 flex-col justify-between border-r border-neutral-divider dark:border-slate-800 p-4 bg-white dark:bg-background-dark'>
				<div className='flex flex-col gap-4'>
					<div className='flex gap-3 items-center'>
						<div
							className='bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10'
							data-alt="Logged-in user's profile picture"
							style={{
								backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDrebyhToTPly_yw7xqAN2eFovbWV3I9oLbvhjIDJvlJ3aKON1pWuQxaLqgHLcE2RseleGjBIQ7m2IhGaAxtpJ2JOc8msv7Mbro2Qu81lGpgHzccSbP2gI2_yoC7UDjg0HsS2XUc1kwG9yJuEjR7I1nxFNKo0Vgmdp1PM6T6x7X1eOei7oobVGCo220stXGTiTbLmQYJfAdGkKZBD8i_DO3Ag2drrTkuEJVOEtnvKHwhsKy89o6WPJZQqI-I4nXyiE2Hkh1NuOlhX8")`,
							}}
						></div>
						<div className='flex flex-col'>
							<h1 className='text-neutral-text dark:text-white text-sm font-medium leading-normal'>
								Jane Doe
							</h1>
							<p className='text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal'>
								View Profile
							</p>
						</div>
					</div>
					<div className='flex flex-col gap-2 mt-4'>
						<a
							className='flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-sky-300'
							href='#'
						>
							<span
								className='material-symbols-outlined'
								style={{
									fontVariationSettings: `'FILL' 1`,
								}}
							>
								dashboard
							</span>
							<p className='text-sm font-medium leading-normal'>
								Dashboard
							</p>
						</a>
						<a
							className='flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg'
							href='#'
						>
							<span className='material-symbols-outlined'>
								report
							</span>
							<p className='text-sm font-medium leading-normal'>
								My Issues
							</p>
						</a>
						<a
							className='flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg'
							href='#'
						>
							<span className='material-symbols-outlined'>
								notifications
							</span>
							<p className='text-sm font-medium leading-normal'>
								Notifications
							</p>
						</a>
						<a
							className='flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg'
							href='#'
						>
							<span className='material-symbols-outlined'>
								settings
							</span>
							<p className='text-sm font-medium leading-normal'>
								Settings
							</p>
						</a>
					</div>
				</div>
			</aside>
		</>
	);
}
