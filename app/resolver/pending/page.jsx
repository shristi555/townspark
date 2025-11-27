"use client";

import Link from "next/link";
import { useTheme } from "../../contexts/theme_context";
import { Button } from "../../components/ui";

export default function ResolverPendingPage() {
	const { darkMode, toggleDarkMode } = useTheme();

	return (
		<div className='min-h-screen bg-background-light dark:bg-background-dark flex flex-col'>
			{/* Header */}
			<header className='p-4 sm:p-6 flex items-center justify-between border-b border-border-light dark:border-border-dark'>
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
				<button
					onClick={toggleDarkMode}
					className='size-10 rounded-full flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors'
				>
					<span className='material-symbols-outlined'>
						{darkMode ? "light_mode" : "dark_mode"}
					</span>
				</button>
			</header>

			{/* Content */}
			<main className='flex-1 flex items-center justify-center px-4 py-12'>
				<div className='max-w-md w-full text-center'>
					{/* Icon */}
					<div className='size-24 mx-auto mb-6 rounded-full bg-yellow-500/10 flex items-center justify-center'>
						<span className='material-symbols-outlined text-5xl text-yellow-500'>
							hourglass_top
						</span>
					</div>

					{/* Title */}
					<h1 className='text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-3'>
						Verification Pending
					</h1>

					{/* Description */}
					<p className='text-text-secondary-light dark:text-text-secondary-dark mb-6'>
						Thank you for registering as a resolver! Your account is
						currently under review. An administrator will verify
						your credentials and approve your account shortly.
					</p>

					{/* Status Card */}
					<div className='bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6 mb-6'>
						<div className='flex items-center justify-between mb-4'>
							<span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
								Application Status
							</span>
							<span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'>
								<span className='size-2 rounded-full bg-yellow-500 animate-pulse' />
								Pending Review
							</span>
						</div>

						<div className='space-y-3 text-left'>
							<div className='flex items-center gap-3'>
								<span className='material-symbols-outlined text-green-500'>
									check_circle
								</span>
								<span className='text-sm text-text-primary-light dark:text-text-primary-dark'>
									Account created successfully
								</span>
							</div>
							<div className='flex items-center gap-3'>
								<span className='material-symbols-outlined text-green-500'>
									check_circle
								</span>
								<span className='text-sm text-text-primary-light dark:text-text-primary-dark'>
									Documents uploaded
								</span>
							</div>
							<div className='flex items-center gap-3'>
								<span className='material-symbols-outlined text-yellow-500'>
									schedule
								</span>
								<span className='text-sm text-text-primary-light dark:text-text-primary-dark'>
									Awaiting admin verification
								</span>
							</div>
						</div>
					</div>

					{/* Info */}
					<div className='p-4 rounded-lg bg-primary/5 border border-primary/20 mb-6 text-left'>
						<div className='flex items-start gap-3'>
							<span className='material-symbols-outlined text-primary'>
								info
							</span>
							<div>
								<p className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
									What happens next?
								</p>
								<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1'>
									We'll send you an email once your account
									has been verified. This usually takes 1-2
									business days.
								</p>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className='flex flex-col sm:flex-row gap-3'>
						<Link href='/' className='flex-1'>
							<Button variant='outline' fullWidth>
								<span className='material-symbols-outlined mr-2'>
									home
								</span>
								Back to Home
							</Button>
						</Link>
						<Link href='/contact' className='flex-1'>
							<Button fullWidth>
								<span className='material-symbols-outlined mr-2'>
									support
								</span>
								Contact Support
							</Button>
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
}
