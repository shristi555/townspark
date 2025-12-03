import { atom } from "jotai";
import {
	useIssueStore,
	type IssueStore,
	type ValidationErrors,
	type Category,
	type ProgressUpdate,
	type IssueStatus,
	type CreateIssueData,
} from "./issue_store";
import { Issue } from "../../models/issue_model";

// ============ Bridge atoms (sync Zustand state to Jotai) ============

/**
 * These atoms bridge the Zustand store to Jotai for components
 * that prefer Jotai's API or need derived/computed atoms
 */

// Base state atoms
export const issuesAtom = atom((get) => useIssueStore.getState().issues);
export const myIssuesAtom = atom((get) => useIssueStore.getState().myIssues);
export const categoriesAtom = atom(
	(get) => useIssueStore.getState().categories
);
export const currentIssueAtom = atom(
	(get) => useIssueStore.getState().currentIssue
);
export const currentIssueProgressAtom = atom(
	(get) => useIssueStore.getState().currentIssueProgress
);

// Loading state atoms
export const isLoadingAtom = atom((get) => useIssueStore.getState().isLoading);
export const isLoadingDetailsAtom = atom(
	(get) => useIssueStore.getState().isLoadingDetails
);
export const isLoadingProgressAtom = atom(
	(get) => useIssueStore.getState().isLoadingProgress
);
export const isCreatingAtom = atom(
	(get) => useIssueStore.getState().isCreating
);
export const isUpdatingAtom = atom(
	(get) => useIssueStore.getState().isUpdating
);
export const isDeletingAtom = atom(
	(get) => useIssueStore.getState().isDeleting
);

// Error state atoms
export const errorMessageAtom = atom(
	(get) => useIssueStore.getState().errorMessage
);
export const validationErrorsAtom = atom(
	(get) => useIssueStore.getState().validationErrors
);

// ============ Derived/Computed Atoms ============

/**
 * Check if any loading operation is in progress
 */
export const isAnyLoadingAtom = atom((get) => {
	const state = useIssueStore.getState();
	return (
		state.isLoading ||
		state.isLoadingDetails ||
		state.isLoadingProgress ||
		state.isCreating ||
		state.isUpdating ||
		state.isDeleting
	);
});

/**
 * Check if there are any validation errors
 */
export const hasValidationErrorsAtom = atom((get) => {
	const errors = get(validationErrorsAtom);
	return errors !== null && Object.keys(errors).length > 0;
});

/**
 * Get total issue count
 */
export const issueCountAtom = atom((get) => {
	return get(issuesAtom).length;
});

/**
 * Get my issue count
 */
export const myIssueCountAtom = atom((get) => {
	return get(myIssuesAtom).length;
});

/**
 * Get issues by status
 */
export const openIssuesAtom = atom((get) => {
	return get(issuesAtom).filter((issue) => issue.status === "open");
});

export const inProgressIssuesAtom = atom((get) => {
	return get(issuesAtom).filter((issue) => issue.status === "in_progress");
});

export const resolvedIssuesAtom = atom((get) => {
	return get(issuesAtom).filter((issue) => issue.status === "resolved");
});

export const closedIssuesAtom = atom((get) => {
	return get(issuesAtom).filter((issue) => issue.status === "closed");
});

/**
 * Get issue count by status
 */
export const issueCountByStatusAtom = atom((get) => {
	const issues = get(issuesAtom);
	return {
		open: issues.filter((i) => i.status === "open").length,
		in_progress: issues.filter((i) => i.status === "in_progress").length,
		resolved: issues.filter((i) => i.status === "resolved").length,
		closed: issues.filter((i) => i.status === "closed").length,
	};
});

/**
 * Get current issue ID
 */
export const currentIssueIdAtom = atom((get) => {
	return get(currentIssueAtom)?.id ?? null;
});

/**
 * Check if current issue exists
 */
export const hasCurrentIssueAtom = atom((get) => {
	return get(currentIssueAtom) !== null;
});

/**
 * Get current issue status
 */
export const currentIssueStatusAtom = atom((get) => {
	return get(currentIssueAtom)?.status ?? null;
});

/**
 * Get category options for forms (id -> name mapping)
 */
export const categoryOptionsAtom = atom((get) => {
	return get(categoriesAtom).map((cat) => ({
		value: cat.id,
		label: cat.name,
	}));
});

/**
 * Get category by ID
 */
export function createCategoryByIdAtom(categoryId: number) {
	return atom((get) => {
		return get(categoriesAtom).find((cat) => cat.id === categoryId) ?? null;
	});
}

/**
 * Get issue by ID from issues list
 */
export function createIssueByIdAtom(issueId: number) {
	return atom((get) => {
		return get(issuesAtom).find((issue) => issue.id === issueId) ?? null;
	});
}

// ============ Field Error Atoms Factory ============

/**
 * Creates an atom that returns the validation error for a specific field
 */
export function createFieldErrorAtom(fieldName: string) {
	return atom((get) => {
		const errors = get(validationErrorsAtom);
		if (!errors || !(fieldName in errors)) return null;
		return errors[fieldName]?.[0] ?? null;
	});
}

/**
 * Creates an atom that checks if a specific field has an error
 */
export function createFieldHasErrorAtom(fieldName: string) {
	return atom((get) => {
		const errors = get(validationErrorsAtom);
		if (!errors) return false;
		return fieldName in errors;
	});
}

// ============ Common Field Error Atoms ============

export const titleErrorAtom = createFieldErrorAtom("title");
export const descriptionErrorAtom = createFieldErrorAtom("description");
export const locationErrorAtom = createFieldErrorAtom("location");
export const categoryErrorAtom = createFieldErrorAtom("category");
export const statusErrorAtom = createFieldErrorAtom("status");

// ============ Writable Atoms for Actions ============

/**
 * Atom to trigger fetch issues
 */
export const fetchIssuesAtom = atom(null, async (get, set) => {
	await useIssueStore.getState().fetchIssues();
});

/**
 * Atom to trigger fetch my issues
 */
export const fetchMyIssuesAtom = atom(null, async (get, set) => {
	await useIssueStore.getState().fetchMyIssues();
});

/**
 * Atom to trigger fetch issue details
 */
export const fetchIssueDetailsAtom = atom(
	null,
	async (get, set, issueId: number) => {
		return await useIssueStore.getState().fetchIssueDetails(issueId);
	}
);

/**
 * Atom to trigger fetch issue progress
 */
export const fetchIssueProgressAtom = atom(
	null,
	async (get, set, issueId: number) => {
		await useIssueStore.getState().fetchIssueProgress(issueId);
	}
);

/**
 * Atom to trigger fetch categories
 */
export const fetchCategoriesAtom = atom(null, async (get, set) => {
	await useIssueStore.getState().fetchCategories();
});

/**
 * Atom to create an issue
 */
export const createIssueAtom = atom(
	null,
	async (
		get,
		set,
		{
			data,
			files,
		}: { data: CreateIssueData; files?: Record<string, File> | null }
	) => {
		return await useIssueStore.getState().createIssue(data, files);
	}
);

/**
 * Atom to update an issue
 */
export const updateIssueAtom = atom(
	null,
	async (
		get,
		set,
		{
			issueId,
			data,
		}: {
			issueId: number;
			data: { status?: IssueStatus; [key: string]: any };
		}
	) => {
		return await useIssueStore.getState().updateIssue(issueId, data);
	}
);

/**
 * Atom to delete an issue
 */
export const deleteIssueAtom = atom(null, async (get, set, issueId: number) => {
	return await useIssueStore.getState().deleteIssue(issueId);
});

/**
 * Atom to clear errors
 */
export const clearErrorAtom = atom(null, (get, set) => {
	useIssueStore.getState().clearError();
});

/**
 * Atom to clear current issue
 */
export const clearCurrentIssueAtom = atom(null, (get, set) => {
	useIssueStore.getState().clearCurrentIssue();
});

/**
 * Atom to reset store
 */
export const resetStoreAtom = atom(null, (get, set) => {
	useIssueStore.getState().reset();
});

// ============ Custom Hooks for easier usage ============

/**
 * Hook to get field error for a specific field
 */
export function useFieldError(fieldName: string): string | null {
	const errors = useIssueStore((state) => state.validationErrors);
	if (!errors || !(fieldName in errors)) return null;
	return errors[fieldName]?.[0] ?? null;
}

/**
 * Hook to check if a field has error
 */
export function useFieldHasError(fieldName: string): boolean {
	const errors = useIssueStore((state) => state.validationErrors);
	if (!errors) return false;
	return fieldName in errors;
}

/**
 * Hook for issue actions
 */
export function useIssueActions() {
	const store = useIssueStore();
	return {
		fetchIssues: store.fetchIssues,
		fetchMyIssues: store.fetchMyIssues,
		fetchUserIssues: store.fetchUserIssues,
		fetchIssueDetails: store.fetchIssueDetails,
		fetchIssueProgress: store.fetchIssueProgress,
		fetchCategories: store.fetchCategories,
		createIssue: store.createIssue,
		updateIssue: store.updateIssue,
		deleteIssue: store.deleteIssue,
		createCategory: store.createCategory,
		setCurrentIssue: store.setCurrentIssue,
		clearCurrentIssue: store.clearCurrentIssue,
		clearError: store.clearError,
		reset: store.reset,
	};
}

/**
 * Hook for issue state
 */
export function useIssueState() {
	const store = useIssueStore();
	return {
		issues: store.issues,
		myIssues: store.myIssues,
		categories: store.categories,
		currentIssue: store.currentIssue,
		currentIssueProgress: store.currentIssueProgress,
		isLoading: store.isLoading,
		isLoadingDetails: store.isLoadingDetails,
		isLoadingProgress: store.isLoadingProgress,
		isCreating: store.isCreating,
		isUpdating: store.isUpdating,
		isDeleting: store.isDeleting,
		errorMessage: store.errorMessage,
		validationErrors: store.validationErrors,
	};
}

/**
 * Hook for issues only
 */
export function useIssues() {
	return useIssueStore((state) => state.issues);
}

/**
 * Hook for my issues only
 */
export function useMyIssues() {
	return useIssueStore((state) => state.myIssues);
}

/**
 * Hook for categories only
 */
export function useCategories() {
	return useIssueStore((state) => state.categories);
}

/**
 * Hook for current issue
 */
export function useCurrentIssue() {
	return useIssueStore((state) => state.currentIssue);
}

/**
 * Hook for current issue progress
 */
export function useCurrentIssueProgress() {
	return useIssueStore((state) => state.currentIssueProgress);
}

/**
 * Hook for loading state
 */
export function useIssueLoading() {
	return useIssueStore((state) => ({
		isLoading: state.isLoading,
		isLoadingDetails: state.isLoadingDetails,
		isLoadingProgress: state.isLoadingProgress,
		isCreating: state.isCreating,
		isUpdating: state.isUpdating,
		isDeleting: state.isDeleting,
	}));
}

/**
 * Hook for getting issue by ID from the store
 */
export function useIssueById(issueId: number) {
	return useIssueStore(
		(state) => state.issues.find((issue) => issue.id === issueId) ?? null
	);
}

/**
 * Hook for getting issues filtered by status
 */
export function useIssuesByStatus(status: IssueStatus) {
	return useIssueStore((state) =>
		state.issues.filter((issue) => issue.status === status)
	);
}

export default {
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
};
