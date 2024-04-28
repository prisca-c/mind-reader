'use client';
import { signIn, signOut, useSession } from 'next-auth/react';

interface LoginAndOutProps {
	locale: string;
	signInLabel: string;
	signOutLabel: string;
}

export const LoginAndOut = (props: LoginAndOutProps) => {
	const { data: session } = useSession();
	const { locale, signInLabel, signOutLabel } = props;

	const onSignIn = async () => {
		return await signIn('twitch', { callbackUrl: `/${locale}/game` });
	};

	const onSignOut = async () => {
		return await signOut({ callbackUrl: '/' });
	};

	const signInButton = (
		<button className="btn" onClick={onSignIn}>
			{signInLabel}
		</button>
	);

	const signOutButton = (
		<button className="btn" onClick={onSignOut}>
			{signOutLabel}
		</button>
	);

	return <> {session ? signOutButton : signInButton} </>;
};
