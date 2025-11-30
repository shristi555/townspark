"use client";

import { useRouter } from "next/navigation";

const privacySections = [
	{
		title: "Introduction",
		content:
			"A brief, plain-language summary of TownSpark's commitment to user privacy. We value your trust and are dedicated to protecting your personal information.",
	},
	{
		title: "Information We Collect",
		content:
			"We collect data you provide (e.g., name, email, report details, photos) and data collected automatically (e.g., location for reports, device info).",
	},
	{
		title: "How We Use Your Information",
		content:
			"Your information is used to operate and improve the service, communicate with you and municipal authorities, and for analytics and safety purposes.",
	},
	{
		title: "How We Share Your Information",
		content:
			"We share information with local government partners to resolve issues, with third-party service providers, and may share anonymized data for public reporting.",
	},
	{
		title: "Data Security & Storage",
		content:
			"We implement industry-standard security measures to protect your data. Information is stored on secure servers to prevent unauthorized access.",
	},
	{
		title: "Your Rights & Choices",
		content:
			"You have the right to access, update, or request deletion of your personal data. You can manage your preferences within the app's settings.",
	},
	{
		title: "Changes to This Policy",
		content:
			"We may update this policy from time to time. We will notify you of any significant changes by posting the new policy on this page and through in-app notifications.",
	},
];

export default function PrivacyPolicyPage() {
	const router = useRouter();

	return (
		<div className='relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display'>
			{/* Top App Bar */}
			<div className='sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 p-4 pb-2 backdrop-blur-sm justify-between border-b border-slate-200/10 dark:border-slate-800/50'>
				<button
					className='flex size-12 shrink-0 items-center justify-start text-slate-800 dark:text-white hover:opacity-80'
					onClick={() => router.back()}
				>
					<span className='material-symbols-outlined text-2xl'>
						arrow_back_ios_new
					</span>
				</button>
				<h2 className='flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white'>
					Privacy Policy
				</h2>
				<div className='w-12'></div>
			</div>
			{/* Main Content */}
			<main className='flex-1'>
				{/* Header Section */}
				<div className='px-4 pt-6 pb-3'>
					<div className='flex items-center gap-3 mb-4'>
						<div className='flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20'>
							<span className='material-symbols-outlined text-3xl text-primary'>
								shield
							</span>
						</div>
						<h1 className='text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight'>
							Your Privacy at TownSpark
						</h1>
					</div>
					<p className='text-slate-600 dark:text-slate-400 text-base font-normal leading-normal'>
						Last Updated: October 26, 2023
					</p>
				</div>
				{/* Accordions Section */}
				<div className='flex flex-col px-4'>
					{privacySections.map((section, idx) => (
						<details
							key={section.title}
							className='flex flex-col border-t border-slate-200 dark:border-slate-800 py-2 group'
						>
							<summary className='flex cursor-pointer list-none items-center justify-between gap-6 py-2'>
								<p className='text-slate-800 dark:text-white text-base font-medium leading-normal'>
									{section.title}
								</p>
								<div className='text-slate-600 dark:text-slate-400 transition-transform duration-200 group-open:rotate-180'>
									<span className='material-symbols-outlined text-xl'>
										expand_more
									</span>
								</div>
							</summary>
							<p className='text-slate-600 dark:text-slate-300 text-sm font-normal leading-normal pb-2'>
								{section.content}
							</p>
						</details>
					))}
					<div className='border-b border-slate-200 dark:border-slate-800'></div>
				</div>
				{/* Contact Us Section */}
				<div className='p-4 mt-6 mb-8'>
					<div className='rounded-xl bg-slate-100 dark:bg-slate-800/50 p-6'>
						<h3 className='text-lg font-bold text-slate-900 dark:text-white mb-2'>
							Contact Us
						</h3>
						<p className='text-sm text-slate-600 dark:text-slate-300 mb-4'>
							If you have any questions about this Privacy Policy,
							please contact us.
						</p>
						<a
							className='flex items-center gap-3 rounded-lg bg-primary/20 dark:bg-primary/30 p-3 text-sm font-semibold text-primary dark:text-primary-300 transition-colors hover:bg-primary/30 dark:hover:bg-primary/40'
							href='mailto:privacy@townspark.com'
						>
							<span className='material-symbols-outlined'>
								email
							</span>
							privacy@townspark.com
						</a>
					</div>
				</div>
			</main>
		</div>
	);
}
