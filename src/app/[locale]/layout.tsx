import '~/styles/globals.css';

import { Inter } from 'next/font/google';
import NextAuthProvider from '~/app/[locale]/next_auth_provider';
import type React from 'react';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const metadata = {
	title: 'Mind Reader',
	description: "Guess the word I'm thinking of",
	icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	return (
		<html lang={locale}>
			<body className={`font-sans ${inter.variable}`}>
				<main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary to-secondary text-white">
					<NextAuthProvider>{children}</NextAuthProvider>
				</main>
			</body>
		</html>
	);
}
