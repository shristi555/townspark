"use client";

export default function AppBar({ onMenuClick }) {
	return (
		<header className='sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-4 shadow-sm'>
			<div className='flex items-center gap-3'>
				<button
					onClick={onMenuClick}
					className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-transparent text-gray-600 hover:bg-gray-100 transition-colors'
				>
					<span className='material-symbols-outlined text-2xl'>
						menu
					</span>
				</button>
				<h1 className='text-xl font-bold text-gray-900'>
					Community Reports
				</h1>
			</div>
			<div className='flex items-center gap-2'>
				<button className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-transparent text-gray-600 hover:bg-gray-100 transition-colors'>
					<span className='material-symbols-outlined text-2xl'>
						search
					</span>
				</button>
				<button className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-transparent text-gray-600 hover:bg-gray-100 transition-colors'>
					<span className='material-symbols-outlined text-2xl'>
						filter_list
					</span>
				</button>
			</div>
		</header>
	);
}
