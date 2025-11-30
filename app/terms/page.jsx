"use client";

import { useRouter } from "next/navigation";

const sections = [
	{
		title: "1. Introduction",
		content:
			"Welcome to TownSpark. These terms govern your use of our app and services, designed to help you report and resolve local community issues. By creating an account or using TownSpark, you agree to these terms.",
	},
	{
		title: "2. User Accounts & Responsibilities",
		content:
			"You are responsible for safeguarding your account and for all activities that occur under it. You must provide accurate and complete information and keep your account information updated. Do not share your account credentials with others.",
	},
	{
		title: "3. Acceptable Use Policy",
		content: (
			<>
				You agree not to use TownSpark to post any content that is
				unlawful, harmful, threatening, abusive, harassing, defamatory,
				vulgar, obscene, or otherwise objectionable. This includes, but
				is not limited to:
				<ul className='list-disc space-y-2 px-9 pb-3 pt-1 text-base font-normal leading-relaxed text-text-light dark:text-text-dark'>
					<li>Spreading misinformation or false reports.</li>
					<li>Harassing other users or community officials.</li>
					<li>
						Posting personally identifiable information without
						consent.
					</li>
					<li>Impersonating any person or entity.</li>
				</ul>
			</>
		),
	},
	{
		title: "4. Content Ownership",
		content:
			"You retain ownership of the content you submit (photos, reports, comments). However, by submitting content, you grant TownSpark a worldwide, royalty-free, non-exclusive license to use, reproduce, modify, and distribute your content in connection with operating and promoting the service.",
	},
	{
		title: "5. Termination",
		content:
			"We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.",
	},
];

export default function TermsOfServicePage() {
	const router = useRouter();

	return (
		<div className='relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display'>
			{/* Header */}
			<header className='sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-200/10 bg-background-light/80 px-4 backdrop-blur-sm dark:bg-background-dark/80'>
				<button
					className='flex size-10 shrink-0 items-center justify-center hover:opacity-80'
					onClick={() => router.back()}
				>
					<span className='material-symbols-outlined text-text-light dark:text-text-dark'>
						arrow_back_ios_new
					</span>
				</button>
				<h1 className='flex-1 text-center text-lg font-bold text-text-light dark:text-text-dark'>
					Terms of Service
				</h1>
				<button
					className='flex size-10 shrink-0 items-center justify-center hover:opacity-80'
					onClick={() => router.push("/")}
				>
					{" "}
					{/* Close button */}
					<span className='material-symbols-outlined text-text-light dark:text-text-dark'>
						close
					</span>
				</button>
			</header>
			<main className='flex-1 pb-40'>
				<p className='px-4 pt-4 text-sm font-normal text-text-secondary-light dark:text-text-secondary-dark'>
					Last updated: October 26, 2023
				</p>
				{sections.map((section, idx) => (
					<section key={section.title}>
						<h2 className='px-4 pb-2 pt-5 text-2xl font-bold tracking-tight text-text-light dark:text-text-dark'>
							{section.title}
						</h2>
						<div className='px-4 pb-3 pt-1 text-base font-normal leading-relaxed text-text-light dark:text-text-dark'>
							{section.content}
						</div>
					</section>
				))}
			</main>
			<footer className='fixed bottom-0 left-0 right-0 border-t border-gray-200/10 bg-background-light/90 p-4 backdrop-blur-sm dark:bg-background-dark/90'>
				<div className='flex flex-col gap-4'>
					<button className='flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-base font-bold text-white transition-colors hover:bg-primary/90'>
						Accept & Continue
					</button>
					<button className='flex w-full items-center justify-center rounded-xl bg-transparent px-4 py-3.5 text-base font-bold text-text-secondary-light transition-colors hover:bg-gray-500/10 dark:text-text-secondary-dark'>
						Decline
					</button>
				</div>
			</footer>
		</div>
	);
}
