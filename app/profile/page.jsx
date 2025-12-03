"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header, BottomNavigation, Sidebar } from "../components/layout";
import { IssueList, StatsGrid } from "../components/features";
import {
	Avatar,
	Button,
	Tabs,
	TabPanel,
	Badge,
	Loader,
} from "../components/ui";
import Link from "next/link";

import { useIssueStore } from "../z_internals/controllers/issue";
import { AuthGuard, useAuthStore } from "../z_internals/controllers/auth";
import Scaffold from "../components/scaffold";

function ProfilePageUi() {
	return (
		<>
			<Scaffold>
				<div className='p-10'>
					<div className='flex flex-col gap-8 max-w-5xl mx-auto'>
						<div className='flex p-6 @container bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl'>
							<div className='flex w-full flex-col gap-6 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center'>
								<div className='flex gap-6 items-center'>
									<div
										className='bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 shrink-0'
										data-alt='Profile picture of Jane Doe'
										style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCz-NHJiaEshezjl3DKHAqkJJ-W3ldQTkwciXHLabATpmEULQEu-WlRpy4FzDtaSFPwa_rNqv5I8AMqewKb65GXbHhOkC8yxqSBRnsSmLVMfRWDYFiTNmozMXQjC9KkjvpBM-nFXzK4GiZcH_LsQ8bl4tnFC21WrP9NQQgldAqfhxHzk8w9QIvUtjFK75amwSJRJBKEvcuU_4N27h71czykZmFkqzEnex5eb95npDtQVM2qLfMuTuEKJ3w42XOOsyp41gdx9b-mWtY');"
									></div>
									<div className='flex flex-col justify-center gap-1'>
										<p className='text-text-light-primary dark:text-text-dark-primary text-2xl font-bold leading-tight tracking-tight'>
											Jane Doe
										</p>
										<p className='text-text-light-secondary dark:text-text-dark-secondary text-base font-normal leading-normal'>
											jane.doe@example.com
										</p>
										<p className='text-text-light-secondary dark:text-text-dark-secondary text-base font-normal leading-normal'>
											123 Maple Street, Anytown, USA
										</p>
									</div>
								</div>
								<button className='flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] @[480px]:w-auto gap-2'>
									<span className='material-symbols-outlined !text-xl'>
										edit
									</span>
									<span className='truncate'>Edit Profile</span>
								</button>
							</div>
						</div>

						<div className='flex flex-col'>
							<div className='border-b border-border-light dark:border-border-dark px-4'>
								<div className='flex gap-8'>
									<a
										className='flex flex-col items-center justify-center border-b-[3px] border-b-primary text-primary pb-[13px] pt-4'
										href='#'
									>
										<p className='text-sm font-bold leading-normal tracking-[0.015em]'>
											Posted Issues
										</p>
									</a>
									<a
										className='flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-text-light-secondary dark:text-text-dark-secondary pb-[13px] pt-4'
										href='#'
									>
										<p className='text-sm font-bold leading-normal tracking-[0.015em]'>
											My Comments
										</p>
									</a>
									<a
										className='flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-text-light-secondary dark:text-text-dark-secondary pb-[13px] pt-4'
										href='#'
									>
										<p className='text-sm font-bold leading-normal tracking-[0.015em]'>
											Bookmarks
										</p>
									</a>
								</div>
							</div>

							<div className='flex flex-col divide-y divide-border-light dark:divide-border-dark border border-border-light dark:border-border-dark rounded-b-xl bg-surface-light dark:bg-surface-dark'>
								<div className='flex gap-4 px-6 py-4 justify-between items-center'>
									<div className='flex items-start gap-4 flex-1'>
										<div className='text-text-light-primary dark:text-text-dark-primary flex items-center justify-center rounded-lg bg-background-light dark:bg-background-dark shrink-0 size-12'>
											<span className='material-symbols-outlined'>
												road
											</span>
										</div>
										<div className='flex flex-1 flex-col justify-center'>
											<p className='text-text-light-primary dark:text-text-dark-primary text-base font-medium leading-normal'>
												Large Pothole on Elm Street
											</p>
											<p className='text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-normal'>
												Posted: 2 days ago
											</p>
										</div>
									</div>
									<div className='flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600 dark:text-green-400'>
										<div className='size-2 rounded-full bg-green-500'></div>
										<span>Resolved</span>
									</div>
								</div>

								<div className='flex gap-4 px-6 py-4 justify-between items-center'>
									<div className='flex items-start gap-4 flex-1'>
										<div className='text-text-light-primary dark:text-text-dark-primary flex items-center justify-center rounded-lg bg-background-light dark:bg-background-dark shrink-0 size-12'>
											<span className='material-symbols-outlined'>
												broken_image
											</span>
										</div>
										<div classNameName='flex flex-1 flex-col justify-center'>
											<p className='text-text-light-primary dark:text-text-dark-primary text-base font-medium leading-normal'>
												Graffiti on Park Bench
											</p>
											<p className='text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-normal'>
												Posted: 1 week ago
											</p>
										</div>
									</div>
									<div className='flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-600 dark:text-orange-400'>
										<div className='size-2 rounded-full bg-orange-500'></div>
										<span>In Progress</span>
									</div>
								</div>

								<div className='flex gap-4 px-6 py-4 justify-between items-center'>
									<div className='flex items-start gap-4 flex-1'>
										<div className='text-text-light-primary dark:text-text-dark-primary flex items-center justify-center rounded-lg bg-background-light dark:bg-background-dark shrink-0 size-12'>
											<span className='material-symbols-outlined'>
												light
											</span>
										</div>
										<div className='flex flex-1 flex-col justify-center'>
											<p className='text-text-light-primary dark:text-text-dark-primary text-base font-medium leading-normal'>
												Broken Streetlight at Oak &amp;
												Main
											</p>
											<p className='text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-normal'>
												Posted: 3 weeks ago
											</p>
										</div>
									</div>
									<div className='flex items-center gap-2 rounded-full bg-slate-500/10 px-3 py-1 text-sm font-medium text-slate-600 dark:text-slate-400'>
										<div className='size-2 rounded-full bg-slate-500'></div>
										<span>Open</span>
									</div>
								</div>
								<div className='flex gap-4 px-6 py-4 justify-between items-center'>
									<div className='flex items-start gap-4 flex-1'>
										<div className='text-text-light-primary dark:text-text-dark-primary flex items-center justify-center rounded-lg bg-background-light dark:bg-background-dark shrink-0 size-12'>
											<span className='material-symbols-outlined'>
												recycling
											</span>
										</div>
										<div className='flex flex-1 flex-col justify-center'>
											<p className='text-text-light-primary dark:text-text-dark-primary text-base font-medium leading-normal'>
												Overflowing Recycling Bins at
												Town Square
											</p>
											<p className='text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-normal'>
												Posted: 1 month ago
											</p>
										</div>
									</div>
									<div className='flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600 dark:text-green-400'>
										<div className='size-2 rounded-full bg-green-500'></div>
										<span>Resolved</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Scaffold>
		</>
	);
}

function ProfilePage() {
	return (
		<AuthGuard>
			<ProfilePageUi />
		</AuthGuard>
	);
}
export default ProfilePage;
