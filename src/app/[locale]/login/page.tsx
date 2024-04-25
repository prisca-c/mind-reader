import { LoginAndOut } from '~/app/[locale]/login/components/login_and_out';
import { useTranslations } from 'next-intl';

export default function LoginPage({ params }: { params: { locale: string } }) {
	const t = useTranslations('login');
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary to-secondary text-white">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
				<h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow sm:text-[5rem]">
					Login to <span className={'text-primary'}>Mind</span> Reader
				</h1>
				<LoginAndOut
					locale={params.locale}
					signInLabel={t('signin', { provider: 'twitch' })}
					signOutLabel={t('signout')}
				/>
			</div>
		</main>
	);
}
