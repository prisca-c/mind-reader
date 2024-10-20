import { Head } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'

export default function LoginPage() {
  const { t } = useTranslation()
  return (
    <div className={'flex justify-center items-center w-screen'}>
      <Head title='Login' />

      <div>
        <h1 className={'text-4xl font-bold'}>{t('login.title')}</h1>
        <p className={'text-lg'}>{t('login.description')}</p>
        <a href={'/auth/twitch/redirect'}>
          <button
            type='button'
            className={
              'border-2 border-gray-500 hover:bg-gray-500 hover:text-white p-2 rounded-md'
            }
          >
            {t('login.buttons.twitch')}
          </button>
        </a>
      </div>
    </div>
  )
}
