"use client";

import { useState } from "react";
import { Avatar, Button, Badge, Modal, Select, Textarea } from "../ui";

export default function UserTable({
	users = [],
	onEdit,
	onDelete,
	onToggleStatus,
	showRole = true,
	showActions = true,
	className = "",
}) {
	const [selectedUser, setSelectedUser] = useState(null);
	const [actionModal, setActionModal] = useState(null);

	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleDateString();
	};

	const getRoleBadgeColor = (role) => {
		switch (role) {
			case "admin":
				return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
			case "resolver":
				return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
			case "citizen":
				return "bg-green-500/10 text-green-600 dark:text-green-400";
			default:
				return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
		}
	};

	return (
		<>
			<div className={`overflow-x-auto ${className}`}>
				<table className='w-full min-w-[700px]'>
					<thead>
						<tr className='border-b border-border-light dark:border-border-dark'>
							<th className='text-left py-3 px-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark'>
								User
							</th>
							<th className='text-left py-3 px-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark'>
								Email
							</th>
							{showRole && (
								<th className='text-left py-3 px-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark'>
									Role
								</th>
							)}
							<th className='text-left py-3 px-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark'>
								Joined
							</th>
							<th className='text-left py-3 px-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark'>
								Status
							</th>
							{showActions && (
								<th className='text-right py-3 px-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark'>
									Actions
								</th>
							)}
						</tr>
					</thead>
					<tbody className='divide-y divide-border-light dark:divide-border-dark'>
						{users.map((user) => (
							<tr
								key={user.id}
								className='hover:bg-black/5 dark:hover:bg-white/5 transition-colors'
							>
								<td className='py-3 px-4'>
									<div className='flex items-center gap-3'>
										<Avatar
											src={user.avatar}
											name={user.name}
											size='sm'
										/>
										<div>
											<p className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
												{user.name}
											</p>
											<p className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
												@{user.username}
											</p>
										</div>
									</div>
								</td>
								<td className='py-3 px-4'>
									<span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
										{user.email}
									</span>
								</td>
								{showRole && (
									<td className='py-3 px-4'>
										<span
											className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
												user.role
											)}`}
										>
											{user.role
												?.charAt(0)
												.toUpperCase() +
												user.role?.slice(1)}
										</span>
									</td>
								)}
								<td className='py-3 px-4'>
									<span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
										{formatDate(user.joinedAt)}
									</span>
								</td>
								<td className='py-3 px-4'>
									<span
										className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
											user.isActive
												? "bg-green-500/10 text-green-600 dark:text-green-400"
												: "bg-red-500/10 text-red-600 dark:text-red-400"
										}`}
									>
										<span
											className={`size-1.5 rounded-full ${
												user.isActive
													? "bg-green-500"
													: "bg-red-500"
											}`}
										/>
										{user.isActive ? "Active" : "Inactive"}
									</span>
								</td>
								{showActions && (
									<td className='py-3 px-4'>
										<div className='flex items-center justify-end gap-2'>
											<button
												onClick={() => onEdit?.(user)}
												className='size-8 rounded-lg flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/10 dark:hover:bg-white/10 transition-colors'
											>
												<span className='material-symbols-outlined text-lg'>
													edit
												</span>
											</button>
											<button
												onClick={() =>
													onToggleStatus?.(user)
												}
												className='size-8 rounded-lg flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/10 dark:hover:bg-white/10 transition-colors'
											>
												<span className='material-symbols-outlined text-lg'>
													{user.isActive
														? "person_off"
														: "person"}
												</span>
											</button>
											<button
												onClick={() => onDelete?.(user)}
												className='size-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors'
											>
												<span className='material-symbols-outlined text-lg'>
													delete
												</span>
											</button>
										</div>
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>

				{users.length === 0 && (
					<div className='py-12 text-center text-text-secondary-light dark:text-text-secondary-dark'>
						<span className='material-symbols-outlined text-4xl mb-2 block opacity-50'>
							group_off
						</span>
						<p>No users found</p>
					</div>
				)}
			</div>
		</>
	);
}
