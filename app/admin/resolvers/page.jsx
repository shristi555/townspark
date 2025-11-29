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
	Badge,
	Loader,
} from "../../components/ui";
import { useAuth } from "../../contexts/auth_context";
import { AdminService, CoreService } from "../../modules";

export default function AdminResolversPage() {
	const router = useRouter();
	const {
		user: authUser,
		isAuthenticated,
		isLoading: authLoading,
	} = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [departmentFilter, setDepartmentFilter] = useState("all");
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedResolver, setSelectedResolver] = useState(null);

	// Data states
	const [resolvers, setResolvers] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [loading, setLoading] = useState(true);

	// Check if user is admin
	useEffect(() => {
		if (!authLoading) {
			if (!isAuthenticated) {
				router.push("/login");
				return;
			}
			if (authUser && authUser.role !== "admin") {
				router.push("/feed");
				return;
			}
		}
	}, [authLoading, isAuthenticated, authUser, router]);

	// Fetch resolvers data
	const fetchResolvers = useCallback(async () => {
		if (!authUser || authUser.role !== "admin") return;

		setLoading(true);
		try {
			const [resolversRes, categoriesRes] = await Promise.all([
				AdminService.getResolvers(),
				CoreService.getCategories(),
			]);

			if (resolversRes.success) {
				setResolvers(
					resolversRes.data?.results || resolversRes.data || []
				);
			}
			if (categoriesRes.success) {
				// Use categories as departments or fetch actual departments
				setDepartments(categoriesRes.data || []);
			}
		} catch (error) {
			console.error("Failed to fetch resolvers:", error);
		} finally {
			setLoading(false);
		}
	}, [authUser]);

	useEffect(() => {
		if (authUser?.role === "admin") {
			fetchResolvers();
		}
	}, [authUser, fetchResolvers]);

	const verifiedResolvers = resolvers.filter((r) => r.is_verified);
	const pendingResolvers = resolvers.filter((r) => !r.is_verified);

	const resolverStats = [
		{
			label: "Total Resolvers",
			value: resolvers.length,
			icon: "support_agent",
		},
		{
			label: "Verified",
			value: verifiedResolvers.length,
			icon: "verified",
			accent: true,
		},
		{
			label: "Pending Verification",
			value: pendingResolvers.length,
			icon: "pending",
		},
		{ label: "Avg. Resolution Time", value: "N/A", icon: "schedule" },
	];

	const filteredResolvers = resolvers.filter((resolver) => {
		const matchesSearch =
			!searchQuery ||
			(resolver.full_name || resolver.username || "")
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			(resolver.email || "")
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

		const matchesDepartment =
			departmentFilter === "all" ||
			resolver.department === departmentFilter;

		return matchesSearch && matchesDepartment;
	});

	const handleEditResolver = (resolver) => {
		setSelectedResolver(resolver);
		setShowEditModal(true);
	};

	const handleVerifyResolver = async (resolver) => {
		try {
			const response = await AdminService.approveResolver(resolver.id);
			if (response.success) {
				fetchResolvers();
			}
		} catch (error) {
			console.error("Failed to verify resolver:", error);
		}
	};

	const handleDeleteResolver = async (resolver) => {
		if (!confirm("Are you sure you want to delete this resolver?")) return;

		try {
			const response = await AdminService.deleteUser(resolver.id);
			if (response.success) {
				fetchResolvers();
			}
		} catch (error) {
			console.error("Failed to delete resolver:", error);
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
					title='Resolver Management'
					showBackButton
					backHref='/admin'
					actions={
						<div className='flex items-center gap-2'>
							<Button
								size='sm'
								onClick={() => setShowAddModal(true)}
							>
								<span className='material-symbols-outlined text-lg mr-1'>
									add
								</span>
								Add Resolver
							</Button>
							<button
								onClick={() => setSidebarOpen(true)}
								className='md:hidden flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-primary-light dark:text-text-primary-dark'
							>
								<span className='material-symbols-outlined'>
									menu
								</span>
							</button>
						</div>
					}
				/>

				<main className='max-w-6xl mx-auto px-4 py-6'>
					{/* Stats */}
					<StatsGrid
						stats={resolverStats}
						columns={4}
						className='mb-6'
					/>

					{/* Pending Verifications */}
					{pendingResolvers.length > 0 && (
						<div className='bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6'>
							<div className='flex items-center gap-3 mb-3'>
								<span className='material-symbols-outlined text-amber-600 dark:text-amber-400'>
									pending_actions
								</span>
								<h3 className='font-medium text-amber-800 dark:text-amber-200'>
									Pending Verifications (
									{pendingResolvers.length})
								</h3>
							</div>
							<div className='space-y-2'>
								{pendingResolvers.map((resolver) => (
									<div
										key={resolver.id}
										className='flex items-center justify-between bg-white dark:bg-card-dark rounded-lg p-3'
									>
										<div className='flex items-center gap-3'>
											<img
												src={resolver.avatar}
												alt={resolver.name}
												className='size-10 rounded-full object-cover'
											/>
											<div>
												<p className='font-medium text-text-primary-light dark:text-text-primary-dark'>
													{resolver.name}
												</p>
												<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
													{resolver.department}
												</p>
											</div>
										</div>
										<div className='flex items-center gap-2'>
											<Button
												size='sm'
												variant='outline'
												onClick={() =>
													handleEditResolver(resolver)
												}
											>
												Review
											</Button>
											<Button
												size='sm'
												onClick={() =>
													handleVerifyResolver(
														resolver
													)
												}
											>
												Verify
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Filters & Table */}
					<div className='bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark'>
						<div className='p-4 border-b border-border-light dark:border-border-dark'>
							<div className='flex flex-col sm:flex-row gap-4'>
								<div className='flex-1'>
									<Input
										placeholder='Search resolvers...'
										value={searchQuery}
										onChange={(e) =>
											setSearchQuery(e.target.value)
										}
										icon='search'
										fullWidth
									/>
								</div>
								<Select
									value={departmentFilter}
									onChange={(e) =>
										setDepartmentFilter(e.target.value)
									}
									options={[
										{
											value: "all",
											label: "All Departments",
										},
										...departments.map((d) => ({
											value: d.name,
											label: d.name,
										})),
									]}
								/>
							</div>
						</div>

						<div className='p-4'>
							<div className='overflow-x-auto'>
								<table className='w-full'>
									<thead>
										<tr className='border-b border-border-light dark:border-border-dark'>
											<th className='text-left py-3 px-4 font-medium text-text-secondary-light dark:text-text-secondary-dark'>
												Resolver
											</th>
											<th className='text-left py-3 px-4 font-medium text-text-secondary-light dark:text-text-secondary-dark'>
												Department
											</th>
											<th className='text-left py-3 px-4 font-medium text-text-secondary-light dark:text-text-secondary-dark'>
												Issues Resolved
											</th>
											<th className='text-left py-3 px-4 font-medium text-text-secondary-light dark:text-text-secondary-dark'>
												Status
											</th>
											<th className='text-right py-3 px-4 font-medium text-text-secondary-light dark:text-text-secondary-dark'>
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{filteredResolvers.map((resolver) => (
											<tr
												key={resolver.id}
												className='border-b border-border-light dark:border-border-dark last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors'
											>
												<td className='py-3 px-4'>
													<div className='flex items-center gap-3'>
														<img
															src={
																resolver.avatar
															}
															alt={resolver.name}
															className='size-10 rounded-full object-cover'
														/>
														<div>
															<p className='font-medium text-text-primary-light dark:text-text-primary-dark'>
																{resolver.name}
															</p>
															<p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
																{resolver.email}
															</p>
														</div>
													</div>
												</td>
												<td className='py-3 px-4'>
													<Badge variant='default'>
														{resolver.department}
													</Badge>
												</td>
												<td className='py-3 px-4 text-text-primary-light dark:text-text-primary-dark'>
													{resolver.resolvedCount ||
														0}
												</td>
												<td className='py-3 px-4'>
													<Badge
														variant={
															resolver.isVerified
																? "success"
																: "warning"
														}
													>
														{resolver.isVerified
															? "Verified"
															: "Pending"}
													</Badge>
												</td>
												<td className='py-3 px-4'>
													<div className='flex items-center justify-end gap-2'>
														<button
															onClick={() =>
																handleEditResolver(
																	resolver
																)
															}
															className='p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary-light dark:text-text-secondary-dark'
														>
															<span className='material-symbols-outlined text-xl'>
																edit
															</span>
														</button>
														<button
															onClick={() =>
																handleDeleteResolver(
																	resolver
																)
															}
															className='p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500'
														>
															<span className='material-symbols-outlined text-xl'>
																delete
															</span>
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</main>
			</div>

			{/* Add Resolver Modal */}
			<Modal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				title='Add New Resolver'
			>
				<div className='space-y-4'>
					<Input
						label='Full Name'
						placeholder='Enter full name'
						fullWidth
					/>
					<Input
						label='Email'
						type='email'
						placeholder='Enter email'
						fullWidth
					/>
					<Select
						label='Department'
						options={departments.map((d) => ({
							value: d.name,
							label: d.name,
						}))}
						fullWidth
					/>
					<Input
						label='Employee ID'
						placeholder='Enter employee ID'
						fullWidth
					/>
					<div className='flex gap-3 pt-4'>
						<Button
							variant='outline'
							onClick={() => setShowAddModal(false)}
							className='flex-1'
						>
							Cancel
						</Button>
						<Button className='flex-1'>Add Resolver</Button>
					</div>
				</div>
			</Modal>

			{/* Edit Resolver Modal */}
			<Modal
				isOpen={showEditModal}
				onClose={() => setShowEditModal(false)}
				title='Edit Resolver'
			>
				{selectedResolver && (
					<div className='space-y-4'>
						<Input
							label='Full Name'
							defaultValue={selectedResolver.name}
							fullWidth
						/>
						<Input
							label='Email'
							type='email'
							defaultValue={selectedResolver.email}
							fullWidth
						/>
						<Select
							label='Department'
							defaultValue={selectedResolver.department}
							options={departments.map((d) => ({
								value: d.name,
								label: d.name,
							}))}
							fullWidth
						/>
						<Select
							label='Status'
							defaultValue={
								selectedResolver.isVerified
									? "verified"
									: "pending"
							}
							options={[
								{ value: "verified", label: "Verified" },
								{ value: "pending", label: "Pending" },
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
