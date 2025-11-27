function getCategoryColorClass(color) {
	const colors = {
		orange: "text-orange-500 dark:text-orange-400",
		blue: "text-blue-500 dark:text-blue-400",
		green: "text-green-600 dark:text-green-500",
	};
	return colors[color] || "text-gray-600 dark:text-gray-400";
}

function getStatusColorClass(color) {
	const colors = {
		orange: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
		blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
		green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
	};
	return (
		colors[color] ||
		"bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
	);
}

export default function DashboardCard({ report }) {
	return (
		<div
			key={report.id}
			className='overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 shadow-md dark:shadow-zinc-950/50'
		>
			{/* Image */}
			<div
				className='aspect-video w-full bg-cover bg-center'
				style={{
					backgroundImage: `url("${report.image}")`,
				}}
				role='img'
				aria-label={report.imageAlt}
			></div>

			{/* Content */}
			<div className='p-4'>
				<div className='flex items-start justify-between gap-3 mb-3'>
					<div className='flex-1'>
						<p
							className={`text-sm font-medium mb-1 ${getCategoryColorClass(
								report.categoryColor
							)}`}
						>
							{report.category}
						</p>
						<h2 className='text-lg font-bold text-gray-900 dark:text-white leading-tight'>
							{report.title}
						</h2>
					</div>
					<span
						className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${getStatusColorClass(
							report.statusColor
						)}`}
					>
						{report.status}
					</span>
				</div>

				{/* Location */}
				<div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3'>
					<span className='material-symbols-outlined text-lg'>
						location_on
					</span>
					<span>{report.location}</span>
				</div>

				{/* Footer */}
				<div className='flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-3'>
					<div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
						<span className='material-symbols-outlined text-lg'>
							schedule
						</span>
						<span>{report.timeAgo}</span>
					</div>
					<button className='flex items-center gap-2 rounded-full px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors'>
						<span className='material-symbols-outlined text-xl'>
							thumb_up
						</span>
						<span className='text-sm font-semibold'>
							{report.likes}
						</span>
					</button>
				</div>
			</div>
		</div>
	);
}
