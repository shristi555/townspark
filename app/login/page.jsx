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

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated && user) {
			// Redirect based on role
			if (user.role === "admin") {
				router.push("/admin");
			} else if (user.role === "resolver") {
				router.push("/resolver");
			} else {
				router.push("/feed");
			}
		}
	}, [isAuthenticated, user, router]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
		setApiError("");
	};

	const validate = () => {
		const newErrors = {};
		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}
		if (!formData.password) {
			newErrors.password = "Password is required";
		}
		return newErrors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = validate();
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setLoading(true);
		setApiError("");

		const result = await login(formData.email, formData.password);

		if (!result.success) {
			// Handle error - it could be a string or an object with message property
			const errorMessage =
				typeof result.error === "object"
					? result.error?.message ||
						result.error?.detail ||
						"Invalid credentials. Please try again."
					: result.error || "Invalid credentials. Please try again.";
			setApiError(errorMessage);
			setLoading(false);
		}
		// If successful, useEffect will handle redirect
	};

	return (
		<div className='min-h-screen flex bg-background-light dark:bg-background-dark'>
			{/* Left Panel - Form */}
			<div className='w-full lg:w-1/2 flex flex-col'>
				{/* Header */}
				<header className='p-4 sm:p-6 flex items-center justify-between'>
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
					<button
						onClick={toggleDarkMode}
						className='size-10 rounded-full flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors'
					>
						<span className='material-symbols-outlined'>
							{darkMode ? "light_mode" : "dark_mode"}
						</span>
					</button>
				</header>

				{/* Form */}
				<div className='flex-1 flex items-center justify-center px-4 sm:px-8 py-12'>
					<div className='w-full max-w-md'>
						<h1 className='text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2'>
							Welcome back
						</h1>
						<p className='text-text-secondary-light dark:text-text-secondary-dark mb-8'>
							Sign in to continue to TownSpark
						</p>

						<form onSubmit={handleSubmit} className='space-y-6'>
							{apiError && (
								<div className='p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm'>
									{apiError}
								</div>
							)}

							<Input
								label='Email'
								type='email'
								name='email'
								placeholder='you@example.com'
								value={formData.email}
								onChange={handleChange}
								error={errors.email}
								icon='mail'
								fullWidth
							/>

							<div>
								<Input
									label='Password'
									type='password'
									name='password'
									placeholder='Enter your password'
									value={formData.password}
									onChange={handleChange}
									error={errors.password}
									icon='lock'
									fullWidth
								/>
								<div className='flex justify-end mt-2'>
									<Link
										href='/forgot-password'
										className='text-sm text-primary hover:underline'
									>
										Forgot password?
									</Link>
								</div>
							</div>

							<Button
								type='submit'
								fullWidth
								loading={loading}
								className='h-12'
							>
								Sign In
							</Button>
						</form>

						{/* Divider */}
						<div className='flex items-center gap-4 my-8'>
							<div className='flex-1 h-px bg-border-light dark:bg-border-dark' />
							<span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
								or continue with
							</span>
							<div className='flex-1 h-px bg-border-light dark:bg-border-dark' />
						</div>

						{/* Social Login */}
						<div className='flex gap-4'>
							<Button
								variant='outline'
								fullWidth
								className='h-12'
							>
								<svg
									className='size-5 mr-2'
									viewBox='0 0 24 24'
								>
									<path
										fill='currentColor'
										d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
									/>
									<path
										fill='currentColor'
										d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
									/>
									<path
										fill='currentColor'
										d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
									/>
									<path
										fill='currentColor'
										d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
									/>
								</svg>
								Google
							</Button>
							<Button
								variant='outline'
								fullWidth
								className='h-12'
							>
								<span className='material-symbols-outlined mr-2'>
									phone
								</span>
								Phone
							</Button>
						</div>

						{/* Sign Up Link */}
						<p className='text-center mt-8 text-text-secondary-light dark:text-text-secondary-dark'>
							Don't have an account?{" "}
							<Link
								href='/register'
								className='text-primary font-semibold hover:underline'
							>
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* Right Panel - Image/Illustration */}
			<div className='hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden'>
				{/* Background Pattern */}
				<div className='absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-600' />
				<div className='absolute top-20 left-10 size-64 bg-white/10 rounded-full blur-3xl' />
				<div className='absolute bottom-20 right-10 size-64 bg-blue-400/20 rounded-full blur-3xl' />

				{/* Content */}
				<div className='relative z-10 flex flex-col items-center justify-center p-12 text-white'>
					<span className='material-symbols-outlined text-8xl mb-8 opacity-80'>
						location_city
					</span>
					<h2 className='text-3xl font-bold text-center mb-4'>
						Make Your Community Better
					</h2>
					<p className='text-lg text-white/80 text-center max-w-md'>
						Report issues, track progress, and collaborate with your
						neighbors for a cleaner, safer neighborhood.
					</p>
				</div>
			</div>
		</div>
	);
}
