import { Head, router } from '@inertiajs/react'
import { Trans, useTranslation } from 'react-i18next'
import { Chat } from '~/features/chat/chat'
import React from 'react'

export default function Home() {
  const [openChat, setOpenChat] = React.useState(false)
  const { t } = useTranslation()
  return (
    <div className={'flex justify-center items-center w-screen'}>
      <Head title="Home" />

      <div>
        <div
          className={
            'absolute bottom-0 right-0 m-0 md:m-3 max-w-screen md:max-w-[400px] w-full gap-2 flex flex-col justify-end items-end'
          }
        >
          <button
            className={`border-2 border-gray-500 bg-gray-500 m-3 md:m-0 hover:text-white p-2 rounded-md w-fit ${openChat ? 'hidden' : ''}`}
            onClick={() => setOpenChat(true)}
          >
            💬
          </button>
          <Chat isOpen={openChat} setOpenChat={setOpenChat} />
        </div>
        <h1 className={'text-4xl font-bold'}>{t('home.title')}</h1>
        <p className={'text-lg'}>
          <Trans
            i18nKey="home.description"
            components={{ span: <span className={'font-bold block'}></span> }}
          >
            {t('home.description')}
          </Trans>
        </p>
        <button
          className={'border-2 border-gray-500 hover:bg-gray-500 hover:text-white p-2 rounded-md'}
          onClick={() => router.visit('/game/search')}
        >
          {t('home.buttons.start')}
        </button>
      </div>
    </div>
  )
}
