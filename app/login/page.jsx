"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "../contexts/theme_context";
import { useAuth } from "../contexts/auth_context";
import { Button, Input } from "../components/ui";

export default function LoginPage() {
	const router = useRouter();
	const { darkMode, toggleDarkMode } = useTheme();
	const { login, isAuthenticated, loading: authLoading, user } = useAuth();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [apiError, setApiError] = useState("");

	useEffect(() => {
		if (isAuthenticated && user) {
			if (user.is_admin) {
				router.push("/admin");
			} else if (user.is_staff) {
				router.push("/resolver");
			} else {
				router.push("/feed");
			}
		}
	}, [isAuthenticated, user, router]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
		setApiError("");
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}
		if (!formData.password) {
			newErrors.password = "Password is required";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;
		setLoading(true);
		setApiError("");
		try {
			const response = await login(formData.email, formData.password);
			if (!response.success) {
				setApiError(response.error || "Invalid credentials");
			}
		} catch (error) {
			setApiError("An unexpected error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (authLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' />
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
		>
			<div className='max-w-md w-full space-y-8'>
				<div className='text-center'>
					<div className='flex justify-center items-center gap-2 mb-4'>
						<div className='w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center'>
							<span className='text-white font-bold text-xl'>
								T
							</span>
						</div>
						<h1
							className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
						>
							TownSpark
						</h1>
					</div>
					<h2
						className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
					>
						Welcome back
					</h2>
					<p
						className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
					>
						Sign in to your account to continue
					</p>
				</div>

				<div className='flex justify-center'>
					<button
						onClick={toggleDarkMode}
						className={`p-2 rounded-lg transition-colors ${darkMode ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
					>
						{darkMode ? (
							<svg
								className='w-5 h-5'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
									clipRule='evenodd'
								/>
							</svg>
						) : (
							<svg
								className='w-5 h-5'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
							</svg>
						)}
					</button>
				</div>

				<form
					className={`mt-8 space-y-6 p-8 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}
					onSubmit={handleSubmit}
				>
					{apiError && (
						<div className='p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'>
							<p className='text-sm text-red-600 dark:text-red-400'>
								{apiError}
							</p>
						</div>
					)}

					<div className='space-y-4'>
						<div>
							<label
								htmlFor='email'
								className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
							>
								Email address
							</label>
							<Input
								id='email'
								name='email'
								type='email'
								autoComplete='email'
								value={formData.email}
								onChange={handleChange}
								placeholder='Enter your email'
								error={errors.email}
								darkMode={darkMode}
							/>
						</div>

						<div>
							<label
								htmlFor='password'
								className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
							>
								Password
							</label>
							<Input
								id='password'
								name='password'
								type='password'
								autoComplete='current-password'
								value={formData.password}
								onChange={handleChange}
								placeholder='Enter your password'
								error={errors.password}
								darkMode={darkMode}
							/>
						</div>
					</div>

					<div className='flex items-center justify-end'>
						<Link
							href='/forgot-password'
							className='text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400'
						>
							Forgot your password?
						</Link>
					</div>

					<Button
						type='submit'
						variant='primary'
						fullWidth
						loading={loading}
						disabled={loading}
					>
						Sign in
					</Button>

					<p
						className={`text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
					>
						Don&apos;t have an account?{" "}
						<Link
							href='/register'
							className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400'
						>
							Sign up
						</Link>
					</p>
				</form>

				<div className='text-center'>
					<Link
						href='/'
						className={`text-sm ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"}`}
					>
						Back to home
					</Link>
				</div>
			</div>
		</div>
	);
}
