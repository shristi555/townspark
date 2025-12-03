// Issue Store (Zustand)
export {
	useIssueStore,
	type IssueState,
	type IssueActions,
	type IssueStore,
	type ValidationErrors,
	type Category,
	type ProgressUpdate,
	type IssueStatus,
	type CreateIssueData,
	// Selectors
	selectIssues,
	selectMyIssues,
	selectCategories,
	selectCurrentIssue,
	selectCurrentIssueProgress,
	selectIsLoading,
	selectIsCreating,
	selectIsUpdating,
	selectIsDeleting,
	selectErrorMessage,
	selectValidationErrors,
} from "./issue_store";

// Issue Atoms (Jotai)
export {
	// State atoms
	issuesAtom,
	myIssuesAtom,
	categoriesAtom,
	currentIssueAtom,
	currentIssueProgressAtom,
	// Loading atoms
	isLoadingAtom,
	isLoadingDetailsAtom,
	isLoadingProgressAtom,
	isCreatingAtom,
	isUpdatingAtom,
	isDeletingAtom,
	isAnyLoadingAtom,
	// Error atoms
	errorMessageAtom,
	validationErrorsAtom,
	hasValidationErrorsAtom,
	// Derived atoms
	issueCountAtom,
	myIssueCountAtom,
	openIssuesAtom,
	inProgressIssuesAtom,
	resolvedIssuesAtom,
	closedIssuesAtom,
	issueCountByStatusAtom,
	currentIssueIdAtom,
	hasCurrentIssueAtom,
	currentIssueStatusAtom,
	categoryOptionsAtom,
	// Factories
	createCategoryByIdAtom,
	createIssueByIdAtom,
	createFieldErrorAtom,
	createFieldHasErrorAtom,
	// Field error atoms
	titleErrorAtom,
	descriptionErrorAtom,
	locationErrorAtom,
	categoryErrorAtom,
	statusErrorAtom,
	// Action atoms
	fetchIssuesAtom,
	fetchMyIssuesAtom,
	fetchIssueDetailsAtom,
	fetchIssueProgressAtom,
	fetchCategoriesAtom,
	createIssueAtom,
	updateIssueAtom,
	deleteIssueAtom,
	clearErrorAtom,
	clearCurrentIssueAtom,
	resetStoreAtom,
	// Hooks
	useFieldError,
	useFieldHasError,
	useIssueActions,
	useIssueState,
	useIssues,
	useMyIssues,
	useCategories,
	useCurrentIssue,
	useCurrentIssueProgress,
	useIssueLoading,
	useIssueById,
	useIssuesByStatus,
} from "./issue_atoms";

// Re-export models
export { Issue } from "../../models/issue_model";
