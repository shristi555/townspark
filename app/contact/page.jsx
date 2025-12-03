"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const socialLinks = [
	{
		name: "Facebook",
		href: "#",
		icon: (
			<svg
				className='h-8 w-8'
				fill='currentColor'
				viewBox='0 0 24 24'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'></path>
			</svg>
		),
	},
	{
		name: "Twitter",
		href: "#",
		icon: (
			<svg
				className='h-8 w-8'
				fill='currentColor'
				viewBox='0 0 24 24'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path d='M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.55v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21c7.35 0 11.37-6.08 11.37-11.37 0-.17 0-.34-.01-.51.78-.57 1.45-1.29 1.98-2.08z'></path>
			</svg>
		),
	},
	{
		name: "Instagram",
		href: "#",
		icon: (
			<svg
				className='h-8 w-8'
				fill='currentColor'
				viewBox='0 0 24 24'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919A118.665 118.665 0 0 1 12 2.163zm0 1.441c-3.141 0-3.504.012-4.724.068-2.694.124-3.955 1.39-4.08 4.08-.056 1.22-.067 1.574-.067 4.646 0 3.072.011 3.426.067 4.646.124 2.69 1.387 3.955 4.08 4.08 1.22.056 1.583.068 4.724.068s3.504-.012 4.724-.068c2.694-.124 3.955-1.39 4.08-4.08.056-1.22.067-1.574.067-4.646 0-3.072-.011-3.426-.067-4.646-.124-2.69-1.387-3.955-4.08-4.08-1.22-.056-1.583-.068-4.724-.068zm0 4.198c-2.395 0-4.342 1.947-4.342 4.342s1.947 4.342 4.342 4.342 4.342-1.947 4.342-4.342-1.947-4.342-4.342-4.342zm0 7.242c-1.599 0-2.9-1.301-2.9-2.9s1.301-2.9 2.9-2.9 2.9 1.301 2.9 2.9-1.301 2.9-2.9 2.9zm5.348-7.857c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25z'></path>
			</svg>
		),
	},
	{
		name: "Website",
		href: "#",
		icon: (
			<span
				className='material-symbols-outlined'
				style={{ fontSize: 32 }}
			>
				public
			</span>
		),
	},
];

export default function ContactPage() {
	const router = useRouter();

	return (
		<div className='relative mx-auto flex h-auto min-h-screen w-full  flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display'>
			{/* Top App Bar */}
			<header className='flex items-center p-4 pb-2 justify-between shrink-0'>
				<button
					className='flex size-12 shrink-0 items-center justify-start text-gray-800 dark:text-white hover:opacity-80'
					onClick={() => router.back()}
				>
					<span
						className='material-symbols-outlined'
						style={{ fontSize: 24 }}
					>
						arrow_back_ios_new
					</span>
				</button>
				<h1 className='flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white pr-12'>
					Contact Us
				</h1>
			</header>
			{/* Body Text */}
			<main className='flex-grow px-4'>
				<p className='text-base font-normal leading-normal text-gray-600 dark:text-gray-300 pt-1 pb-6'>
					We're here to help! Reach out to us through any of the
					channels below.
				</p>
				{/* Contact List */}
				<div className='flex flex-col gap-2 rounded-xl bg-gray-100/50 dark:bg-white/5 p-2'>
					{/* Email Item */}
					<a
						className='flex items-center gap-4 bg-background-light dark:bg-background-dark p-3 rounded-lg justify-between'
						href='#'
					>
						<div className='flex items-center gap-4'>
							<div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary'>
								<span
									className='material-symbols-outlined'
									style={{ fontSize: 24 }}
								>
									mail
								</span>
							</div>
							<p className='flex-1 truncate text-base font-normal leading-normal text-gray-900 dark:text-white'>
								Email Us
							</p>
						</div>
						<div className='shrink-0'>
							<div className='flex size-7 items-center justify-center text-gray-400 dark:text-gray-500'>
								<span
									className='material-symbols-outlined'
									style={{ fontSize: 24 }}
								>
									chevron_right
								</span>
							</div>
						</div>
					</a>
					{/* Divider */}
					<div className='h-px bg-gray-200 dark:bg-white/10 mx-3'></div>
					{/* Phone Item */}
					<a
						className='flex items-center gap-4 bg-background-light dark:bg-background-dark p-3 rounded-lg justify-between'
						href='#'
					>
						<div className='flex items-center gap-4'>
							<div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary'>
								<span
									className='material-symbols-outlined'
									style={{ fontSize: 24 }}
								>
									call
								</span>
							</div>
							<p className='flex-1 truncate text-base font-normal leading-normal text-gray-900 dark:text-white'>
								Call Us
							</p>
						</div>
						<div className='shrink-0'>
							<div className='flex size-7 items-center justify-center text-gray-400 dark:text-gray-500'>
								<span
									className='material-symbols-outlined'
									style={{ fontSize: 24 }}
								>
									chevron_right
								</span>
							</div>
						</div>
					</a>
				</div>

				<div class='layout-content-container flex flex-col max-w-[960px] flex-1'>
					<div class='flex flex-wrap justify-between gap-3 p-4'>
						<div class='flex min-w-72 flex-col gap-3'>
							<p class='text-[#8daece] text-sm font-normal leading-normal'>
								We're here to help! Please fill out the form
								below to get in touch with our support team.
							</p>
						</div>
					</div>
					<div class='flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3'>
						<label class='flex flex-col min-w-40 flex-1'>
							<p class='text-white text-base font-medium leading-normal pb-2'>
								Your Name
							</p>
							<input
								placeholder='Enter your name'
								class='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#20364b] focus:border-none h-14 placeholder:text-[#8daece] p-4 text-base font-normal leading-normal'
								value=''
							/>
						</label>
					</div>
					<div class='flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3'>
						<label class='flex flex-col min-w-40 flex-1'>
							<p class='text-white text-base font-medium leading-normal pb-2'>
								Your Email
							</p>
							<input
								placeholder='Enter your email'
								class='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#20364b] focus:border-none h-14 placeholder:text-[#8daece] p-4 text-base font-normal leading-normal'
								value=''
							/>
						</label>
					</div>
					<div class='flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3'>
						<label class='flex flex-col min-w-40 flex-1'>
							<p class='text-white text-base font-medium leading-normal pb-2'>
								Subject
							</p>
							<input
								placeholder='Enter the subject'
								class='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#20364b] focus:border-none h-14 placeholder:text-[#8daece] p-4 text-base font-normal leading-normal'
								value=''
							/>
						</label>
					</div>
					<div class='flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3'>
						<label class='flex flex-col min-w-40 flex-1'>
							<p class='text-white text-base font-medium leading-normal pb-2'>
								Message
							</p>
							<textarea
								placeholder='Enter your message'
								class='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#20364b] focus:border-none min-h-36 placeholder:text-[#8daece] p-4 text-base font-normal leading-normal'
							></textarea>
						</label>
					</div>
					<div class='flex justify-stretch'>
						<div class='flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start'>
							<button class='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#359dff] text-[#0f1a24] text-sm font-bold leading-normal tracking-[0.015em]'>
								<span class='truncate'>Submit</span>
							</button>
							<button class='flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#20364b] text-white text-sm font-bold leading-normal tracking-[0.015em]'>
								<span class='truncate'>Reset</span>
							</button>
						</div>
					</div>
				</div>

				{/* Section Header */}
				<h2 className='py-6 text-center text-sm font-bold leading-normal tracking-[0.015em] text-gray-500 dark:text-gray-400'>
					Follow Us
				</h2>
				{/* Social Media Grid */}
				<div className='grid grid-cols-4 gap-4 pb-8'>
					{socialLinks.map((item, idx) => (
						<a
							key={item.name}
							className='flex flex-col items-center justify-center gap-2 text-center'
							data-alt={`${item.name} social media link`}
							href={item.href}
						>
							<div className='flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-200'>
								{item.icon}
							</div>
							<p className='text-xs font-medium text-gray-600 dark:text-gray-400'>
								{item.name}
							</p>
						</a>
					))}
				</div>
			</main>
		</div>
	);
}
