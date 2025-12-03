// Profile Store (Zustand)
export {
	useProfileStore,
	type ProfileState,
	type ProfileActions,
	type ProfileStore,
	type ValidationErrors,
	// Selectors
	selectMyProfile,
	selectViewedProfile,
	selectIsLoading,
	selectIsUpdating,
	selectErrorMessage,
	selectValidationErrors,
	selectUpdateSuccess,
	selectMyIssues,
	selectMyIssuesCount,
	selectMyProgressUpdatesCount,
	selectMyResolvedIssuesCount,
	selectMyOpenIssuesCount,
	selectMyInProgressIssuesCount,
} from "./profile_store";

// Profile Atoms (Jotai)
export {
	// State atoms
	myProfileAtom,
	viewedProfileAtom,
	currentProfileAtom,
	// Loading atoms
	isLoadingAtom,
	isUpdatingAtom,
	isAnyLoadingAtom,
	// Error atoms
	errorMessageAtom,
	validationErrorsAtom,
	hasValidationErrorsAtom,
	// Success atoms
	updateSuccessAtom,
	// Derived atoms
	myIssuesAtom,
	myIssuesCountAtom,
	myProgressUpdatesCountAtom,
	myResolvedIssuesCountAtom,
	myOpenIssuesCountAtom,
	myInProgressIssuesCountAtom,
	profileDisplayNameAtom,
	profileImageAtom,
	issuesByStatusAtom,
	// Action atoms
	fetchMyProfileAtom,
	fetchUserProfileAtom,
	updateProfileAtom,
	clearErrorAtom,
	clearUpdateSuccessAtom,
	resetProfileAtom,
} from "./profile_atoms";

// Profile Model
export {
	Profile,
	type IProfile,
	type ProfileIssue,
	type UpdateProfileData,
} from "../../models/profile_model";

/**
 * @deprecated Use useProfileStore from './profile_store' instead
 * This export is kept for backward compatibility
 */
export { useProfileStore as useProfileController } from "./profile_store";
