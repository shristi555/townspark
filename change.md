# Changes Made

### Login Page (page.jsx)

- Replaced `useAuth` from `../contexts/auth_context` with `useAuthStore` from the new controllers
- Wrapped with `GuestOnly` component to redirect authenticated users
- Uses `login()` action from the store
- Role-based redirects using `userInfo.isAdmin` and `userInfo.isStaff`
- Displays `errorMessage` from store and uses `getValidationErrorForField()` for field errors
- Respects stored redirect path in `sessionStorage`

### Register Page (page.jsx)

- Replaced `useAuth` with `useAuthStore`
- Wrapped with `GuestOnly` component
- Uses `RegisterModel` to create registration data
- Combines `firstName` + `lastName` into `fullName` for the model
- Added optional `phoneNumber` and `address` fields (matches RegisterModel)
- Removed `username` field (not in RegisterModel)
- Uses `signup()` action with the RegisterModel instance
- Same role-based redirect logic and error handling

Made changes.
