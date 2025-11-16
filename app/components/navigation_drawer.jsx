"use client";

export default function NavigationDrawer({ isOpen, onClose }) {
	if (!isOpen) return null;

	return (
		<>
			<div className='fixed left-0 top-0 z-50 size-full min-h-screen'>
				{/* Backdrop */}
				<div
					className='absolute inset-0 bg-black/40'
					onClick={onClose}
				/>
				{/* Drawer */}
				<div className='relative flex h-full min-h-screen w-10/12 max-w-sm flex-col bg-white dark:bg-background-dark shadow-xl'>
					{/* Header Section */}
					<div className='flex flex-col gap-4 p-6 border-b border-zinc-200 dark:border-zinc-800'>
						<img
							alt='User avatar'
							className='size-16 rounded-full object-cover'
							src='https://lh3.googleusercontent.com/aida-public/AB6AXuCVpiMBKeHGZZWYVTuzW7sRjn7XybfROUT83n4O4bIowt7d9DMEwPeW3-bwQcXOysnmxvQPojPQSR2PqdtnBWr54j2NmWGdqHjABR0VXUlV1Jv0CBUQt7YNstiNMEDpffm4mv9ouvQQzG2tPEYo_I2SBVxFMOT6oWygup-DzHZNI0pfIk2Ixd9to7a7YqEHsJuYNbeQQ-umIPnuo1-wUwIelWRvBhRTXmqs-wwH4PzWE-6fSrXLFCGE4U4dD1B3lYi6Pbb2CLV9cyc'
						/>
						<div>
							<p className='text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight'>
								John Doe
							</p>
							<p className='text-sm font-normal text-zinc-500 dark:text-zinc-400 leading-normal'>
								batman@bruce_wayne.com
							</p>
						</div>
					</div>
					{/* Navigation List */}
					<div className='flex-grow overflow-y-scroll'>
						<ul className='flex flex-col gap-2'>
							<li className='flex h-12 items-center gap-4 rounded-lg px-4 bg-primary/20 dark:bg-primary/30'>
								<span className='material-symbols-outlined text-primary'>
									dashboard
								</span>
								<p className='text-base font-bold text-primary leading-tight truncate'>
									Dashboard
								</p>
							</li>
							<li className='flex h-12 items-center gap-4 rounded-lg px-4'>
								<span className='material-symbols-outlined text-zinc-600 dark:text-zinc-400'>
									history
								</span>
								<p className='text-base font-medium text-zinc-800 dark:text-zinc-200 leading-tight truncate'>
									My Complaints
								</p>
							</li>
							<li className='flex h-12 items-center gap-4 rounded-lg px-4'>
								<span className='material-symbols-outlined text-zinc-600 dark:text-zinc-400'>
									add_circle
								</span>
								<p className='text-base font-medium text-zinc-800 dark:text-zinc-200 leading-tight truncate'>
									New Complaint
								</p>
							</li>
							<li className='flex h-12 items-center gap-4 rounded-lg px-4'>
								<span className='material-symbols-outlined text-zinc-600 dark:text-zinc-400'>
									settings
								</span>
								<p className='text-base font-medium text-zinc-800 dark:text-zinc-200 leading-tight truncate'>
									Settings
								</p>
							</li>
							<li className='flex h-12 items-center gap-4 rounded-lg px-4'>
								<span className='material-symbols-outlined text-zinc-600 dark:text-zinc-400'>
									admin_panel_settings
								</span>
								<p className='text-base font-medium text-zinc-800 dark:text-zinc-200 leading-tight truncate'>
									Admin Panel
								</p>
							</li>
							<li className='flex h-12 items-center gap-4 rounded-lg px-4'>
								<span className='material-symbols-outlined text-zinc-600 dark:text-zinc-400'>
									help
								</span>
								<p className='text-base font-medium text-zinc-800 dark:text-zinc-200 leading-tight truncate'>
									Help &amp; Support
								</p>
							</li>
							<li className='flex h-12 items-center gap-4 rounded-lg px-4'>
								<span className='material-symbols-outlined text-zinc-600 dark:text-zinc-400'>
									info
								</span>
								<p className='text-base font-medium text-zinc-800 dark:text-zinc-200 leading-tight truncate'>
									About Us
								</p>
							</li>
						</ul>
					</div>
					{/* Footer Section */}
					<div className='mt-auto p-4 border-t border-zinc-200 dark:border-zinc-800'>
						<div className='flex items-center gap-4 min-h-14 px-4 cursor-pointer'>
							<span className='material-symbols-outlined text-zinc-600 dark:text-zinc-400 flex items-center justify-center shrink-0 size-10'>
								logout
							</span>
							<p className='text-base font-medium text-zinc-800 dark:text-zinc-200 flex-1 truncate'>
								Logout
							</p>
						</div>
						<p className='text-zinc-500 dark:text-zinc-400 text-sm font-normal leading-normal pb-3 pt-1 px-4'>
							Version 1.0.2
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
