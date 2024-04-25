'use client';
import { signIn, signOut, useSession } from 'next-auth/react';

interface LoginAndOutProps {
	locale: string;
}

export const LoginAndOut = (props: LoginAndOutProps) => {
	const { data: session } = useSession();
	const { locale } = props;

	const onSignIn = async () => {
		return await signIn('twitch', { callbackUrl: `/${locale}/game` });
	};

	const onSignOut = async () => {
		return await signOut({ callbackUrl: '/' });
	};

	const signInButton = (
		<button className="btn" onClick={onSignIn}>
			Login with Twitch
		</button>
	);

	const signOutButton = (
		<button className="btn" onClick={onSignOut}>
			Logout
		</button>
	);

	console.log({ session });

	return <> {session ? signOutButton : signInButton} </>;
};
