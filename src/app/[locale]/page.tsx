import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function HomePage({ params }: { params: { locale: string } }) {
	const t = useTranslations('home');
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary to-secondary text-white">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
				<h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow sm:text-[5rem]">
					<span className={'text-primary'}>Mind</span> Reader
				</h1>
				<p className="text-center text-lg">{t('description')}</p>
				<button className="btn">
					<Link href={`/${params.locale}/login`}>Start Mind Reading</Link>
				</button>
			</div>
		</main>
	);
}
