"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/theme_context";
import { Button } from "../components/ui";
import { Footer } from "../components/layout";
import { CoreService } from "../modules";
import { GuestOnly, LoginRequired } from "../z_internals/components/auth";

const features = [
	{
		icon: "report_problem",
		title: "Report Issues",
		description:
			"Quickly report local issues like potholes, broken streetlights, or graffiti with photos and precise location.",
	},
	{
		icon: "track_changes",
		title: "Track Progress",
		description:
			"Follow the status of your reported issues from submission to resolution in real-time.",
	},
	{
		icon: "groups",
		title: "Community Engagement",
		description:
			"Upvote important issues, add comments, and collaborate with neighbors for a better community.",
	},
	{
		icon: "verified",
		title: "Verified Resolvers",
		description:
			"Issues are handled by verified government officials and authorized service providers.",
	},
];

const howItWorks = [
	{
		step: "1",
		title: "Sign Up",
		description: "Create your account as a citizen or authority resolver.",
	},
	{
		step: "2",
		title: "Report",
		description: "Snap a photo, add details, and submit the issue.",
	},
	{
		step: "3",
		title: "Track",
		description: "Monitor progress as authorities acknowledge and resolve.",
	},
	{
		step: "4",
		title: "Resolved",
		description: "Get notified when your issue is fixed.",
	},
];
function LandingPageUi() {
	const { darkMode, toggleDarkMode } = useTheme();
	const [stats, setStats] = useState({
		issuesReported: "10K+",
		issuesResolved: "8.5K+",
		activeMembers: "5K+",
		avgResolutionTime: "48h",
	});

	// Fetch platform stats on mount
	useEffect(() => {
		const fetchStats = async () => {
			try {
				// const response = await CoreService.getPlatformStats();
				// if (response.success && response.data) {
				// 	setStats({
				// 		issuesReported:
				// 			response.data.total_issues ||
				// 			response.data.issuesReported ||
				// 			"10K+",
				// 		issuesResolved:
				// 			response.data.resolved_issues ||
				// 			response.data.issuesResolved ||
				// 			"8.5K+",
				// 		activeMembers:
				// 			response.data.total_users ||
				// 			response.data.activeMembers ||
				// 			"5K+",
				// 		avgResolutionTime:
				// 			response.data.avg_resolution_time ||
				// 			response.data.avgResolutionTime ||
				// 			"48h",
				// 	});
				// }
			} catch (error) {
				console.error("Failed to fetch platform stats:", error);
				// Keep default stats on error
			}
		};
		fetchStats();
	}, []);

	return (
		<>
			<div className='min-h-screen bg-background-light dark:bg-background-dark'>
				{/* Navigation */}
				<header className='sticky top-0 z-50 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark'>
					<nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='flex items-center justify-between h-16'>
							{/* Logo */}
							<Link href='/' className='flex items-center gap-3'>
								<div className='size-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600'>
									<span className='material-symbols-outlined text-white text-xl'>
										location_city
									</span>
								</div>
								<span className='text-xl font-bold text-text-primary-light dark:text-text-primary-dark'>
									TownSpark
								</span>
							</Link>

							{/* Desktop Nav */}
							<div className='hidden md:flex items-center gap-8'>
								<Link
									href='/explore'
									className='text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors'
								>
									Explore Issues
								</Link>
								<Link
									href='/about'
									className='text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors'
								>
									About Us
								</Link>
								<Link
									href='/contact'
									className='text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors'
								>
									Contact
								</Link>
							</div>

							{/* Actions */}
							<div className='flex items-center gap-3'>
								<button
									onClick={toggleDarkMode}
									className='size-10 rounded-full flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors'
								>
									<span className='material-symbols-outlined'>
										{darkMode ? "light_mode" : "dark_mode"}
									</span>
								</button>
								<Link href='/login'>
									<Button variant='ghost' size='sm'>
										Login
									</Button>
								</Link>
								<Link
									href='/register'
									className='hidden sm:block'
								>
									<Button size='sm'>Get Started</Button>
								</Link>
							</div>
						</div>
					</nav>
				</header>

				{/* Hero Section */}
				<section className='relative overflow-hidden'>
					{/* Background Pattern */}
					<div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5' />
					<div className='absolute top-20 left-10 size-72 bg-primary/10 rounded-full blur-3xl' />
					<div className='absolute bottom-20 right-10 size-72 bg-blue-500/10 rounded-full blur-3xl' />

					<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32'>
						<div className='text-center max-w-3xl mx-auto'>
							<h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary-light dark:text-text-primary-dark leading-tight'>
								Build a Better{" "}
								<span className='text-primary'>Community</span>{" "}
								Together
							</h1>
							<p className='mt-6 text-lg sm:text-xl text-text-secondary-light dark:text-text-secondary-dark'>
								Report local issues, track their resolution, and
								engage with your neighbors. TownSpark connects
								citizens with authorities for faster,
								transparent civic action.
							</p>
							<div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4'>
								<Link href='/register'>
									<Button
										size='lg'
										className='w-full sm:w-auto px-8'
									>
										<span className='material-symbols-outlined mr-2'>
											rocket_launch
										</span>
										Get Started Free
									</Button>
								</Link>
								<Link href='/explore'>
									<Button
										variant='outline'
										size='lg'
										className='w-full sm:w-auto px-8'
									>
										<span className='material-symbols-outlined mr-2'>
											explore
										</span>
										Explore Issues
									</Button>
								</Link>
							</div>
						</div>

						{/* Stats */}
						<div className='mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto'>
							{[
								{
									value: stats.issuesReported,
									label: "Issues Reported",
								},
								{
									value: stats.issuesResolved,
									label: "Issues Resolved",
								},
								{
									value: stats.activeMembers,
									label: "Active Users",
								},
								{
									value: stats.avgResolutionTime,
									label: "Avg Resolution",
								},
							].map((stat, idx) => (
								<div
									key={idx}
									className='text-center p-4 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark'
								>
									<p className='text-2xl sm:text-3xl font-bold text-primary'>
										{stat.value}
									</p>
									<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1'>
										{stat.label}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className='py-20 bg-card-light dark:bg-card-dark'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='text-center max-w-2xl mx-auto mb-16'>
							<h2 className='text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark'>
								Everything You Need
							</h2>
							<p className='mt-4 text-text-secondary-light dark:text-text-secondary-dark'>
								Powerful features to help you report, track, and
								resolve community issues efficiently.
							</p>
						</div>

						<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
							{features.map((feature, idx) => (
								<div
									key={idx}
									className='p-6 bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow'
								>
									<div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4'>
										<span className='material-symbols-outlined text-primary text-2xl'>
											{feature.icon}
										</span>
									</div>
									<h3 className='text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2'>
										{feature.title}
									</h3>
									<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
										{feature.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* How It Works */}
				<section className='py-20'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='text-center max-w-2xl mx-auto mb-16'>
							<h2 className='text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark'>
								How It Works
							</h2>
							<p className='mt-4 text-text-secondary-light dark:text-text-secondary-dark'>
								Four simple steps to make your community better.
							</p>
						</div>

						<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-8'>
							{howItWorks.map((item, idx) => (
								<div key={idx} className='relative text-center'>
									{/* Connector Line */}
									{idx < howItWorks.length - 1 && (
										<div className='hidden lg:block absolute top-6 left-1/2 w-full h-0.5 bg-border-light dark:bg-border-dark' />
									)}
									<div className='relative z-10 size-12 rounded-full bg-primary text-white text-lg font-bold flex items-center justify-center mx-auto mb-4'>
										{item.step}
									</div>
									<h3 className='text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2'>
										{item.title}
									</h3>
									<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
										{item.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className='py-20 bg-primary'>
					<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
						<h2 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
							Ready to Make a Difference?
						</h2>
						<p className='text-lg text-white/80 mb-8'>
							Join thousands of citizens working together to build
							better communities.
						</p>
						<Link href='/register'>
							<Button
								variant='secondary'
								size='lg'
								className='bg-white text-primary hover:bg-white/90'
							>
								Create Your Free Account
							</Button>
						</Link>
					</div>
				</section>

				{/* Footer */}
				<Footer />
			</div>
		</>
	);
}

export default function LandingPage() {
	return (
		<GuestOnly redirectTo='/feed'>
			<LandingPageUi />
		</GuestOnly>
	);
}
