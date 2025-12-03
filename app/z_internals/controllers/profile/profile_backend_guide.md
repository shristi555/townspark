# Profile Controller

This controller handles user profile management within the TownSpark frontend, providing state management and API integration for profile operations.

## Architecture

The profile controller follows the same architecture as the issue controller:

- **profile_store.ts**: Zustand store with immer middleware for state management
- **profile_atoms.ts**: Jotai atoms bridging the Zustand store for components preferring Jotai's API
- **index.ts**: Exports all profile-related modules

## Features

- Fetch authenticated user's profile with statistics
- View other users' public profiles
- Update profile information (name, phone, address, profile image)
- Loading and error state management
- Validation error handling

## Usage

### Using the Zustand Store

```typescript
import { useProfileStore } from "@/z_internals/controllers/profile";

function MyComponent() {
	const { myProfile, isLoading, fetchMyProfile, updateProfile } = useProfileStore();

	useEffect(() => {
		fetchMyProfile();
	}, []);

	const handleUpdate = async () => {
		const success = await updateProfile({
			full_name: "New Name",
			phone_number: "+1234567890",
		});
		if (success) {
			console.log("Profile updated!");
		}
	};

	return <div>{myProfile?.displayName}</div>;
}
```

### Using Selectors

```typescript
import { useProfileStore, selectMyProfile, selectIsLoading } from "@/z_internals/controllers/profile";

function MyComponent() {
	const myProfile = useProfileStore(selectMyProfile);
	const isLoading = useProfileStore(selectIsLoading);

	return <div>{isLoading ? "Loading..." : myProfile?.displayName}</div>;
}
```

### Using Jotai Atoms

```typescript
import { useAtom } from "jotai";
import { myProfileAtom, isLoadingAtom } from "@/z_internals/controllers/profile";

function MyComponent() {
	const [myProfile] = useAtom(myProfileAtom);
	const [isLoading] = useAtom(isLoadingAtom);

	return <div>{isLoading ? "Loading..." : myProfile?.displayName}</div>;
}
```

## State

### ProfileState

| Property         | Type             | Description                         |
| ---------------- | ---------------- | ----------------------------------- |
| myProfile        | Profile \| null  | Authenticated user's profile        |
| viewedProfile    | Profile \| null  | Another user's profile being viewed |
| isLoading        | boolean          | Loading state for fetch operations  |
| isUpdating       | boolean          | Loading state for update operations |
| errorMessage     | string \| null   | General error message               |
| validationErrors | ValidationErrors | Field-specific validation errors    |
| updateSuccess    | boolean          | Flag indicating successful update   |

## Actions

| Action             | Description                           |
| ------------------ | ------------------------------------- |
| fetchMyProfile     | Fetch authenticated user's profile    |
| fetchUserProfile   | Fetch another user's profile by ID    |
| updateProfile      | Update profile with data and/or image |
| updateProfileImage | Update only the profile image         |
| setMyProfile       | Set my profile directly               |
| setViewedProfile   | Set viewed profile directly           |
| clearViewedProfile | Clear the viewed profile              |
| clearError         | Clear error messages                  |
| clearUpdateSuccess | Clear update success flag             |
| reset              | Reset store to initial state          |

## Selectors

| Selector                      | Returns                  |
| ----------------------------- | ------------------------ |
| selectMyProfile               | My profile               |
| selectViewedProfile           | Viewed profile           |
| selectIsLoading               | Loading state            |
| selectIsUpdating              | Updating state           |
| selectErrorMessage            | Error message            |
| selectValidationErrors        | Validation errors        |
| selectUpdateSuccess           | Update success flag      |
| selectMyIssues                | My issues list           |
| selectMyIssuesCount           | Issues reported count    |
| selectMyProgressUpdatesCount  | Progress updates count   |
| selectMyResolvedIssuesCount   | Resolved issues count    |
| selectMyOpenIssuesCount       | Open issues count        |
| selectMyInProgressIssuesCount | In-progress issues count |

## API Endpoints

| Method | Endpoint                              | Description                         |
| ------ | ------------------------------------- | ----------------------------------- |
| GET    | `/api/v1/accounts/profile/mine/`      | Get authenticated user's profile    |
| GET    | `/api/v1/accounts/profile/<user_id>/` | Get another user's profile          |
| PUT    | `/api/v1/accounts/update-profile/`    | Update authenticated user's profile |
