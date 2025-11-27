"use client";

import { Badge } from "../ui";

const defaultStatuses = [
	{
		key: "reported",
		label: "Issue Reported",
		icon: "flag",
		description: "Issue has been submitted",
	},
	{
		key: "acknowledged",
		label: "Acknowledged",
		icon: "visibility",
		description: "Issue has been reviewed by authorities",
	},
	{
		key: "in-progress",
		label: "In Progress",
		icon: "engineering",
		description: "Work is underway to resolve this issue",
	},
	{
		key: "resolved",
		label: "Resolved",
		icon: "check_circle",
		description: "Issue has been successfully resolved",
	},
];

export default function StatusTimeline({
	currentStatus = "reported",
	updates = [],
	statuses = defaultStatuses,
	className = "",
}) {
	const currentStatusIndex = statuses.findIndex(
		(s) => s.key === currentStatus
	);

	const formatDate = (dateString) => {
		if (!dateString) return null;
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getStatusUpdate = (statusKey) => {
		return updates.find((u) => u.status === statusKey);
	};

	return (
		<div className={className}>
			<h3 className='text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4'>
				Status Timeline
			</h3>

			<div className='relative'>
				{statuses.map((status, index) => {
					const isCompleted = index <= currentStatusIndex;
					const isCurrent = index === currentStatusIndex;
					const update = getStatusUpdate(status.key);

					return (
						<div
							key={status.key}
							className='flex gap-4 pb-6 last:pb-0'
						>
							{/* Timeline Line & Dot */}
							<div className='flex flex-col items-center'>
								<div
									className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
										isCompleted
											? isCurrent
												? "bg-primary text-white"
												: "bg-status-resolved text-white"
											: "bg-background-light dark:bg-background-dark border-2 border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark"
									}`}
								>
									<span className='material-symbols-outlined text-lg'>
										{isCompleted && !isCurrent
											? "check"
											: status.icon}
									</span>
								</div>
								{index < statuses.length - 1 && (
									<div
										className={`w-0.5 flex-1 mt-2 ${
											index < currentStatusIndex
												? "bg-status-resolved"
												: "bg-border-light dark:bg-border-dark"
										}`}
									/>
								)}
							</div>

							{/* Content */}
							<div className='flex-1 min-w-0 pt-1'>
								<div className='flex items-center gap-2 flex-wrap'>
									<span
										className={`font-semibold ${
											isCompleted
												? "text-text-primary-light dark:text-text-primary-dark"
												: "text-text-secondary-light dark:text-text-secondary-dark"
										}`}
									>
										{status.label}
									</span>
									{isCurrent && (
										<Badge status={status.key} size='sm' />
									)}
								</div>
								<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark mt-0.5'>
									{status.description}
								</p>
								{update && (
									<div className='mt-2 p-3 bg-background-light dark:bg-background-dark rounded-lg'>
										{update.message && (
											<p className='text-sm text-text-primary-light dark:text-text-primary-dark'>
												{update.message}
											</p>
										)}
										<div className='flex items-center gap-2 mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark'>
											{update.updatedBy && (
												<span>
													by {update.updatedBy}
												</span>
											)}
											{update.updatedAt && (
												<span>
													•{" "}
													{formatDate(
														update.updatedAt
													)}
												</span>
											)}
										</div>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
