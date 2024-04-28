import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Stats } from '~/app/[locale]/game/components/stats';
import { unstable_setRequestLocale } from 'next-intl/server';

export default function GamePage({ params: { locale } }: { params: { locale: string } }) {
	unstable_setRequestLocale(locale);

	const t = useTranslations('game');

	const infosLabels = {
		status: t('infos.status'),
		connected: t('infos.connected'),
		disconnected: t('infos.disconnected'),
		users: t('infos.users'),
	};

	return (
		<>
			<div className="w-fully absolute left-0 top-0 m-2 rounded-sm bg-black bg-opacity-35 p-2 text-white">
				<Stats infosLabels={infosLabels} />
			</div>
			<div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
				<h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow sm:text-[5rem]">
					{t.rich('h1', {
						span: (chunks) => <span className={'text-primary'}>{chunks}</span>,
					})}
				</h1>
				<button className="btn">
					<Link href={`/${locale}/game/training`}>{t('training-button')}</Link>
				</button>
			</div>
		</>
	);
}
