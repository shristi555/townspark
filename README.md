# Next.js Quick Start Guide for Beginners

## Table of Contents

1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Creating Components](#creating-components)
4. [Creating Routes](#creating-routes)
5. [Sharing Data Between Components](#sharing-data-between-components)
6. [Common Patterns](#common-patterns)

## Introduction

Next.js is a React framework that makes building web applications easier. This guide assumes you know basic HTML and JavaScript.

## Project Structure

```
townspark_nextjs/
├── app/                    # Main application folder
│   ├── page.js            # Home page (/)
│   ├── layout.js          # Root layout wrapper
│   └── about/
│       └── page.js        # About page (/about)
├── components/            # Reusable components
├── public/               # Static files (images, etc.)
└── package.json
```

## Creating Components

### What is a Component?

A component is a reusable piece of UI (like a button, card, or header).

### Step 1: Create a Component File

Create a new file in the `components` folder:

```bash
components/Button.js
```

### Step 2: Write the Component

```jsx
// components/Button.js
export default function Button({ text, onClick }) {
	return (
		<button
			onClick={onClick}
			className='px-4 py-2 bg-blue-500 text-white rounded'
		>
			{text}
		</button>
	);
}
```

### Step 3: Use the Component

```jsx
// app/page.js
import Button from "@/components/Button";

export default function Home() {
	const handleClick = () => {
		alert("Button clicked!");
	};

	return (
		<div>
			<h1>Welcome</h1>
			<Button text='Click Me' onClick={handleClick} />
		</div>
	);
}
```

## Creating Routes

### File-based Routing

In Next.js, folders and files in the `app` directory become routes automatically.

### Example 1: Simple Page

Create a new page at `/about`:

```bash
app/about/page.js
```

```jsx
// app/about/page.js
export default function About() {
	return (
		<div>
			<h1>About Us</h1>
			<p>This is the about page.</p>
		</div>
	);
}
```

Visit: `http://localhost:3000/about`

### Example 2: Nested Route

Create a page at `/blog/first-post`:

```bash
app/blog/first-post/page.js
```

```jsx
// app/blog/first-post/page.js
export default function FirstPost() {
	return <h1>My First Post</h1>;
}
```

### Example 3: Dynamic Route

Create a dynamic route for blog posts with IDs:

```bash
app/blog/[id]/page.js
```

```jsx
// app/blog/[id]/page.js
export default function BlogPost({ params }) {
	return <h1>Blog Post ID: {params.id}</h1>;
}
```

Visit: `http://localhost:3000/blog/123` (shows "Blog Post ID: 123")

### Linking Between Pages

```jsx
import Link from "next/link";

export default function Navigation() {
	return (
		<nav>
			<Link href='/'>Home</Link>
			<Link href='/about'>About</Link>
			<Link href='/blog/123'>Blog Post</Link>
		</nav>
	);
}
```

## Sharing Data Between Components

### Method 1: Props (Parent to Child)

```jsx
// Parent Component
export default function Parent() {
	const username = "John";

	return <Child name={username} />;
}

// Child Component
function Child({ name }) {
	return <p>Hello, {name}!</p>;
}
```

### Method 2: Lifting State Up (Child to Parent)

```jsx
"use client"; // Required for useState
import { useState } from "react";

export default function Parent() {
	const [count, setCount] = useState(0);

	return (
		<div>
			<p>Count: {count}</p>
			<Child onIncrement={() => setCount(count + 1)} />
		</div>
	);
}

function Child({ onIncrement }) {
	return <button onClick={onIncrement}>Increase</button>;
}
```

### Method 3: Context (Multiple Components)

```jsx
// app/context/UserContext.js
"use client";
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
	const [user, setUser] = useState({ name: "Guest" });

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	return useContext(UserContext);
}
```

```jsx
// app/layout.js
import { UserProvider } from "./context/UserContext";

export default function RootLayout({ children }) {
	return (
		<html>
			<body>
				<UserProvider>{children}</UserProvider>
			</body>
		</html>
	);
}
```

```jsx
// Any component
"use client";
import { useUser } from "@/app/context/UserContext";

export default function Profile() {
	const { user, setUser } = useUser();

	return (
		<div>
			<p>User: {user.name}</p>
			<button onClick={() => setUser({ name: "John" })}>
				Change Name
			</button>
		</div>
	);
}
```

## Common Patterns

### Client vs Server Components

- **Server Components** (default): Can't use hooks like `useState`. Better for performance.
- **Client Components**: Add `'use client'` at the top. Can use hooks and interactivity.

```jsx
// Server Component (default)
export default function ServerComponent() {
    return <div>I run on the server</div>;
}

// Client Component
'use client';
import { useState } from 'react';

export default function ClientComponent() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Fetching Data

```jsx
// Server Component
async function getPosts() {
	const res = await fetch("https://api.example.com/posts");
	return res.json();
}

export default async function Posts() {
	const posts = await getPosts();

	return (
		<ul>
			{posts.map((post) => (
				<li key={post.id}>{post.title}</li>
			))}
		</ul>
	);
}
```

### Loading States

```jsx
// app/posts/loading.js
export default function Loading() {
	return <p>Loading posts...</p>;
}
```

## Quick Checklist

- ✅ Create components in `components/` folder
- ✅ Create routes by adding `page.js` files in `app/` folder
- ✅ Use props to pass data from parent to child
- ✅ Use Context for global state
- ✅ Add `'use client'` when using hooks like `useState`
- ✅ Use `<Link>` for navigation between pages

## Running Your Project

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

**Need help?** Check the [Next.js documentation](https://nextjs.org/docs) or ask your team lead.
