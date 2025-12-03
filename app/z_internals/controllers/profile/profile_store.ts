import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { ProfileService } from "../../services/profile/profile_service";
import { BackendResponse } from "../../services/backend_response";
import {
	Profile,
	UpdateProfileData,
	ProfileIssue,
} from "../../models/profile_model";

// ============ Types ============

export type ValidationErrors = Record<string, string[]>;

export interface ProfileState {
	// Profile data
	myProfile: Profile | null;
	viewedProfile: Profile | null;

	// Loading states
	isLoading: boolean;
	isUpdating: boolean;

	// Error handling
	errorMessage: string | null;
	validationErrors: ValidationErrors | null;

	// Update success flag
	updateSuccess: boolean;
}

export interface ProfileActions {
	// Fetch operations
	fetchMyProfile: () => Promise<Profile | null>;
	fetchUserProfile: (userId: number) => Promise<Profile | null>;

	// Update operations
	updateProfile: (
		data: UpdateProfileData,
		profileImage?: File | null
	) => Promise<boolean>;
	updateProfileImage: (image: File) => Promise<boolean>;

	// State management
	setMyProfile: (profile: Profile | null) => void;
	setViewedProfile: (profile: Profile | null) => void;
	clearViewedProfile: () => void;
	clearError: () => void;
	clearUpdateSuccess: () => void;
	reset: () => void;

	// Validation helpers
	fieldHasError: (fieldName: string) => boolean;
	getValidationErrorForField: (fieldName: string) => string | null;
}

export type ProfileStore = ProfileState & ProfileActions;

// ============ Initial State ============

const initialState: ProfileState = {
	myProfile: null,
	viewedProfile: null,
	isLoading: false,
	isUpdating: false,
	errorMessage: null,
	validationErrors: null,
	updateSuccess: false,
};

// ============ Profile Service Instance ============

const profileService = ProfileService.getInstance();

// ============ Helper Functions ============

function handleBackendError(
	set: (fn: (state: ProfileState) => void) => void,
	result: BackendResponse
) {
	const error = result.error;

	console.log("Backend error:", result.toJson());

	if (!error) {
		set((state) => {
			state.errorMessage = "An unknown error occurred";
		});
		return;
	}

	// Check for validation errors (field-specific errors)
	if (error.details && typeof error.details === "object") {
		const details = error.details as Record<string, any>;

		// Check if details contains field errors
		const hasFieldErrors = Object.keys(details).some(
			(key) =>
				Array.isArray(details[key]) ||
				(typeof details[key] === "string" && key !== "detail")
		);

		if (hasFieldErrors) {
			const validationErrors: ValidationErrors = {};
			for (const [key, value] of Object.entries(details)) {
				if (Array.isArray(value)) {
					validationErrors[key] = value;
				} else if (typeof value === "string") {
					validationErrors[key] = [value];
				}
			}
			set((state) => {
				state.validationErrors = validationErrors;
				state.errorMessage = error.message || "Validation failed";
			});
			return;
		}
	}

	// General error message
	set((state) => {
		state.errorMessage =
			error.message || error.details?.detail || "An error occurred";
		state.validationErrors = null;
	});
}

function handleException(
	set: (fn: (state: ProfileState) => void) => void,
	e: any
) {
	console.error("Profile operation exception:", e);
	set((state) => {
		state.errorMessage = "An unexpected error occurred";
		state.validationErrors = null;
	});
}

// ============ Selectors ============

export const selectMyProfile = (state: ProfileStore) => state.myProfile;
export const selectViewedProfile = (state: ProfileStore) => state.viewedProfile;
export const selectIsLoading = (state: ProfileStore) => state.isLoading;
export const selectIsUpdating = (state: ProfileStore) => state.isUpdating;
export const selectErrorMessage = (state: ProfileStore) => state.errorMessage;
export const selectValidationErrors = (state: ProfileStore) =>
	state.validationErrors;
export const selectUpdateSuccess = (state: ProfileStore) => state.updateSuccess;

// Derived selectors
export const selectMyIssues = (state: ProfileStore) =>
	state.myProfile?.issues ?? [];
export const selectMyIssuesCount = (state: ProfileStore) =>
	state.myProfile?.issuesReported ?? 0;
export const selectMyProgressUpdatesCount = (state: ProfileStore) =>
	state.myProfile?.progressUpdates ?? 0;
export const selectMyResolvedIssuesCount = (state: ProfileStore) =>
	state.myProfile?.resolvedIssuesCount ?? 0;
export const selectMyOpenIssuesCount = (state: ProfileStore) =>
	state.myProfile?.openIssuesCount ?? 0;
export const selectMyInProgressIssuesCount = (state: ProfileStore) =>
	state.myProfile?.inProgressIssuesCount ?? 0;

// ============ Store Creation ============

export const useProfileStore = create<ProfileStore>()(
	subscribeWithSelector(
		immer((set, get) => ({
			...initialState,

			// ============ Fetch Operations ============

			fetchMyProfile: async () => {
				set((state) => {
					state.isLoading = true;
					state.errorMessage = null;
				});

				try {
					const result = await profileService.fetchMyProfile();

					if (!result.success) {
						handleBackendError(set, result);
						return null;
					}

					if (result.response) {
						const profile = Profile.fromJson(result.response);
						set((state) => {
							state.myProfile = profile;
						});
						return profile;
					}
					return null;
				} catch (e) {
					handleException(set, e);
					return null;
				} finally {
					set((state) => {
						state.isLoading = false;
					});
				}
			},

			fetchUserProfile: async (userId: number) => {
				set((state) => {
					state.isLoading = true;
					state.errorMessage = null;
				});

				try {
					const result =
						await profileService.fetchUserProfile(userId);

					if (!result.success) {
						handleBackendError(set, result);
						return null;
					}

					if (result.response) {
						const profile = Profile.fromJson(result.response);
						set((state) => {
							state.viewedProfile = profile;
						});
						return profile;
					}
					return null;
				} catch (e) {
					handleException(set, e);
					return null;
				} finally {
					set((state) => {
						state.isLoading = false;
					});
				}
			},

			// ============ Update Operations ============

			updateProfile: async (
				data: UpdateProfileData,
				profileImage?: File | null
			) => {
				set((state) => {
					state.isUpdating = true;
					state.errorMessage = null;
					state.validationErrors = null;
					state.updateSuccess = false;
				});

				try {
					const result = await profileService.updateProfile(
						data,
						profileImage
					);

					if (!result.success) {
						handleBackendError(set, result);
						return false;
					}

					// Refresh the profile after update
					if (result.response) {
						const profile = Profile.fromJson(result.response);
						set((state) => {
							state.myProfile = profile;
							state.updateSuccess = true;
						});
					} else {
						// If no response, fetch the updated profile
						await get().fetchMyProfile();
						set((state) => {
							state.updateSuccess = true;
						});
					}

					return true;
				} catch (e) {
					handleException(set, e);
					return false;
				} finally {
					set((state) => {
						state.isUpdating = false;
					});
				}
			},

			updateProfileImage: async (image: File) => {
				set((state) => {
					state.isUpdating = true;
					state.errorMessage = null;
					state.updateSuccess = false;
				});

				try {
					const result =
						await profileService.updateProfileImage(image);

					if (!result.success) {
						handleBackendError(set, result);
						return false;
					}

					// Refresh the profile after update
					await get().fetchMyProfile();
					set((state) => {
						state.updateSuccess = true;
					});

					return true;
				} catch (e) {
					handleException(set, e);
					return false;
				} finally {
					set((state) => {
						state.isUpdating = false;
					});
				}
			},

			// ============ State Management ============

			setMyProfile: (profile: Profile | null) => {
				set((state) => {
					state.myProfile = profile;
				});
			},

			setViewedProfile: (profile: Profile | null) => {
				set((state) => {
					state.viewedProfile = profile;
				});
			},

			clearViewedProfile: () => {
				set((state) => {
					state.viewedProfile = null;
				});
			},

			clearError: () => {
				set((state) => {
					state.errorMessage = null;
					state.validationErrors = null;
				});
			},

			clearUpdateSuccess: () => {
				set((state) => {
					state.updateSuccess = false;
				});
			},

			reset: () => {
				set((state) => {
					Object.assign(state, initialState);
				});
			},

			// ============ Validation Helpers ============

			fieldHasError: (fieldName: string) => {
				const errors = get().validationErrors;
				return errors !== null && fieldName in errors;
			},

			getValidationErrorForField: (fieldName: string) => {
				const errors = get().validationErrors;
				if (errors && fieldName in errors) {
					const fieldErrors = errors[fieldName];
					return fieldErrors.length > 0 ? fieldErrors[0] : null;
				}
				return null;
			},
		}))
	)
);
