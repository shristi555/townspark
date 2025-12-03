"use client";

import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function Scaffold({ children }) {
	return (
		<>
			<div className='relative flex h-auto min-h-screen w-full flex-col group/design-root'>
				<Topbar />
				<div className='flex flex-1'>
					<Sidebar />
					<main className='flex-1 p-4 sm:p-6 lg:p-8'>
						<div className='mx-auto max-w-7xl'>{children}</div>
					</main>
				</div>
			</div>
		</>
	);
}
