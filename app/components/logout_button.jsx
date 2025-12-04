import { useRouter } from "next/navigation";
import { useAuthStore } from "../z_internals/controllers/auth";

export default function logoutButton() {
	const logout = useAuthStore((state) => state.logout);
	const router = useRouter();

	async function handleLogout() {
		await logout();
		router.push("/login");
	}

	return (
		<>
			<div className='border-t border-slate-200 dark:border-slate-700 py-1'>
				<button
					type='button'
					onClick={() => {
						setShowProfileMenu(false);
						handleLogout();
					}}
					className='flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800'
				>
					<span className='material-symbols-outlined text-xl'>
						logout
					</span>
					Sign Out
				</button>
			</div>
		</>
	);
}
