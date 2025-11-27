"use client";

import Link from "next/link";

export default function Footer({ className = "" }) {
	const currentYear = new Date().getFullYear();

	return (
		<footer
			className={`flex flex-col gap-6 px-5 py-10 text-center border-t border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark ${className}`}
		>
			{/* Links */}
			<div className='flex flex-wrap gap-6 justify-center text-sm text-text-secondary-light dark:text-text-secondary-dark'>
				<Link
					href='/about'
					className='hover:text-primary transition-colors'
				>
					About Us
				</Link>
				<Link
					href='/contact'
					className='hover:text-primary transition-colors'
				>
					Contact
				</Link>
				<Link
					href='/privacy'
					className='hover:text-primary transition-colors'
				>
					Privacy Policy
				</Link>
				<Link
					href='/terms'
					className='hover:text-primary transition-colors'
				>
					Terms of Service
				</Link>
				<Link
					href='/help'
					className='hover:text-primary transition-colors'
				>
					Help & FAQ
				</Link>
			</div>

			{/* Social Links */}
			<div className='flex justify-center gap-4'>
				<a
					href='https://facebook.com'
					target='_blank'
					rel='noopener noreferrer'
					className='size-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary hover:text-white transition-colors'
				>
					<span className='material-symbols-outlined text-lg'>
						public
					</span>
				</a>
				<a
					href='https://twitter.com'
					target='_blank'
					rel='noopener noreferrer'
					className='size-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary hover:text-white transition-colors'
				>
					<span className='material-symbols-outlined text-lg'>
						tag
					</span>
				</a>
				<a
					href='https://instagram.com'
					target='_blank'
					rel='noopener noreferrer'
					className='size-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary hover:text-white transition-colors'
				>
					<span className='material-symbols-outlined text-lg'>
						photo_camera
					</span>
				</a>
			</div>

			{/* Copyright */}
			<p className='text-text-secondary-light dark:text-text-secondary-dark text-sm'>
				© {currentYear} TownSpark. All rights reserved.
			</p>
		</footer>
	);
}
