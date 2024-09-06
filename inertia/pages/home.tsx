import { Head, router } from '@inertiajs/react'
import { Trans, useTranslation } from 'react-i18next'
import { Chat } from '~/features/chat/chat'
import React from 'react'
import { Button } from '~/features/utils/components/button'
import { Container } from '~/features/utils/components/container'
import { ProfileCard } from '~/features/home/components/profile_card'

export interface HomeProps {
  username: string
  avatarUrl: string
  elo: number
}

export default function Home(props: HomeProps) {
  const { username, avatarUrl, elo } = props
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
        <ProfileCard username={username} avatarUrl={avatarUrl} elo={elo} profileButton />
      </Container>
    </Container>
  )
}
