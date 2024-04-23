'use client';
import { signIn, signOut, useSession } from 'next-auth/react';

export const LoginAndOut = () => {
	const { data: session } = useSession();
	const onSignIn = async () => {
		return await signIn('twitch');
	};

	const onSignOut = async () => {
		return await signOut();
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
