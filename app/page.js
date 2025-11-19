"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import DashboardCard from "./components/dashboard_card";
import NavigationDrawer from "./components/navigation_drawer";
import AppBar from "./components/app_bar";

export default function Home() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const reports = [
		{
			id: 1,
			category: "Road Damage",
			categoryColor: "orange",
			title: "Large Pothole on Main St",
			status: "Reported",
			statusColor: "orange",
			location: "Near City Hall, 123 Main St",
			timeAgo: "2 days ago",
			likes: 15,
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGDRcQfE90rTrAjxQZai_cdhDmAyIDfGlrhtY-VQIWDEJKmyU-ICrHeqAD7oSuptSUYVN88W8oV-n_wl-OuZFQdpHiLTHhqA9P0bCZ0mEbHtL1Hmzcx1F4raCtTkm4-4RDw_Zs_99Tc7g3130UJL6oilDUxJrBHtGRdQFMtgpGTo6qyYybr8wr5EdJ7bNL_Qcktzhrw9QiH5AK4LZCnh7IR0zReZBl9sHaJ1slyHsHGNVQW0EtvbOWfOip42TCKrKdXP-Zm3YipekS",
			imageAlt:
				"A large, deep pothole on an asphalt street next to a curb.",
		},
		{
			id: 2,
			category: "Waste Management",
			categoryColor: "blue",
			title: "Overflowing Garbage Can",
			status: "In Progress",
			statusColor: "blue",
			location: "Oak Street Park Entrance",
			timeAgo: "5 days ago",
			likes: 8,
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPfAz_4SJuq5JxbB9Tn-CagjmZu-Jc-uKSd7uqYTdQbL9VwgiZYvLtWUVw9Fj68LbE4WRuyg7Hng0DXOd4e7j7j_dyKqlbMC4VwH0btHUm9ZlNMGqFWFcGgBclcNcIDB1VNKa2xajsNHYN0cLVjRX4ThmA8ki3hygTlRaQw1jzbP0qRRV29pN3fDgNrT7qmd_2eXQ-rZhGlxKyPuvfdfbYz4Od0PDbY2Xeh--jUgTprH9GyTEtYZOsbswHdoHsng2_WTtSet-UuxMh",
			imageAlt:
				"An overflowing public trash can in a park with litter on the ground around it.",
		},
		{
			id: 3,
			category: "Infrastructure",
			categoryColor: "green",
			title: "Broken Sidewalk",
			status: "Resolved",
			statusColor: "green",
			location: "45 Pine Avenue",
			timeAgo: "1 week ago",
			likes: 23,
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2oqAEfSbQezszaqYtEZsUDsvxtf4Pb6EOQclNKwp0Ak5cqrSbJ72NVuPVGZdnMkThr8laStbvRridY8hhSqgh1ZHW_87AG-cE7NBpRW1rc3sJYFUAEiQo_6Sma43hHOiSSN0KzffBRA5-0hMrG4M0fwkaETdXpkLEFDGlRM-XUy3kMC7XNcC4jnEBklIIzXBPSwzMakv8iOS1xlODrz8iAWBgHyWl_QE_IamUnCS46FxEAYIyfdmEbt6spaL5AYZ5tc99VgPx7Hcp",
			imageAlt:
				"A cracked and uneven sidewalk with raised sections creating a tripping hazard.",
		},
		{
			id: 4,
			category: "Brain damage",
			categoryColor: "green",
			title: "Severe Brain Injury Case",
			status: "Under Review",
			statusColor: "blue",
			location: "General Hospital, 789 Health St",
			timeAgo: "3 days ago",
			likes: 30,
			image: "",
			imageAlt: "MRI scan showing areas of brain damage.",
		},
		{
			id: 5,
			category: "Water Supply",
			categoryColor: "teal",
			title: "Contaminated Drinking Water",
			status: "Reported",
			statusColor: "orange",
			location: "Maplewood Residential Area",
			timeAgo: "4 days ago",
			likes: 12,
			image: "https://static.vecteezy.com/system/resources/thumbnails/002/187/276/small/mineral-drinking-water-on-wood-table-and-water-in-glass-photo.jpg"
		}
	];

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-zinc-950 font-display'>
			<NavigationDrawer
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
			/>
			<AppBar onMenuClick={() => setIsDrawerOpen(true)} />

			{/* Main Content */}
			<main className='p-4 pb-24'>
				<div className='mx-auto max-w-2xl space-y-4'>
					{/* Pass the report as a prop to DashboardCard */}
					{reports.map((report) => (
						<DashboardCard key={report.id} report={report} />
					))}
				</div>
			</main>

			{/* Floating Action Button */}
			<Link href='/add'>
				<button className='fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 dark:bg-green-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95'>
					<span className='material-symbols-outlined text-3xl'>
						add
					</span>
				</button>
			</Link>
		</div>
	);
}
