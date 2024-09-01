import { Head, router } from '@inertiajs/react'
import { Trans, useTranslation } from 'react-i18next'
import { Chat } from '~/features/chat/chat'
import React from 'react'
import { Button } from '~/features/utils/components/button'
import { Container } from '~/features/utils/components/container'

export interface HomeProps {
  avatarUrl: string
  elo: number
}

export default function Home(props: HomeProps) {
  const { avatarUrl, elo } = props
  const [openChat, setOpenChat] = React.useState(false)
  const { t } = useTranslation()

  return (
    <Container justify={'center'} align={'center'} className={'w-screen'}>
      <Head title="Home" />

      <Container align={'center'} justify={'center'} direction={'col'} gap={4}>
        <div
          className={
            'absolute bottom-0 right-0 m-0 md:m-3 max-w-screen md:max-w-[400px] w-full gap-2 flex flex-col justify-end items-end'
          }
        >
          <Button className={`${openChat ? 'hidden' : ''}`} onClick={() => setOpenChat(true)}>
            💬
          </Button>
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
        <Button onClick={() => router.visit('/game/search')}>{t('home.buttons.start')}</Button>
        <Container
          justify={'center'}
          direction={'col'}
          gap={4}
          className={'bg-gray-100 p-4 rounded-md'}
        >
          <Container justify={'center'} direction={'col'} gap={4} className={'md:flex-row'}>
            <img
              src={avatarUrl}
              alt={'avatar'}
              className={'w-20 h-20 rounded-full border-solid border-4 border-gray-200'}
            />
            <p className={'text-center bg-gray-200 px-3 py-2 rounded-md w-50'}>
              {t('home.points')}
              <span className={'block font-bold'}>{elo}</span>
            </p>
          </Container>
          <Button onClick={() => router.visit('/profile')}>{t('home.buttons.profile')}</Button>
        </Container>
      </Container>
    </Container>
  )
}
