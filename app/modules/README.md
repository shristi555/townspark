# TownSpark Services Architecture

## Overview

This application follows a **Service-Model-UI** architecture pattern where:

- **Services**: Handle all API communication and business logic
- **Models**: Define data structures and transformations
- **UI**: React components for presentation (in `/app/components`)

## Directory Structure

```
app/
├── modules/           # Primary service modules
│   ├── api/           # Core API infrastructure
│   │   ├── config.js       # API routes & configuration
│   │   ├── http_client.js  # HTTP client with auth & error handling
│   │   └── base_service.js # Base class for services
│   ├── models/        # Shared data models
│   │   └── index.js        # UserModel, IssueModel, etc.
│   ├── auth/          # Authentication service
│   ├── users/         # User management service
│   ├── issues/        # Issue management service
│   ├── comments/      # Comments service
│   ├── notifications/ # Notifications service
│   ├── resolver/      # Resolver-specific service
│   ├── admin/         # Admin-specific service
│   └── core/          # Core/reference data service
│
├── services/          # Re-exports from modules (for convenience)
│   ├── index.js       # Main export point
│   └── cookie_services.js  # Cookie management utility
│
└── contexts/          # React contexts for state management
    └── auth_context.js # Auth state management
```

## Usage

### Importing Services

```javascript
// Recommended: Import from modules
import { AuthService, UserService, IssueService } from "@/app/modules";

// Or import from services (same thing)
import { AuthService, TokenManager, cookieService } from "@/app/services";
```

### Using Services

```javascript
// Authentication
const response = await AuthService.login(email, password);
if (response.success) {
	const user = response.data.user;
}

// Issues
const issues = await IssueService.getIssues({ status: "pending", page: 1 });

// With authentication
const myIssues = await UserService.getMyIssues();
```

### Token Management

Tokens are stored in cookies (not localStorage) for SSR compatibility:

```javascript
import { TokenManager } from "@/app/modules";

// Check if authenticated
if (TokenManager.hasValidToken()) {
	// User is logged in
}

// Get access token
const token = TokenManager.getAccessToken();

// Clear tokens (logout)
TokenManager.clearTokens();
```

### Models

Use models for consistent data transformation:

```javascript
import { UserModel, IssueModel } from "@/app/modules";

// Create from API response
const user = UserModel.fromJson(apiResponse);
console.log(user.displayName); // Computed property

// Convert back to JSON for API
const payload = user.toJson();
```

## API Response Format

All services return an `ApiResponse` object:

```javascript
{
  success: boolean,
  data: any | null,
  error: any | null,
  statusCode: number,
  message: string
}
```

### Handling Responses

```javascript
const response = await IssueService.createIssue(issueData);

if (response.success) {
	// Handle success
	const newIssue = response.data;
} else {
	// Handle error
	console.error(response.errorMessage);
}
```

## Cookie Service

For direct cookie manipulation:

```javascript
import { cookieService } from "@/app/services";

// Set a cookie (expires in 7 days)
cookieService.setCookie("my_key", "my_value", 7);

// Get a cookie
const value = cookieService.getCookie("my_key");

// Delete a cookie
cookieService.deleteCookie("my_key");

// Check if cookie exists
if (cookieService.containsCookie("my_key")) {
	// Cookie exists
}
```

## Creating New Services

1. Create a new folder in `/app/modules/`
2. Create `index.js` with your service object
3. Export from `/app/modules/index.js`

Example:

```javascript
// app/modules/my_feature/index.js
import httpClient from "../api/http_client";
import { API_ROUTES } from "../api/config";

export const MyFeatureService = {
	async getData(params = {}) {
		return httpClient.get("/my-endpoint/", { params, auth: true });
	},

	async createItem(data) {
		return httpClient.post("/my-endpoint/", data, { auth: true });
	},
};

export default MyFeatureService;
```

## Authentication Flow

1. User submits credentials
2. `AuthService.login()` sends request to backend
3. On success, tokens are stored in cookies via `TokenManager`
4. Subsequent requests include auth header automatically
5. Token refresh is handled automatically by `httpClient`
6. On logout, `TokenManager.clearTokens()` removes all tokens

## SSR Compatibility

- All services check for browser environment before accessing `document`
- Cookies are used instead of localStorage for SSR support
- Token checks gracefully return `null` on server-side
