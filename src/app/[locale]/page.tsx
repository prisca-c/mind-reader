import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function HomePage({ params }: { params: { locale: string } }) {
	const t = useTranslations('home');
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary to-secondary text-white">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
				<h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow sm:text-[5rem]">
					{t.rich('h1', {
						span: (chunks) => <span className={'text-primary'}>{chunks}</span>,
					})}
				</h1>
				<p className="text-center text-lg">
					{t.rich('description', {
						second: (chunks) => <span className={'block'}>{chunks}</span>,
					})}
				</p>
				<button className="btn">
					<Link href={`/${params.locale}/login`}>{t('start-button')}</Link>
				</button>
			</div>
		</main>
	);
}
