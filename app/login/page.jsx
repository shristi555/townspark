"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "../contexts/theme_context";
import { useAuthStore } from "../z_internals/controllers/auth";
import { GuestOnly } from "../z_internals/components/auth";
import { Button, Input } from "../components/ui";

function LoginForm() {
	const router = useRouter();
	const { darkMode, toggleDarkMode } = useTheme();

	// Use the new auth store
	const {
		login,
		isLoggedIn,
		isLoading: authLoading,
		userInfo,
		errorMessage,
		clearError,
		getValidationErrorForField,
	} = useAuthStore();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

	// Redirect based on user role after login
	useEffect(() => {
		if (isLoggedIn && userInfo) {
			// Check for stored redirect path
			const storedRedirect = sessionStorage.getItem("auth_redirect");
			if (storedRedirect) {
				sessionStorage.removeItem("auth_redirect");
				router.push(storedRedirect);
				return;
			}

			// Role-based redirect
			if (userInfo.isAdmin) {
				router.push("/admin");
			} else if (userInfo.isStaff) {
				router.push("/resolver");
			} else {
				router.push("/feed");
			}
		}
	}, [isLoggedIn, userInfo, router]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear local errors
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
		// Clear API errors
		clearError();
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
		try {
			await login(formData.email, formData.password, {
				rememberMe: true,
			});
			// Redirect is handled by the useEffect above
		} finally {
			setLoading(false);
		}
	};

	// Get field errors from either local validation or API validation
	const getFieldError = (field) => {
		return errors[field] || getValidationErrorForField(field);
	};

	return (
		<div
			className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${
				darkMode ? "bg-gray-900" : "bg-gray-50"
			}`}
		>
			<div className='max-w-md w-full space-y-8'>
				<div className='text-center'>
					<div className='flex justify-center items-center gap-2 mb-4'>
						<Link href='/' className='flex items-center gap-3'>
							<div className='size-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600'>
								<span className='material-symbols-outlined text-white text-xl'>
									location_city
								</span>
							</div>
							<span className='text-xl font-bold text-text-primary-light dark:text-text-primary-dark'>
								TownSpark
							</span>
						</Link>
					</div>
					<h2
						className={`text-xl font-semibold ${
							darkMode ? "text-white" : "text-gray-900"
						}`}
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
						className={`p-2 rounded-lg transition-colors ${
							darkMode
								? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}
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
					className={`mt-8 space-y-6 p-8 rounded-xl shadow-lg ${
						darkMode ? "bg-gray-800" : "bg-white"
					}`}
					onSubmit={handleSubmit}
				>
					{/* API Error Message */}
					{errorMessage && (
						<div className='p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'>
							<p className='text-sm text-red-600 dark:text-red-400'>
								{errorMessage}
							</p>
						</div>
					)}

					<div className='space-y-4'>
						<div>
							<label
								htmlFor='email'
								className={`block text-sm font-medium mb-1 ${
									darkMode ? "text-gray-300" : "text-gray-700"
								}`}
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
								error={getFieldError("email")}
								darkMode={darkMode}
							/>
						</div>

						<div>
							<label
								htmlFor='password'
								className={`block text-sm font-medium mb-1 ${
									darkMode ? "text-gray-300" : "text-gray-700"
								}`}
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
								error={getFieldError("password")}
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
						loading={loading || authLoading}
						disabled={loading || authLoading}
					>
						Sign in
					</Button>

					<p
						className={`text-center text-sm ${
							darkMode ? "text-gray-400" : "text-gray-600"
						}`}
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
						className={`text-sm ${
							darkMode
								? "text-gray-400 hover:text-gray-300"
								: "text-gray-600 hover:text-gray-900"
						}`}
					>
						Back to home
					</Link>
				</div>
			</div>
		</div>
	);
}

// Wrap the login form with GuestOnly to redirect authenticated users
export default function LoginPage() {
	return (
		<GuestOnly redirectTo='/feed'>
			<LoginForm />
		</GuestOnly>
	);
}
