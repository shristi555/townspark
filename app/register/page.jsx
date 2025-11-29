"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "../contexts/theme_context";
import { useAuth } from "../contexts/auth_context";
import { Button, Input, Select, Toggle, FileDropzone } from "../components/ui";
import { useCategories, useAreas } from "../hooks";
import { CoreService } from "../modules/core";

const userTypes = [
	{
		value: "citizen",
		label: "Citizen",
		icon: "person",
		description: "Report and track local issues",
	},
	{
		value: "resolver",
		label: "Authority / Resolver",
		icon: "badge",
		description: "Resolve reported issues",
	},
];

export default function RegisterPage() {
	const router = useRouter();
	const { darkMode, toggleDarkMode } = useTheme();
	const { register, registerResolver, isAuthenticated, user } = useAuth();
	const [userType, setUserType] = useState("citizen");
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
		// Resolver specific
		department: "",
		employeeId: "",
		designation: "",
		idDocument: null,
	});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [apiError, setApiError] = useState("");

	// Fetch departments from API
	const [departments, setDepartments] = useState([]);
	useEffect(() => {
		const fetchDepartments = async () => {
			try {
				const response = await CoreService.getDepartments();
				if (response.success) {
					setDepartments(response.data || []);
				}
			} catch (error) {
				console.error("Failed to fetch departments:", error);
			}
		};
		fetchDepartments();
	}, []);

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated && user) {
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

	const validateStep1 = () => {
		const newErrors = {};
		if (!formData.name) newErrors.name = "Name is required";
		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}
		if (!formData.phone) {
			newErrors.phone = "Phone number is required";
		} else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
			newErrors.phone = "Please enter a valid 10-digit phone number";
		}
		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		}
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}
		return newErrors;
	};

	const validateStep2 = () => {
		const newErrors = {};
		if (userType === "resolver") {
			if (!formData.department)
				newErrors.department = "Department is required";
			if (!formData.employeeId)
				newErrors.employeeId = "Employee ID is required";
			if (!formData.designation)
				newErrors.designation = "Designation is required";
		}
		if (!termsAccepted) {
			newErrors.terms = "You must accept the terms and conditions";
		}
		return newErrors;
	};

	const handleNext = () => {
		const newErrors = validateStep1();
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		setStep(2);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = validateStep2();
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setLoading(true);
		setApiError("");

		try {
			let result;

			if (userType === "resolver") {
				// Register as resolver
				result = await registerResolver({
					email: formData.email,
					password: formData.password,
					full_name: formData.name,
					phone_number: formData.phone,
					department: formData.department,
					employee_id: formData.employeeId,
					designation: formData.designation,
				});
			} else {
				// Register as citizen
				result = await register({
					email: formData.email,
					password: formData.password,
					full_name: formData.name,
					phone_number: formData.phone,
				});
			}

			if (result.success) {
				if (userType === "resolver") {
					router.push("/resolver/pending");
				} else {
					router.push("/feed");
				}
			} else {
				setApiError(
					result.error || "Registration failed. Please try again."
				);
			}
		} catch (error) {
			setApiError("An unexpected error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex bg-background-light dark:bg-background-dark'>
			{/* Left Panel - Image */}
			<div className='hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-600' />
				<div className='absolute top-20 right-10 size-64 bg-white/10 rounded-full blur-3xl' />
				<div className='absolute bottom-20 left-10 size-64 bg-blue-400/20 rounded-full blur-3xl' />

				<div className='relative z-10 flex flex-col items-center justify-center p-12 text-white'>
					<span className='material-symbols-outlined text-8xl mb-8 opacity-80'>
						{userType === "citizen" ? "groups" : "verified_user"}
					</span>
					<h2 className='text-3xl font-bold text-center mb-4'>
						{userType === "citizen"
							? "Join Your Community"
							: "Become a Verified Resolver"}
					</h2>
					<p className='text-lg text-white/80 text-center max-w-md'>
						{userType === "citizen"
							? "Connect with neighbors and local authorities to build a better neighborhood together."
							: "Help resolve community issues and make a real difference in people's lives."}
					</p>
				</div>
			</div>

			{/* Right Panel - Form */}
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
				<div className='flex-1 flex items-center justify-center px-4 sm:px-8 py-8 overflow-y-auto'>
					<div className='w-full max-w-md'>
						<h1 className='text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2'>
							Create Account
						</h1>
						<p className='text-text-secondary-light dark:text-text-secondary-dark mb-6'>
							{step === 1
								? "Choose your account type"
								: "Complete your registration"}
						</p>

						{/* Progress Steps */}
						<div className='flex items-center gap-2 mb-8'>
							<div
								className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-border-light dark:bg-border-dark"}`}
							/>
							<div
								className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-border-light dark:bg-border-dark"}`}
							/>
						</div>

						{step === 1 ? (
							<div className='space-y-6'>
								{apiError && (
									<div className='p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm'>
										{apiError}
									</div>
								)}
								{/* User Type Selection */}
								<div className='grid grid-cols-2 gap-4'>
									{userTypes.map((type) => (
										<button
											key={type.value}
											type='button'
											onClick={() =>
												setUserType(type.value)
											}
											className={`p-4 rounded-xl border-2 text-left transition-all ${
												userType === type.value
													? "border-primary bg-primary/5"
													: "border-border-light dark:border-border-dark hover:border-primary/50"
											}`}
										>
											<span
												className={`material-symbols-outlined text-2xl mb-2 ${
													userType === type.value
														? "text-primary"
														: "text-text-secondary-light dark:text-text-secondary-dark"
												}`}
											>
												{type.icon}
											</span>
											<p className='font-semibold text-text-primary-light dark:text-text-primary-dark'>
												{type.label}
											</p>
											<p className='text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1'>
												{type.description}
											</p>
										</button>
									))}
								</div>

								{/* Basic Info */}
								<Input
									label='Full Name'
									name='name'
									placeholder='Enter your full name'
									value={formData.name}
									onChange={handleChange}
									error={errors.name}
									icon='person'
									fullWidth
								/>

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

								<Input
									label='Phone Number'
									type='tel'
									name='phone'
									placeholder='Enter your phone number'
									value={formData.phone}
									onChange={handleChange}
									error={errors.phone}
									icon='phone'
									fullWidth
								/>

								<Input
									label='Password'
									type='password'
									name='password'
									placeholder='Create a strong password'
									value={formData.password}
									onChange={handleChange}
									error={errors.password}
									icon='lock'
									helperText='At least 8 characters'
									fullWidth
								/>

								<Input
									label='Confirm Password'
									type='password'
									name='confirmPassword'
									placeholder='Confirm your password'
									value={formData.confirmPassword}
									onChange={handleChange}
									error={errors.confirmPassword}
									icon='lock'
									fullWidth
								/>

								<Button
									onClick={handleNext}
									fullWidth
									className='h-12'
								>
									Continue
								</Button>
							</div>
						) : (
							<form onSubmit={handleSubmit} className='space-y-6'>
								{apiError && (
									<div className='p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm'>
										{apiError}
									</div>
								)}
								{userType === "resolver" && (
									<>
										<Select
											label='Department'
											name='department'
											placeholder='Select your department'
											value={formData.department}
											onChange={handleChange}
											error={errors.department}
											options={departments.map((d) => ({
												value: d.id,
												label: d.name,
											}))}
											fullWidth
										/>

										<Input
											label='Employee ID'
											name='employeeId'
											placeholder='Enter your employee ID'
											value={formData.employeeId}
											onChange={handleChange}
											error={errors.employeeId}
											icon='badge'
											fullWidth
										/>

										<Input
											label='Designation'
											name='designation'
											placeholder='Enter your designation'
											value={formData.designation}
											onChange={handleChange}
											error={errors.designation}
											icon='work'
											fullWidth
										/>

										<FileDropzone
											label='ID Document'
											description='Upload your government ID'
											subDescription='PDF, PNG, or JPG (max 5MB)'
											onFileSelect={(file) =>
												setFormData((prev) => ({
													...prev,
													idDocument: file,
												}))
											}
										/>

										<div className='p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30'>
											<div className='flex items-start gap-3'>
												<span className='material-symbols-outlined text-yellow-600 dark:text-yellow-400'>
													info
												</span>
												<p className='text-sm text-yellow-700 dark:text-yellow-300'>
													Your account will be pending
													verification until an
													administrator approves your
													credentials.
												</p>
											</div>
										</div>
									</>
								)}

								{/* Terms */}
								<Toggle
									checked={termsAccepted}
									onChange={setTermsAccepted}
									label={
										<span className='text-text-secondary-light dark:text-text-secondary-dark'>
											I agree to the{" "}
											<Link
												href='/terms'
												className='text-primary hover:underline'
											>
												Terms of Service
											</Link>{" "}
											and{" "}
											<Link
												href='/privacy'
												className='text-primary hover:underline'
											>
												Privacy Policy
											</Link>
										</span>
									}
								/>
								{errors.terms && (
									<p className='text-sm text-red-500'>
										{errors.terms}
									</p>
								)}

								<div className='flex gap-4'>
									<Button
										type='button'
										variant='outline'
										onClick={() => setStep(1)}
										className='flex-1 h-12'
									>
										Back
									</Button>
									<Button
										type='submit'
										loading={loading}
										className='flex-1 h-12'
									>
										Create Account
									</Button>
								</div>
							</form>
						)}

						{/* Sign In Link */}
						<p className='text-center mt-8 text-text-secondary-light dark:text-text-secondary-dark'>
							Already have an account?{" "}
							<Link
								href='/login'
								className='text-primary font-semibold hover:underline'
							>
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
