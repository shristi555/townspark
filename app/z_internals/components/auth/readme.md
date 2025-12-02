## Auth Protection Components

Contains a comprehensive set of auth protection components:

### Page-Level Guards (Show access denied UI when unauthorized)

| Component       | Purpose                                                               |
| --------------- | --------------------------------------------------------------------- |
| `LoginRequired` | Protects content requiring login, shows login UI if not authenticated |
| `AdminRequired` | Protects admin-only content, shows admin access denied UI             |
| `StaffRequired` | Protects staff-only content (optionally includes admins)              |
| `RoleRequired`  | Flexible guard with custom role check function                        |
| `GuestOnly`     | For login/register pages - redirects authenticated users away         |

### Conditional Renderers (Just show/hide, no UI)

| Component         | Purpose                                                       |
| ----------------- | ------------------------------------------------------------- |
| `AuthConditional` | Render different content for authenticated vs unauthenticated |
| `RoleConditional` | Render different content based on role check                  |
| `ShowIfLoggedIn`  | Show children only if logged in                               |
| `ShowIfAdmin`     | Show children only if admin                                   |
| `ShowIfStaff`     | Show children only if staff (or admin)                        |
| `HideIfLoggedIn`  | Hide children if logged in                                    |

### Usage Examples

```tsx
// Protect a page requiring login
<LoginRequired message="Please login to view your profile">
  <ProfilePage />
</LoginRequired>

// Admin-only page
<AdminRequired>
  <UserManagementPanel />
</AdminRequired>

// Login page (redirect if already logged in)
<GuestOnly redirectTo="/dashboard">
  <LoginForm />
</GuestOnly>

// Conditional UI elements
<ShowIfAdmin>
  <DeleteButton />
</ShowIfAdmin>

// Custom role check
<RoleRequired
  roleCheck={(user) => user.isAdmin || user.isStaff}
  title="Staff Area"
>
  <StaffDashboard />
</RoleRequired>
```
