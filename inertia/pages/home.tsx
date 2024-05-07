import { Head, router } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()
  return (
    <div className={'flex justify-center items-center h-screen w-screen'}>
      <Head title="Homepage" />

      <div>
        <h1 className={'text-4xl font-bold'}>{t('home.title')}</h1>
        <p className={'text-lg'}>{t('home.description')}</p>
        <button
          className={'border-2 border-gray-500 hover:bg-gray-500 hover:text-white p-2 rounded-md'}
          onClick={() => router.visit('/login')}
        >
          {t('home.buttons.login')}
        </button>
      </div>
    </div>
  )
}
