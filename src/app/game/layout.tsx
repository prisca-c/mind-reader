import NextAuthProvider from '~/app/next_auth_provider';
import { Inter } from 'next/font/google';
import { getServerAuthSession } from '~/server/auth';
import { redirect } from 'next/navigation';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const metadata = {
	title: 'Mind Reader',
	description: "Guess the word I'm thinking of",
	icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default async function GameLayout({ children }: { children: React.ReactNode }) {
	const session = await getServerAuthSession();

	if (!session) {
		return redirect('/login');
	}

	return (
		<html lang="en">
			<body className={`font-sans ${inter.variable}`}>
				<NextAuthProvider>{children}</NextAuthProvider>
			</body>
		</html>
	);
}
