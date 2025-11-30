"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header, Sidebar } from "../../components/layout";
import { UserTable, StatsGrid } from "../../components/features";
import {
	Input,
	Select,
	Button,
	Modal,
	Tabs,
	TabPanel,
	Loader,
} from "../../components/ui";
import { useAuth } from "../../contexts/auth_context";
import { AdminService } from "../../modules";

export default function AdminUsersPage() {
	const router = useRouter();
	const {
		user: authUser,
		isAuthenticated,
		isLoading: authLoading,
	} = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [activeTab, setActiveTab] = useState("all");
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	// Data states
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState(null);

	// Check if user is admin
	useEffect(() => {
		if (!authLoading) {
			if (!isAuthenticated) {
				router.push("/login");
				return;
			}
			if (authUser && !authUser.is_admin) {
				router.push("/feed");
				return;
			}
		}
	}, [authLoading, isAuthenticated, authUser, router]);

	// Fetch users data
	const fetchUsers = useCallback(async () => {
		if (!authUser || !authUser.is_admin) return;

		setLoading(true);
		try {
			const response = await AdminService.getUsers({ role: "citizen" });
			if (response.success) {
				setUsers(response.data?.results || response.data || []);
			}
		} catch (error) {
			console.error("Failed to fetch users:", error);
		} finally {
			setLoading(false);
		}
	}, [authUser]);

	useEffect(() => {
		if (authUser?.is_admin) {
			fetchUsers();
		}
	}, [authUser, fetchUsers]);

	const citizens = users.filter((u) => !u.is_admin && !u.is_staff);
	const activeUsers = users.filter((u) => u.is_active !== false);

	const userStats = stats
		? [
				{
					label: "Total Citizens",
					value: stats.total_citizens || citizens.length,
					icon: "group",
				},
				{
					label: "Active Users",
					value: stats.active_users || activeUsers.length,
					icon: "person",
					accent: true,
				},
				{
					label: "New This Month",
					value: stats.new_this_month || 0,
					icon: "person_add",
				},
				{
					label: "Suspended",
					value: stats.suspended || 0,
					icon: "person_off",
				},
			]
		: [
				{
					label: "Total Citizens",
					value: citizens.length,
					icon: "group",
				},
				{
					label: "Active Users",
					value: activeUsers.length,
					icon: "person",
					accent: true,
				},
				{ label: "New This Month", value: 0, icon: "person_add" },
				{ label: "Suspended", value: 0, icon: "person_off" },
			];

	const tabs = [
		{ id: "all", label: "All Users", count: citizens.length },
		{ id: "active", label: "Active", count: activeUsers.length },
		{
			id: "suspended",
			label: "Suspended",
			count: users.filter((u) => u.is_active === false).length,
		},
	];

	const filteredUsers = users.filter((user) => {
		const matchesSearch =
			!searchQuery ||
			(user.full_name || user.username || "")
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			(user.email || "")
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

		const matchesStatus =
			statusFilter === "all" ||
			(statusFilter === "active" && user.is_active !== false) ||
			(statusFilter === "suspended" && user.is_active === false);

		const matchesTab =
			activeTab === "all" ||
			(activeTab === "active" && user.is_active !== false) ||
			(activeTab === "suspended" && user.is_active === false);

		return matchesSearch && matchesStatus && matchesTab;
	});

	const handleEditUser = (user) => {
		setSelectedUser(user);
		setShowEditModal(true);
	};

	const handleToggleStatus = async (user) => {
		try {
			const response = await AdminService.toggleUserStatus(user.id);
			if (response.success) {
				fetchUsers(); // Refresh the list
			}
		} catch (error) {
			console.error("Failed to toggle user status:", error);
		}
	};

	const handleDeleteUser = async (user) => {
		if (!confirm("Are you sure you want to delete this user?")) return;

		try {
			const response = await AdminService.deleteUser(user.id);
			if (response.success) {
				fetchUsers(); // Refresh the list
			}
		} catch (error) {
			console.error("Failed to delete user:", error);
		}
	};

	// Show loading state
	if (authLoading || loading) {
		return (
			<div className='min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center'>
				<Loader size='lg' />
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background-light dark:bg-background-dark'>
			<Sidebar
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				showAdminNav
			/>

			<div className='md:ml-72'>
				<Header
					title='User Management'
					showBackButton
					backHref='/admin'
					actions={
						<button
							onClick={() => setSidebarOpen(true)}
							className='md:hidden flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-primary-light dark:text-text-primary-dark'
						>
							<span className='material-symbols-outlined'>
								menu
							</span>
						</button>
					}
				/>

				<main className='max-w-6xl mx-auto px-4 py-6'>
					{/* Stats */}
					<StatsGrid stats={userStats} columns={4} className='mb-6' />

					{/* Filters */}
					<div className='bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark'>
						<div className='p-4 border-b border-border-light dark:border-border-dark'>
							<div className='flex flex-col sm:flex-row gap-4'>
								<div className='flex-1'>
									<Input
										placeholder='Search users by name or email...'
										value={searchQuery}
										onChange={(e) =>
											setSearchQuery(e.target.value)
										}
										icon='search'
										fullWidth
									/>
								</div>
								<Select
									value={statusFilter}
									onChange={(e) =>
										setStatusFilter(e.target.value)
									}
									options={[
										{ value: "all", label: "All Status" },
										{ value: "active", label: "Active" },
										{
											value: "suspended",
											label: "Suspended",
										},
									]}
								/>
							</div>
						</div>

						<Tabs
							tabs={tabs}
							activeTab={activeTab}
							onChange={setActiveTab}
							className='px-4 pt-4'
						/>

						<div className='p-4'>
							<UserTable
								users={filteredUsers}
								onEdit={handleEditUser}
								onDelete={handleDeleteUser}
								onToggleStatus={handleToggleStatus}
								showRole={false}
							/>
						</div>
					</div>
				</main>
			</div>

			{/* Edit Modal */}
			<Modal
				isOpen={showEditModal}
				onClose={() => setShowEditModal(false)}
				title='Edit User'
			>
				{selectedUser && (
					<div className='space-y-4'>
						<Input
							label='Name'
							defaultValue={selectedUser.name}
							fullWidth
						/>
						<Input
							label='Email'
							type='email'
							defaultValue={selectedUser.email}
							fullWidth
						/>
						<Select
							label='Status'
							defaultValue={
								selectedUser.isActive ? "active" : "suspended"
							}
							options={[
								{ value: "active", label: "Active" },
								{ value: "suspended", label: "Suspended" },
							]}
							fullWidth
						/>
						<div className='flex gap-3 pt-4'>
							<Button
								variant='outline'
								onClick={() => setShowEditModal(false)}
								className='flex-1'
							>
								Cancel
							</Button>
							<Button className='flex-1'>Save Changes</Button>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}
