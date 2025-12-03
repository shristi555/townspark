import { atom } from "jotai";
import {
	useProfileStore,
	type ProfileStore,
	type ValidationErrors,
} from "./profile_store";
import { Profile, ProfileIssue } from "../../models/profile_model";

// ============ Bridge atoms (sync Zustand state to Jotai) ============

/**
 * These atoms bridge the Zustand store to Jotai for components
 * that prefer Jotai's API or need derived/computed atoms
 */

// Base state atoms
export const myProfileAtom = atom(
	(get) => useProfileStore.getState().myProfile
);
export const viewedProfileAtom = atom(
	(get) => useProfileStore.getState().viewedProfile
);

// Loading state atoms
export const isLoadingAtom = atom(
	(get) => useProfileStore.getState().isLoading
);
export const isUpdatingAtom = atom(
	(get) => useProfileStore.getState().isUpdating
);

// Error state atoms
export const errorMessageAtom = atom(
	(get) => useProfileStore.getState().errorMessage
);
export const validationErrorsAtom = atom(
	(get) => useProfileStore.getState().validationErrors
);

// Success state atoms
export const updateSuccessAtom = atom(
	(get) => useProfileStore.getState().updateSuccess
);

// ============ Derived/Computed Atoms ============

/**
 * Check if any loading operation is in progress
 */
export const isAnyLoadingAtom = atom((get) => {
	const state = useProfileStore.getState();
	return state.isLoading || state.isUpdating;
});

/**
 * Check if there are any validation errors
 */
export const hasValidationErrorsAtom = atom((get) => {
	const errors = get(validationErrorsAtom);
	return errors !== null && Object.keys(errors).length > 0;
});

/**
 * Get current profile (my profile or viewed profile)
 */
export const currentProfileAtom = atom((get) => {
	const myProfile = get(myProfileAtom);
	const viewedProfile = get(viewedProfileAtom);
	return viewedProfile ?? myProfile;
});

/**
 * Get my issues from profile
 */
export const myIssuesAtom = atom((get) => {
	const profile = get(myProfileAtom);
	return profile?.issues ?? [];
});

/**
 * Get my issues count
 */
export const myIssuesCountAtom = atom((get) => {
	const profile = get(myProfileAtom);
	return profile?.issuesReported ?? 0;
});

/**
 * Get my progress updates count
 */
export const myProgressUpdatesCountAtom = atom((get) => {
	const profile = get(myProfileAtom);
	return profile?.progressUpdates ?? 0;
});

/**
 * Get my resolved issues count
 */
export const myResolvedIssuesCountAtom = atom((get) => {
	const profile = get(myProfileAtom);
	return profile?.resolvedIssuesCount ?? 0;
});

/**
 * Get my open issues count
 */
export const myOpenIssuesCountAtom = atom((get) => {
	const profile = get(myProfileAtom);
	return profile?.openIssuesCount ?? 0;
});

/**
 * Get my in-progress issues count
 */
export const myInProgressIssuesCountAtom = atom((get) => {
	const profile = get(myProfileAtom);
	return profile?.inProgressIssuesCount ?? 0;
});

/**
 * Get profile display name
 */
export const profileDisplayNameAtom = atom((get) => {
	const profile = get(currentProfileAtom);
	return profile?.displayName ?? "";
});

/**
 * Get profile image URL
 */
export const profileImageAtom = atom((get) => {
	const profile = get(currentProfileAtom);
	return profile?.profileImage ?? null;
});

/**
 * Get issues by status from my profile
 */
export const issuesByStatusAtom = atom((get) => {
	const issues = get(myIssuesAtom);
	return {
		open: issues.filter((issue) => issue.status === "open"),
		in_progress: issues.filter((issue) => issue.status === "in_progress"),
		resolved: issues.filter((issue) => issue.status === "resolved"),
		closed: issues.filter((issue) => issue.status === "closed"),
	};
});

// ============ Action atoms (write atoms) ============

/**
 * Fetch my profile action
 */
export const fetchMyProfileAtom = atom(null, async (get, set) => {
	return useProfileStore.getState().fetchMyProfile();
});

/**
 * Fetch user profile action
 */
export const fetchUserProfileAtom = atom(
	null,
	async (get, set, userId: number) => {
		return useProfileStore.getState().fetchUserProfile(userId);
	}
);

/**
 * Update profile action
 */
export const updateProfileAtom = atom(
	null,
	async (
		get,
		set,
		data: { fullName?: string; phoneNumber?: string; address?: string },
		profileImage?: File | null
	) => {
		const updateData = {
			full_name: data.fullName,
			phone_number: data.phoneNumber,
			address: data.address,
		};
		return useProfileStore
			.getState()
			.updateProfile(updateData, profileImage);
	}
);

/**
 * Clear error action
 */
export const clearErrorAtom = atom(null, (get, set) => {
	useProfileStore.getState().clearError();
});

/**
 * Clear update success action
 */
export const clearUpdateSuccessAtom = atom(null, (get, set) => {
	useProfileStore.getState().clearUpdateSuccess();
});

/**
 * Reset profile store action
 */
export const resetProfileAtom = atom(null, (get, set) => {
	useProfileStore.getState().reset();
});
