"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "../contexts/theme_context";
import { useAuth } from "../contexts/auth_context";
import { Button, Input, Toggle } from "../components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useTheme();
  const { register, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [apiError, setApiError] = useState("");

  // Redirect if already authenticated
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });

      if (result.success) {
        router.push("/feed");
      } else {
        const errorMessage =
          typeof result.error === "object"
            ? result.error?.message ||
              result.error?.detail ||
              "Registration failed. Please try again."
            : result.error || "Registration failed. Please try again.";
        setApiError(errorMessage);
      }
    } catch (error) {
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background-light dark:bg-background-dark">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-600" />
        <div className="absolute top-20 right-10 size-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 size-64 bg-blue-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <span className="material-symbols-outlined text-8xl mb-8 opacity-80">
            groups
          </span>
          <h2 className="text-3xl font-bold text-center mb-4">
            Join Your Community
          </h2>
          <p className="text-lg text-white/80 text-center max-w-md">
            Connect with neighbors and local authorities to build a better
            neighborhood together.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Header */}
        <header className="p-4 sm:p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600">
              <span className="material-symbols-outlined text-white text-xl">
                location_city
              </span>
            </div>
            <span className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
              TownSpark
            </span>
          </Link>
          <button
            onClick={toggleDarkMode}
            className="size-10 rounded-full flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>
        </header>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 overflow-y-auto">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
              Create Account
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
              Join TownSpark and start reporting local issues
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {apiError && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                  {apiError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="first_name"
                  placeholder="Enter you first name"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={errors.first_name}
                  icon="person"
                  fullWidth
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  placeholder="Enter your last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  error={errors.last_name}
                  icon="person"
                  fullWidth
                />
              </div>

              <Input
                label="Username"
                name="username"
                placeholder="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                icon="alternate_email"
                fullWidth
              />

              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon="mail"
                fullWidth
              />

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon="lock"
                helperText="At least 8 characters"
                fullWidth
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon="lock"
                fullWidth
              />

              {/* Terms */}
              <Toggle
                checked={termsAccepted}
                onChange={setTermsAccepted}
                label={
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                }
              />
              {errors.terms && (
                <p className="text-sm text-red-500">{errors.terms}</p>
              )}

              <Button
                type="submit"
                loading={loading}
                fullWidth
                className="h-12"
              >
                Create Account
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-center mt-8 text-text-secondary-light dark:text-text-secondary-dark">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
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
