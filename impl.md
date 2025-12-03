# UI Implementation Plan for TownSpark App

## App info

- name : TownSpark
- description : the app is a platform where we can post the local issue of our town and get it resolved by the concerned authorities.

it will have the following features:

1. User can post an issue with title, description, location (with map), and at least one image.
2. other users can like(uplift) and comment on the issue.
3. the issue will then be viewed by the concerned authorities (Admins) who can update the status of the issue (open, in-progress, resolved).
4. admin will see the issues and take necessary actions.
5. the taken actions will then be posted into the issue timeline for users to see the progress. (only admin can post in the timeline)

for the implementation of the app,

it will include the following pages/screens:

## basic pages

1. Landing Page - Welcome page with app overview and call-to-action buttons for signup and login, with sections highlighting key features of the app
2. About Page - Information about the app, its purpose, and how it works
3. Contact Page - Contact form for users to reach out to the support team
4. FAQ Page - Frequently asked questions and their answers
5. Terms of Service Page - Legal terms and conditions for using the app
6. Privacy Policy Page - Information on how user data is collected, used, and protected
7. 404 Page - Custom error page for handling non-existent routes
8. 500 Page - Custom error page for handling server errors

## App specific pages

1. Home Page - Dashboard displaying recent issues, user statistics, and quick links to post new issues or view existing ones

2. Signup page - User registration form asks for full name, email, password, address, phone number, and profile picture upload
3. Login Page - User login form with email and password fields

4. Profile Page - User profile details with edit option it will contain full name, email, address, phone number, and profile picture along with a list of issues posted by the user, the comments made by the user, and the status of those issues. (in their own section)

5. User details page - Detailed view of a specific user, including their profile information and a list of issues they have posted. this is different from profile page as this page is viewable by other users publicly.

6. Issue listing page - Lists all the available issues throughout the town, with filters for location, status (open, in-progress, resolved), and date posted. Each issue will show a brief overview including title, location, status, and a thumbnail image. Clicking on an issue will navigate to the issue detail page.

7. Issue Detail Page - Detailed view of a specific issue, including title, full description, location (with map), images, comments section for users to discuss the issue, and status updates from authorities as a timeline.

8. Issue Posting Page - Form for users to submit a new issue, including fields for title, description, location (with map integration), and at least one mandatory image upload.

9. My issues Page - A personalized page where users can view and manage the issues they have posted, including their status and any comments or updates. They can also edit or delete their issues from this page.

## Admin pages

for the admin panel, we will have the following pages:

1. Admin Dashboard - Overview of the platform with statistics on total users, total issues, issues by status, and recent activity. It will also include quick links to manage users and issues.

2. User Management Page - A list of all registered users with options to view details, edit user information, deactivate/reactivate accounts, and delete users. Each user entry will show their name, email, registration date, and number of issues posted.

3. Issue Management Page - A list of all reported issues with options to view details, change status (open, in-progress, resolved), and delete issues. Each issue entry will show its title, location, status, and the user who reported it.

4. Issue Detail Page (Admin View) - Detailed view of a specific issue with additional admin controls, including the ability to change the issue status, view user comments. This page will also show the history of status changes and actions taken by admins.

## Ui management

- use consistent header and footer across all pages
- use a sidebar/drawer for navigation
- use bottom navigation for mobile view

## Design guides

for the design, we will follow these guidelines:

1. Color Scheme: Use a clean and modern color palette with primary colors for action buttons and highlights, and neutral colors for backgrounds and text.
2. Typography: Use a readable sans-serif font for body text and a bold serif font for headings to create a clear hierarchy.
3. Layout: Use a responsive grid layout to ensure the app looks good on both desktop and mobile devices. Include ample white space to avoid clutter.

4. Icons and Images: Use intuitive icons for navigation and actions, and ensure all images are optimized for fast loading without sacrificing quality.

5. Use proper use of visually appealing effects like glassmorphism, neumorphism etc.
