import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { IssueService } from "../../services/issues/issue_service";
import { BackendResponse } from "../../services/backend_response";
import { Issue } from "../../models/issue_model";

// ============ Types ============

export type ValidationErrors = Record<string, string[]>;

export type IssueStatus = "open" | "in_progress" | "resolved" | "closed";

export interface Category {
	id: number;
	name: string;
	description: string;
}

export interface ProgressUpdate {
	id: number;
	issue: number;
	description: string;
	created_at: string;
	updated_by: {
		id: number;
		full_name: string;
		profile_image?: string | null;
	};
	images: string[];
}

export interface CreateIssueData {
	title: string;
	description: string;
	location: string;
	category: number;
}

export interface IssueState {
	// Issue lists
	issues: Issue[];
	myIssues: Issue[];
	categories: Category[];

	// Current issue
	currentIssue: Issue | null;
	currentIssueProgress: ProgressUpdate[];

	// Loading states
	isLoading: boolean;
	isLoadingDetails: boolean;
	isLoadingProgress: boolean;
	isCreating: boolean;
	isUpdating: boolean;
	isDeleting: boolean;

	// Error handling
	errorMessage: string | null;
	validationErrors: ValidationErrors | null;

	// Pagination (for future use)
	hasMore: boolean;
	currentPage: number;
}

export interface IssueActions {
	// Fetch operations
	fetchIssues: () => Promise<void>;
	fetchMyIssues: () => Promise<void>;
	fetchUserIssues: (userId: number) => Promise<Issue[]>;
	fetchIssueDetails: (issueId: number) => Promise<Issue | null>;
	fetchIssueProgress: (issueId: number) => Promise<void>;
	fetchCategories: () => Promise<void>;

	// CRUD operations
	createIssue: (
		data: CreateIssueData,
		files?: Record<string, File> | null
	) => Promise<Issue | null>;
	updateIssue: (
		issueId: number,
		data: { status?: IssueStatus; [key: string]: any }
	) => Promise<Issue | null>;
	deleteIssue: (issueId: number) => Promise<boolean>;

	// Admin operations
	createCategory: (
		name: string,
		description: string
	) => Promise<Category | null>;

	// State management
	setCurrentIssue: (issue: Issue | null) => void;
	clearCurrentIssue: () => void;
	clearError: () => void;
	reset: () => void;

	// Validation helpers
	fieldHasError: (fieldName: string) => boolean;
	getValidationErrorForField: (fieldName: string) => string | null;
}

export type IssueStore = IssueState & IssueActions;

// ============ Initial State ============

const initialState: IssueState = {
	issues: [],
	myIssues: [],
	categories: [],
	currentIssue: null,
	currentIssueProgress: [],
	isLoading: false,
	isLoadingDetails: false,
	isLoadingProgress: false,
	isCreating: false,
	isUpdating: false,
	isDeleting: false,
	errorMessage: null,
	validationErrors: null,
	hasMore: true,
	currentPage: 1,
};

// ============ Issue Service Instance ============

const issueService = IssueService.getInstance();

// ============ Helper Functions ============

function handleBackendError(
	set: (fn: (state: IssueState) => void) => void,
	result: BackendResponse
) {
	const error = result.error;

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
	set: (fn: (state: IssueState) => void) => void,
	e: any
) {
	console.error("Issue operation exception:", e);
	set((state) => {
		state.errorMessage = "An unexpected error occurred";
		state.validationErrors = null;
	});
}

// ============ Selectors ============

export const selectIssues = (state: IssueStore) => state.issues;
export const selectMyIssues = (state: IssueStore) => state.myIssues;
export const selectCategories = (state: IssueStore) => state.categories;
export const selectCurrentIssue = (state: IssueStore) => state.currentIssue;
export const selectCurrentIssueProgress = (state: IssueStore) =>
	state.currentIssueProgress;
export const selectIsLoading = (state: IssueStore) => state.isLoading;
export const selectIsCreating = (state: IssueStore) => state.isCreating;
export const selectIsUpdating = (state: IssueStore) => state.isUpdating;
export const selectIsDeleting = (state: IssueStore) => state.isDeleting;
export const selectErrorMessage = (state: IssueStore) => state.errorMessage;
export const selectValidationErrors = (state: IssueStore) =>
	state.validationErrors;

// ============ Store Creation ============

export const useIssueStore = create<IssueStore>()(
	subscribeWithSelector(
		immer((set, get) => ({
			...initialState,

			// ============ Fetch Operations ============

			fetchIssues: async () => {
				set((state) => {
					state.isLoading = true;
					state.errorMessage = null;
				});

				try {
					const result = await issueService.fetchIssues();

					if (!result.success) {
						handleBackendError(set, result);
						return;
					}

					if (result.response && Array.isArray(result.response)) {
						const issues = result.response.map((item: any) =>
							Issue.fromJson(item)
						);
						set((state) => {
							state.issues = issues;
						});
					}
				} catch (e) {
					handleException(set, e);
				} finally {
					set((state) => {
						state.isLoading = false;
					});
				}
			},

			fetchMyIssues: async () => {
				set((state) => {
					state.isLoading = true;
					state.errorMessage = null;
				});

				try {
					const result = await issueService.fetchMyIssues();

					if (!result.success) {
						handleBackendError(set, result);
						return;
					}

					if (result.response && Array.isArray(result.response)) {
						const issues = result.response.map((item: any) =>
							Issue.fromJson(item)
						);
						set((state) => {
							state.myIssues = issues;
						});
					}
				} catch (e) {
					handleException(set, e);
				} finally {
					set((state) => {
						state.isLoading = false;
					});
				}
			},

			fetchUserIssues: async (userId: number) => {
				set((state) => {
					state.isLoading = true;
					state.errorMessage = null;
				});

				try {
					const result = await issueService.fetchUserIssues(userId);

					if (!result.success) {
						handleBackendError(set, result);
						return [];
					}

					if (result.response && Array.isArray(result.response)) {
						return result.response.map((item: any) =>
							Issue.fromJson(item)
						);
					}
					return [];
				} catch (e) {
					handleException(set, e);
					return [];
				} finally {
					set((state) => {
						state.isLoading = false;
					});
				}
			},

			fetchIssueDetails: async (issueId: number) => {
				set((state) => {
					state.isLoadingDetails = true;
					state.errorMessage = null;
				});

				try {
					const result =
						await issueService.fetchIssueDetails(issueId);

					if (!result.success) {
						handleBackendError(set, result);
						return null;
					}

					if (result.response) {
						const issue = Issue.fromJson(result.response);
						set((state) => {
							state.currentIssue = issue;
						});
						return issue;
					}
					return null;
				} catch (e) {
					handleException(set, e);
					return null;
				} finally {
					set((state) => {
						state.isLoadingDetails = false;
					});
				}
			},

			fetchIssueProgress: async (issueId: number) => {
				set((state) => {
					state.isLoadingProgress = true;
					state.errorMessage = null;
				});

				try {
					const result =
						await issueService.fetchIssueProgress(issueId);

					if (!result.success) {
						handleBackendError(set, result);
						return;
					}

					if (result.response && Array.isArray(result.response)) {
						set((state) => {
							state.currentIssueProgress =
								result.response as ProgressUpdate[];
						});
					}
				} catch (e) {
					handleException(set, e);
				} finally {
					set((state) => {
						state.isLoadingProgress = false;
					});
				}
			},

			fetchCategories: async () => {
				set((state) => {
					state.isLoading = true;
					state.errorMessage = null;
				});

				try {
					const result = await issueService.fetchCategories();

					if (!result.success) {
						handleBackendError(set, result);
						return;
					}

					if (result.response && Array.isArray(result.response)) {
						set((state) => {
							state.categories = result.response as Category[];
						});
					}
				} catch (e) {
					handleException(set, e);
				} finally {
					set((state) => {
						state.isLoading = false;
					});
				}
			},

			// ============ CRUD Operations ============

			createIssue: async (data, files) => {
				set((state) => {
					state.isCreating = true;
					state.errorMessage = null;
					state.validationErrors = null;
				});

				try {
					const result = await issueService.createIssue(data, files);

					if (!result.success) {
						handleBackendError(set, result);
						return null;
					}

					if (result.response) {
						const newIssue = Issue.fromJson(result.response);

						// Add to issues list
						set((state) => {
							state.issues = [newIssue, ...state.issues];
							state.myIssues = [newIssue, ...state.myIssues];
						});

						return newIssue;
					}
					return null;
				} catch (e) {
					handleException(set, e);
					return null;
				} finally {
					set((state) => {
						state.isCreating = false;
					});
				}
			},

			updateIssue: async (issueId, data) => {
				set((state) => {
					state.isUpdating = true;
					state.errorMessage = null;
					state.validationErrors = null;
				});

				try {
					const result = await issueService.updateIssue(
						issueId,
						data
					);

					if (!result.success) {
						handleBackendError(set, result);
						return null;
					}

					if (result.response) {
						const updatedIssue = Issue.fromJson(result.response);

						// Update in lists
						set((state) => {
							state.issues = state.issues.map((issue) =>
								issue.id === issueId ? updatedIssue : issue
							);
							state.myIssues = state.myIssues.map((issue) =>
								issue.id === issueId ? updatedIssue : issue
							);
							if (state.currentIssue?.id === issueId) {
								state.currentIssue = updatedIssue;
							}
						});

						return updatedIssue;
					}
					return null;
				} catch (e) {
					handleException(set, e);
					return null;
				} finally {
					set((state) => {
						state.isUpdating = false;
					});
				}
			},

			deleteIssue: async (issueId) => {
				set((state) => {
					state.isDeleting = true;
					state.errorMessage = null;
				});

				try {
					const result = await issueService.deleteIssue(issueId);

					if (!result.success) {
						handleBackendError(set, result);
						return false;
					}

					// Remove from lists
					set((state) => {
						state.issues = state.issues.filter(
							(issue) => issue.id !== issueId
						);
						state.myIssues = state.myIssues.filter(
							(issue) => issue.id !== issueId
						);
						if (state.currentIssue?.id === issueId) {
							state.currentIssue = null;
						}
					});

					return true;
				} catch (e) {
					handleException(set, e);
					return false;
				} finally {
					set((state) => {
						state.isDeleting = false;
					});
				}
			},

			// ============ Admin Operations ============

			createCategory: async (name, description) => {
				set((state) => {
					state.isCreating = true;
					state.errorMessage = null;
					state.validationErrors = null;
				});

				try {
					const result = await issueService.createCategory({
						name,
						description,
					});

					if (!result.success) {
						handleBackendError(set, result);
						return null;
					}

					if (result.response) {
						const newCategory = result.response as Category;

						set((state) => {
							state.categories = [
								...state.categories,
								newCategory,
							];
						});

						return newCategory;
					}
					return null;
				} catch (e) {
					handleException(set, e);
					return null;
				} finally {
					set((state) => {
						state.isCreating = false;
					});
				}
			},

			// ============ State Management ============

			setCurrentIssue: (issue) => {
				set((state) => {
					state.currentIssue = issue;
				});
			},

			clearCurrentIssue: () => {
				set((state) => {
					state.currentIssue = null;
					state.currentIssueProgress = [];
				});
			},

			clearError: () => {
				set((state) => {
					state.errorMessage = null;
					state.validationErrors = null;
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
				if (!errors || !(fieldName in errors)) return null;
				return errors[fieldName]?.[0] ?? null;
			},
		}))
	)
);

export default useIssueStore;
