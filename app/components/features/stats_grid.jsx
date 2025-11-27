"use client";

import { StatCard } from "../ui";

export default function StatsGrid({ stats = [], columns = 4, className = "" }) {
	const gridCols = {
		2: "grid-cols-2",
		3: "grid-cols-2 md:grid-cols-3",
		4: "grid-cols-2 md:grid-cols-4",
		5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
		6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
	};

	return (
		<div
			className={`grid gap-4 ${gridCols[columns] || gridCols[4]} ${className}`}
		>
			{stats.map((stat, index) => (
				<StatCard
					key={stat.id || index}
					label={stat.label}
					value={stat.value}
					icon={stat.icon}
					trend={stat.trend}
					trendValue={stat.trendValue}
					accent={stat.accent}
				/>
			))}
		</div>
	);
}
