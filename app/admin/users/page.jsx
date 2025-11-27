"use client";

import { useState } from "react";
import { Header, Sidebar } from "../../components/layout";
import { UserTable, StatsGrid } from "../../components/features";
import {
	Input,
	Select,
	Button,
	Modal,
	Tabs,
	TabPanel,
} from "../../components/ui";
import { users as dummyUsers } from "../../data/dummy_data";

export default function AdminUsersPage() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [activeTab, setActiveTab] = useState("all");
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	const citizens = dummyUsers.filter((u) => u.role === "citizen");
	const activeUsers = dummyUsers.filter((u) => u.isActive);

	const userStats = [
		{ label: "Total Citizens", value: citizens.length, icon: "group" },
		{
			label: "Active Users",
			value: activeUsers.length,
			icon: "person",
			accent: true,
		},
		{ label: "New This Month", value: 12, icon: "person_add" },
		{ label: "Suspended", value: 2, icon: "person_off" },
	];

	const tabs = [
		{ id: "all", label: "All Users", count: citizens.length },
		{ id: "active", label: "Active", count: activeUsers.length },
		{ id: "suspended", label: "Suspended", count: 2 },
	];

	const filteredUsers = citizens.filter((user) => {
		const matchesSearch =
			!searchQuery ||
			user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus =
			statusFilter === "all" ||
			(statusFilter === "active" && user.isActive) ||
			(statusFilter === "suspended" && !user.isActive);

		return matchesSearch && matchesStatus;
	});

	const handleEditUser = (user) => {
		setSelectedUser(user);
		setShowEditModal(true);
	};

	const handleToggleStatus = (user) => {
		console.log("Toggle status for:", user.id);
	};

	const handleDeleteUser = (user) => {
		console.log("Delete user:", user.id);
	};

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
