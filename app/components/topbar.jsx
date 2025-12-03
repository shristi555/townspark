import Link from "next/link";

const navLinks = [
	{ name: "Home", href: "#" },
	{ name: "Map View", href: "#" },
	{ name: "Add Issue", href: "#" },
	{ name: "My issues", href: "#" },
];

export default function Topbar() {
	return (
		<>
			<header className='sticky top-0 z-20 flex items-center justify-between whitespace-nowrap border-b border-solid border-neutral-divider dark:border-slate-800 px-4 sm:px-8 lg:px-10 py-3 bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm'>
				<div className='flex items-center gap-8'>
					<div className='flex items-center gap-3 text-primary dark:text-white'>
						<span className='material-symbols-outlined text-3xl'>
							local_fire_department
						</span>
						<h2 className='text-xl font-bold tracking-[-0.015em] font-heading'>
							TownSpark
						</h2>
					</div>
				</div>

				<div className='hidden md:flex items-center gap-9 ml-16'>
					{navLinks.map((link) => (
						<Link
							key={link.name}
							href={link.href}
							className='text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors'
						>
							{link.name}
						</Link>
					))}
				</div>
				<div className='flex flex-1 justify-end gap-4'>
					<label className='hidden lg:flex flex-col min-w-40 !h-10 max-w-64'>
						<div className='flex w-full flex-1 items-stretch rounded-lg h-full'>
							<div className='text-gray-500 dark:text-gray-400 flex bg-gray-100 dark:bg-slate-700 items-center justify-center pl-3 rounded-l-lg'>
								<span className='material-symbols-outlined'>
									search
								</span>
							</div>
							<input
								onChange={() => {}}
								className='form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-neutral-text dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-gray-100 dark:bg-slate-700 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 pl-2 text-sm font-normal leading-normal'
								placeholder='Search issues...'
								value=''
							/>
						</div>
					</label>
					<button className='flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-100 dark:bg-slate-700 text-neutral-text dark:text-gray-300 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5'>
						<span className='material-symbols-outlined'>
							notifications
						</span>
					</button>
					<div
						className='bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10'
						data-alt="Logged-in user's profile picture"
						style={{
							backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAsEEZdB9AO85VbOmaq4pkRmwhpQOWnj6zHHcI2V6nsd0icqBMeFc2smno9SFM5WouSVzgAqSw8Ld_EBWu88YK_0PFnRbmm3GLle2fo3kx17bVcchNPdj_JN1OZWS0wFcC-JMW1HOuTIWuZKwv-ZvbitnhHdJzAwDiXNAtBsks8Y5UwKAJ-woQQzxp4PZjtQF5MRY--QdXUT1BqDZGnn8Bn4IcIUIbd6OdSCAfWAzqC9oTK6g7QFXWeLpnnvAwfR77PdKR06PCIj48")`,
						}}
					></div>
				</div>
			</header>
		</>
	);
}
