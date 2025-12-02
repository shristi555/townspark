"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GuestOnly } from "./z_internals/components/auth";

// This page redirects to the appropriate landing or feed page
// In a real app, this would check auth state and redirect accordingly
function HomeUi() {
	const router = useRouter();

	useEffect(() => {
		// For demo purposes, redirect to the public landing page
		// In production, check auth state:
		// - If authenticated, go to /feed
		// - If not authenticated, go to landing page
		router.replace("/landing");
	}, [router]);

	return (
		<div className='min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center'>
			<div className='animate-pulse flex flex-col items-center gap-4'>
				<div className='size-16 rounded-full bg-primary/20 flex items-center justify-center'>
					<span className='material-symbols-outlined text-primary text-3xl'>
						location_city
					</span>
				</div>
				<p className='text-text-secondary-light dark:text-text-secondary-dark'>
					Loading TownSpark...
				</p>
			</div>
		</div>
	);
}

export default function Home() {
	return (
		<GuestOnly redirectTo='/feed'>
			<HomeUi />
		</GuestOnly>
	);
}
