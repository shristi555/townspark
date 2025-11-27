# Townspark UI Guide

This is a comprehensive breakdown of the pages, components, and architecture needed to build a fully functional **Civic Issue Reporting & Resolution Platform**.

I have categorized these into logical modules: **Public**, **Authentication**, **Citizen (User)**, **Resolver (Official)**, and **Core Components**.

---

### 1. Public & Landing Modules

_These pages are accessible to everyone, even without logging in._

#### **1.1. Landing Page (Home)**

- **Purpose:** To introduce the platform, show impact, and encourage signup.
- **UI Elements:**
    - **Hero Section:** Catchy slogan ("Fix Your City"), "Report an Issue" button (redirects to login/signup), Background video or collage of resolved issues.
    - **Live Stats Counter:** Issues Reported, Issues Resolved, Active Resolvers.
    - **Recent Activity Stream:** A preview of the latest 3-6 reported issues (Carousel or Grid).
    - **How it Works:** 3-step visual guide (Snap Photo -> Upload -> Get Fixed).
    - **Testimonials/Success Stories:** Before/After photos of resolved issues.
    - **Footer:** Links to About, Contact, Privacy Policy.

#### **1.2. Global Issue Feed (Public View)**

- **Purpose:** To allow unregistered users to browse issues in their area (read-only mode).
- **UI Elements:**
    - **Search Bar:** Search by keyword (e.g., "Pothole").
    - **Filters:** Filter by Location (City/Ward), Category (Water, Road, Electric), Status (Resolved, Pending).
    - **Issue Cards:** (Thumbnail, Title, Location, "Uplift" count).
    - **Map Toggle:** Switch between List View and Map View.

#### **1.3. About Us & Contact**

- **Purpose:** Standard information about the organization and support contact.

---

### 2. Authentication Module

_Crucial for distinguishing between Citizens and Resolvers._

#### **2.1. Sign Up / Registration**

- **Purpose:** Create an account.
- **UI Elements:**
    - **Role Toggle:** "I am a Citizen" vs "I am an Authority/Resolver".
    - **Citizen Form:** Name, Email, Phone, Password, Local Address/Ward.
    - **Resolver Form:** Name, Official Email, Department (e.g., Water Board), Designation, **ID Card Upload** (for verification), Jurisdiction (Area/Ward they handle).

#### **2.2. Login**

- **Purpose:** Access the platform.
- **UI Elements:** Email/Phone, Password, "Remember Me", "Forgot Password".

#### **2.3. Onboarding / Role Setup**

- **Purpose:** Immediate setup after first login.
- **Functionality:**
    - **Citizens:** Select areas of interest or home location to customize their feed.
    - **Resolvers:** A "Verification Pending" screen if the admin hasn't approved them yet.

---

### 3. Citizen (User) Dashboard & Flow

_For the people reporting the problems._

#### **3.1. User Home Feed (The Wall)**

- **Purpose:** Facebook-style feed showing issues in the user's locality.
- **UI Elements:**
    - **Create Post Widget:** "What's wrong in your area?" (Quick link to upload).
    - **Sorting:** Top Uplifted, Newest, Nearest to Me.
    - **Issue Cards (Detailed):** User avatar, Time posted, Issue Image, Title, Description, Location Tag, Status Badge (e.g., 🔴 Pending, 🟢 Resolved).
    - **Action Buttons:** Uplift (Like), Comment, Share.

#### **3.2. "Report an Issue" Page (The Upload Flow)**

- **Purpose:** The core feature—submitting a complaint.
- **UI Elements:**
    - **Image Uploader:** Drag & drop or Camera access. (Support for multiple images).
    - **Title Input:** Short summary (e.g., "Broken pipe at Main St").
    - **Category Dropdown:** Road, Garbage, Sewage, Electricity, Traffic.
    - **Description:** Detailed text area.
    - **Location Picker:**
        - Auto-detect GPS (Current Location).
        - Interactive Map (Pin drop).
        - Manual Address Input.
    - **Urgency Level:** Low, Medium, High (Optional).
    - **Anonymous Toggle:** "Post anonymously".

#### **3.3. Issue Detail Page**

- **Purpose:** A standalone page for a single issue (linked from the feed).
- **UI Elements:**
    - **Carousel:** View all images uploaded.
    - **Status Timeline:** Submitted -> Acknowledged -> Work in Progress -> Resolved.
    - **Official Response Section:** Pinned comment from the Resolver (e.g., "Work started, will finish in 2 days").
    - **Comments Section:** Threaded conversation.
    - **Map Widget:** Small static map showing exact location.

#### **3.4. My Profile / My Dashboard**

- **Purpose:** Manage own activity.
- **UI Elements:**
    - **Stats:** Issues Posted, Uplifts Received, Issues Resolved.
    - **My Reports Tab:** List of issues the user created.
    - **Saved/Followed Tab:** Issues the user is tracking.
    - **Settings:** Edit profile, Change password.

---

### 4. Resolver (Helper) Dashboard & Flow

_For Municipal Officers, Public Workers, NGOs._

#### **4.1. Resolver Dashboard (Command Center)**

- **Purpose:** Overview of tasks within their jurisdiction.
- **UI Elements:**
    - **KPI Cards:** Pending Issues, In-Progress, Resolved this Month, Average Response Time.
    - **Task Board (Kanban or List):**
        - _New:_ Fresh reports in their category/area.
        - _In Progress:_ Issues they have accepted.
        - _Completed:_ Issues marked done.
    - **Filter:** Filter by Ward, Urgency, or Uplift count (Priority).

#### **4.2. Action/Resolution Page**

- **Purpose:** To update the status of a specific issue.
- **UI Elements:**
    - **Issue Details:** (Same as User view).
    - **Control Panel:**
        - **Change Status:** Dropdown (Pending -> Acknowledged -> In Progress -> Resolved).
        - **Add Official Note:** Public comment appearing as an official response.
        - **Upload Proof:** Upload "After" photo to prove resolution.
    - **Internal Notes:** Private notes for other team members (not visible to public).

#### **4.3. Analytics Page**

- **Purpose:** Reports for the department.
- **UI Elements:** Charts showing common issue types, hotspots (heatmaps), and resolution efficiency.

---

### 5. Super Admin Panel (System Owner)

_For you (the website owner) to manage the platform._

#### **5.1. User Management**

- List of all citizens.
- Ban/Suspend users for spam.

#### **5.2. Resolver Management**

- **Verification Queue:** Review uploaded IDs of Resolvers and Approve/Reject their accounts.
- Assign Jurisdictions manually if needed.

#### **5.3. Content Management**

- Manage Categories (Add "Internet Issues", Remove "Old Category").
- Delete inappropriate posts/comments.

---

### 6. Component Checklist (Technical)

To build the pages above, you need these reusable components:

**Basic UI:**

1.  **Navbar:** Logo, Search, Notifications Icon, Profile Dropdown, "Report" Button.
2.  **Sidebar:** (For Dashboard views) Links to Overview, My Issues, Settings.
3.  **Footer:** Copyright, Links.
4.  **Button:** Primary, Secondary, Danger (Delete), Ghost (Cancel).
5.  **Input Fields:** Text, Password, Textarea, Select (Dropdown).
6.  **Modal/Popup:** For confirmation alerts ("Are you sure?"), or quick view of images.

**Functional Components:**

1.  **Issue Card:** The container showing the issue summary in the feed.
2.  **Uplift Button:** Needs animation and state toggle (Liked/Unliked).
3.  **Status Badge:** Color-coded labels (Red: Pending, Yellow: In Progress, Green: Solved).
4.  **Image Upload Widget:** Drag-and-drop zone with image preview and "X" to remove.
5.  **Map Component:** Integration with Google Maps, Mapbox, or Leaflet (OpenStreetMap). Needs to support pin dropping and coordinate extraction.
6.  **Comment Section:** Input box + List of existing comments.
7.  **Toast Notification:** Small popups (e.g., "Issue uploaded successfully!", "Login Failed").
8.  **Loader/Spinner:** To show while data is fetching.
9.  **Empty State:** Graphics to show when there are no issues (e.g., "No issues found here!").

**Advanced Features (Optional but recommended):**

1.  **Gamification Badge:** Display on user profile (e.g., "Community Hero" for 10 verified reports).
2.  **Social Share:** Buttons to share the issue to Facebook/Twitter/WhatsApp.
3.  **Geofencing:** Warning if a user tries to report an issue in a location not supported by the app.

---

Each screens should support both dark and light modes for better accessibility and user preference.
The design should be mobile-responsive, ensuring usability on smartphones and tablets, as many users may access the platform on-the-go.

---
