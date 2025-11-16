import { ThemeProvider } from "./contexts/theme_context";
import "./globals.css";

export const metadata = {
	title: "Community Reports",
	description: "Report and track community issues",
};

export default function RootLayout({ children }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<link
					rel='stylesheet'
					href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
				/>
			</head>
			<body className='antialiased'>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
