import Scaffold from "@/app/components/scaffold";

function SpecificUserProfilePageContent() {
	return (
		<>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 @container'>
				<div className='lg:col-span-1'>
					<div className='sticky top-24 flex flex-col gap-6 rounded-xl p-6 glassmorphism'>
						<div className='flex w-full flex-col gap-4 items-center'>
							<div className='flex gap-4 flex-col items-center'>
								<div
									className='bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32'
									data-alt='Profile picture of John Appleseed'
									style={{
										backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAJKDmYgkKiN-z5cPI_MTPUAtSwAqaNqaYIV-0cWUC9u0mtm4pyDKatjayXkGrjvLC1xaLP7nTsdb8U7DHNE_wqm418gjYUoRE_xxCe4UNF8BNPsjGoKSEHJRyJlgVm0F4qLf0JgephAb2Fk_GhA-xGmAsB3mwJuNawSam0ZmebYoxNlMUbONuW4qqR7R_rPIXD34Hv52kN5uNugCIJRHi1yEowK0lt6kV_H-dhA7juWzGIBbnPAzoI2jcfO7bj8y3y_z1txewmSwE")`,
									}}
								></div>
								<div className='flex flex-col items-center justify-center'>
									<p className='text-neutral-text dark:text-white text-[22px] font-bold leading-tight font-heading'>
										John Appleseed
									</p>
									<p className='text-gray-600 dark:text-gray-400 text-base font-normal leading-normal'>
										@jappleseed
									</p>
									<p className='text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal mt-1'>
										Boulder, CO
									</p>
									<p className='text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal'>
										Member since Jan 2023
									</p>
								</div>
							</div>
							<button className='flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] @[480px]:w-auto hover:bg-primary/90 transition-colors'>
								<span className='truncate'>Follow</span>
							</button>
						</div>

						<div className='flex flex-wrap gap-3'>
							<div className='flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border border-neutral-divider dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-3 items-center text-center'>
								<p className='text-neutral-text dark:text-white tracking-light text-2xl font-bold leading-tight'>
									14
								</p>
								<div className='flex items-center gap-2'>
									<p className='text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal'>
										Issues Posted
									</p>
								</div>
							</div>
							<div className='flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border border-neutral-divider dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-3 items-center text-center'>
								<p className='text-neutral-text dark:text-white tracking-light text-2xl font-bold leading-tight'>
									8
								</p>
								<div className='flex items-center gap-2'>
									<p className='text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal'>
										Resolved
									</p>
								</div>
							</div>
							<div className='flex min-w-[111px] flex-1 basis-[fit-content] flex-col gap-2 rounded-lg border border-neutral-divider dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-3 items-center text-center'>
								<p className='text-neutral-text dark:text-white tracking-light text-2xl font-bold leading-tight'>
									128
								</p>
								<div className='flex items-center gap-2'>
									<p className='text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal'>
										Upvotes
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='lg:col-span-2'>
					<div className='flex flex-col gap-6'>
						<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
							<h2 className='text-neutral-text dark:text-white text-2xl font-bold font-heading'>
								John's Reported Issues
							</h2>
							<div className='flex items-center gap-2'>
								<button className='px-4 py-1.5 text-sm font-medium rounded-full bg-primary text-white'>
									All
								</button>
								<button className='px-4 py-1.5 text-sm font-medium rounded-full bg-gray-200 dark:bg-slate-700 text-neutral-text dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'>
									Open
								</button>
								<button className='px-4 py-1.5 text-sm font-medium rounded-full bg-gray-200 dark:bg-slate-700 text-neutral-text dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'>
									Resolved
								</button>
							</div>
						</div>

						<div className='flex flex-col gap-4'>
							<div className='flex flex-col gap-4 p-5 rounded-lg border border-neutral-divider dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md hover:border-primary/50 dark:hover:border-primary/70 transition-shadow'>
								<div className='flex justify-between items-start'>
									<div className='flex flex-col'>
										<h3 className='font-bold text-lg text-neutral-text dark:text-white'>
											Large Pothole on 12th Street
										</h3>
										<p className='text-sm text-gray-500 dark:text-gray-400'>
											Posted on July 19, 2024
										</p>
									</div>
									<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-secondary dark:text-green-300'>
										Resolved
									</span>
								</div>
								<p className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed'>
									A deep pothole is causing issues for traffic
									near the intersection with Main Ave. It's
									been there for weeks and is getting worse...
								</p>
								<div className='flex justify-between items-center text-sm text-gray-500 dark:text-gray-400'>
									<div className='flex items-center gap-2'>
										<span className='material-symbols-outlined text-base'>
											road
										</span>
										<span>Road Hazard</span>
									</div>
									<div className='flex items-center gap-4'>
										<div className='flex items-center gap-1.5'>
											<span className='material-symbols-outlined text-base'>
												arrow_upward
											</span>
											<span>24</span>
										</div>
										<div className='flex items-center gap-1.5'>
											<span className='material-symbols-outlined text-base'>
												chat_bubble_outline
											</span>
											<span>5</span>
										</div>
									</div>
								</div>
							</div>

							<div className='flex flex-col gap-4 p-5 rounded-lg border border-neutral-divider dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md hover:border-primary/50 dark:hover:border-primary/70 transition-shadow'>
								<div className='flex justify-between items-start'>
									<div className='flex flex-col'>
										<h3 className='font-bold text-lg text-neutral-text dark:text-white'>
											Broken Streetlight at City Park
											Entrance
										</h3>
										<p className='text-sm text-gray-500 dark:text-gray-400'>
											Posted on June 28, 2024
										</p>
									</div>
									<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'>
										In Progress
									</span>
								</div>
								<p className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed'>
									The main streetlight at the park entrance on
									Oak St. is out. It's very dark at night and
									feels unsafe.
								</p>
								<div className='flex justify-between items-center text-sm text-gray-500 dark:text-gray-400'>
									<div className='flex items-center gap-2'>
										<span className='material-symbols-outlined text-base'>
											lightbulb
										</span>
										<span>Public Safety</span>
									</div>
									<div className='flex items-center gap-4'>
										<div className='flex items-center gap-1.5'>
											<span className='material-symbols-outlined text-base'>
												arrow_upward
											</span>
											<span>42</span>
										</div>
										<div className='flex items-center gap-1.5'>
											<span className='material-symbols-outlined text-base'>
												chat_bubble_outline
											</span>
											<span>11</span>
										</div>
									</div>
								</div>
							</div>

							<div className='flex flex-col gap-4 p-5 rounded-lg border border-neutral-divider dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md hover:border-primary/50 dark:hover:border-primary/70 transition-shadow'>
								<div className='flex justify-between items-start'>
									<div className='flex flex-col'>
										<h3 className='font-bold text-lg text-neutral-text dark:text-white'>
											Fallen Tree Branch Blocking Sidewalk
										</h3>
										<p className='text-sm text-gray-500 dark:text-gray-400'>
											Posted on May 15, 2024
										</p>
									</div>
									<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'>
										Open
									</span>
								</div>
								<p className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed'>
									A large branch from an oak tree has fallen
									and is completely blocking the sidewalk on
									Pine Lane. Pedestrians have to walk in the
									street.
								</p>
								<div className='flex justify-between items-center text-sm text-gray-500 dark:text-gray-400'>
									<div className='flex items-center gap-2'>
										<span className='material-symbols-outlined text-base'>
											park
										</span>
										<span>Parks &amp; Rec</span>
									</div>
									<div className='flex items-center gap-4'>
										<div className='flex items-center gap-1.5'>
											<span className='material-symbols-outlined text-base'>
												arrow_upward
											</span>
											<span>18</span>
										</div>
										<div className='flex items-center gap-1.5'>
											<span className='material-symbols-outlined text-base'>
												chat_bubble_outline
											</span>
											<span>3</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default function SpecificUserProfilePage() {
	return (
		<Scaffold>
			<SpecificUserProfilePageContent />
		</Scaffold>
	);
}
