import { ThemeProvider } from "./contexts/theme_context";
import { AuthProvider } from "./contexts/auth_context";
import "./globals.css";

export const metadata = {
	title: "TownSpark - Report & Resolve Community Issues",
	description:
		"A civic engagement platform for reporting, tracking, and resolving local community issues together.",
};

export default function RootLayout({ children }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<link
					rel='stylesheet'
					href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
				/>
				<link
					rel='stylesheet'
					href='https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap'
				/>
			</head>
			<body className='antialiased font-sans'>
				<ThemeProvider>
					<AuthProvider>{children}</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
