import Link from 'next/link';

export default function HomePage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary to-secondary text-white">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
				<h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow sm:text-[5rem]">
					<span className={'text-primary'}>Mind</span> Reader
				</h1>
				<p className="text-center text-lg">
					Play a game of mind reading with people around the world,
					<br />
					grind to the top of the leaderboard and become the ultimate mind reader.
				</p>
				<button className="btn">
					<Link href="login">Start Mind Reading</Link>
				</button>
			</div>
		</main>
	);
}
