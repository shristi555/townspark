"use client";

import { useRouter } from "next/navigation";

const faqs = [
	{
		question: "How do I create an account?",
		answer: "To create an account, tap the 'Sign Up' button on the welcome screen. You can sign up using your email address, Google, or Apple account. Follow the on-screen prompts to complete your profile.",
		open: true,
	},
	{
		question: "How do I navigate the app?",
		answer: "The main navigation is at the bottom of the screen. You can switch between the 'Home' feed, 'New Report', and 'My Profile' tabs to access all the main features of TownSpark.",
	},
	{
		question: "How do I submit a new report?",
		answer: "Tap the 'New Report' button in the bottom navigation bar. Select a category, add a photo, describe the issue, confirm the location, and tap 'Submit'.",
	},
	{
		question: "How can I track my report status?",
		answer: "Go to the 'My Profile' tab and select 'My Reports'. Here you will find a list of all your submitted issues and their current status, such as 'Submitted', 'In Progress', or 'Resolved'.",
	},
];

const categories = [
	"Getting Started",
	"Reporting Issues",
	"Account",
	"Troubleshooting",
];

export default function HelpFaqPage() {
	const router = useRouter();

	return (
		<div className='relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display'>
			{/* Top App Bar */}
			<header className='flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-border-light dark:border-border-dark'>
				<button
					className='text-text-light-primary dark:text-text-dark-primary flex size-10 shrink-0 items-center justify-center hover:opacity-80'
					onClick={() => router.back()}
				>
					<span className='material-symbols-outlined text-2xl'>
						arrow_back_ios_new
					</span>
				</button>
				<h1 className='text-text-light-primary dark:text-text-dark-primary text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center'>
					Help & FAQ
				</h1>
				<div className='flex size-10 shrink-0 items-center'></div>
			</header>
			<main className='flex-1'>
				{/* Search Bar */}
				<div className='px-4 py-4 bg-background-light dark:bg-background-dark sticky top-[73px] z-10'>
					<label className='flex flex-col min-w-40 h-12 w-full'>
						<div className='flex w-full flex-1 items-stretch rounded-lg h-full'>
							<div className='text-text-light-secondary dark:text-text-dark-secondary flex border-none bg-surface-light dark:bg-surface-dark items-center justify-center pl-4 rounded-l-lg'>
								<span className='material-symbols-outlined'>
									search
								</span>
							</div>
							<input
								className='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-text-light-primary dark:text-text-dark-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-surface-light dark:bg-surface-dark h-full placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary px-4 pl-2 text-base font-normal leading-normal'
								placeholder='Search for help...'
								value=''
								readOnly
							/>
						</div>
					</label>
				</div>
				{/* Chips / Categories */}
				<div className='flex gap-3 px-4 pb-4 overflow-x-auto'>
					{categories.map((cat, idx) => (
						<button
							key={cat}
							className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full ${idx === 0 ? "bg-primary" : "bg-surface-light dark:bg-surface-dark"} pl-4 pr-4`}
						>
							<p
								className={
									idx === 0
										? "text-white text-sm font-medium leading-normal"
										: "text-text-light-primary dark:text-text-dark-primary text-sm font-medium leading-normal"
								}
							>
								{cat}
							</p>
						</button>
					))}
				</div>
				{/* Section Header */}
				<h2 className='text-text-light-primary dark:text-text-dark-primary text-xl font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4'>
					Getting Started
				</h2>
				{/* Accordions */}
				<div className='flex flex-col px-4'>
					{faqs.map((faq, idx) => (
						<details
							key={faq.question}
							className='flex flex-col border-b border-b-border-light dark:border-b-border-dark py-2 group'
							open={faq.open || false}
						>
							<summary className='flex cursor-pointer list-none items-center justify-between gap-6 py-3'>
								<p className='text-text-light-primary dark:text-text-dark-primary text-base font-medium leading-normal'>
									{faq.question}
								</p>
								<div className='text-text-light-secondary dark:text-text-dark-secondary transition-transform duration-300 group-open:rotate-180'>
									<span className='material-symbols-outlined'>
										expand_more
									</span>
								</div>
							</summary>
							<p className='text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-relaxed pb-3'>
								{faq.answer}
							</p>
						</details>
					))}
				</div>
				{/* Contact Support CTA */}
				<div className='mt-8 mb-6 px-4'>
					<div className='rounded-xl bg-surface-light dark:bg-surface-dark p-6 text-center'>
						<div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary'>
							<span className='material-symbols-outlined'>
								support_agent
							</span>
						</div>
						<h3 className='mt-4 text-lg font-bold text-text-light-primary dark:text-text-dark-primary'>
							Can't find an answer?
						</h3>
						<p className='mt-1 text-sm text-text-light-secondary dark:text-text-dark-secondary'>
							Our support team is here to help you with any
							questions.
						</p>
						<button className='mt-6 w-full h-12 rounded-lg bg-primary text-white font-bold text-base'>
							Contact Support
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}
