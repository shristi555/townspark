"use client";

import { useState } from "react";

export function Tabs({
	tabs,
	defaultTab,
	onChange,
	variant = "underline",
	className = "",
}) {
	const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

	const handleTabClick = (tabId) => {
		setActiveTab(tabId);
		onChange?.(tabId);
	};

	const variants = {
		underline: {
			container:
				"flex border-b border-border-light dark:border-border-dark",
			tab: (isActive) =>
				`flex-1 flex flex-col items-center justify-center pb-3 pt-4 border-b-[3px] transition-colors ${
					isActive
						? "border-b-primary text-primary"
						: "border-b-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
				}`,
			tabText: "text-sm font-bold leading-normal tracking-[0.015em]",
		},
		pills: {
			container:
				"flex h-10 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 p-1",
			tab: (isActive) =>
				`flex-1 flex cursor-pointer h-full items-center justify-center overflow-hidden rounded-md px-3 transition-all ${
					isActive
						? "bg-card-light dark:bg-card-dark shadow-sm text-primary"
						: "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
				}`,
			tabText: "text-sm font-medium leading-normal truncate",
		},
	};

	const style = variants[variant];

	return (
		<div className={`${style.container} ${className}`}>
			{tabs.map((tab) => (
				<button
					key={tab.id}
					onClick={() => handleTabClick(tab.id)}
					className={style.tab(activeTab === tab.id)}
				>
					<span className={style.tabText}>{tab.label}</span>
				</button>
			))}
		</div>
	);
}

export function TabPanel({ children, value, activeValue, className = "" }) {
	if (value !== activeValue) return null;
	return <div className={className}>{children}</div>;
}
