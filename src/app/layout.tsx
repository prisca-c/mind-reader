import '~/styles/globals.css';

import { Inter } from 'next/font/google';
import NextAuthProvider from '~/app/next_auth_provider';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const metadata = {
	title: 'Mind Reader',
	description: "Guess the word I'm thinking of",
	icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={`font-sans ${inter.variable}`}>
				<NextAuthProvider>{children}</NextAuthProvider>
			</body>
		</html>
	);
}
