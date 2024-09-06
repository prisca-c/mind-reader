import { Container } from '~/features/utils/components/container'
import { Button } from '~/features/utils/components/button'
import { router } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'

export interface Props {
  username: string
  avatarUrl: string
  elo: number
  profileButton?: boolean
}

export const ProfileCard = (props: Props) => {
  const { username, avatarUrl, elo, profileButton = false } = props

  const { t } = useTranslation()

  return (
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
        <Container justify={'center'} direction={'col'} gap={2}>
          <p
            className={
              'text-center bg-gray-200 px-3 py-1rounded-md w-50 rounded-md font-bold truncate'
            }
          >
            {username}
          </p>
          <p className={'text-center bg-gray-200 px-3 py-1 rounded-md w-50'}>
            {t('home.points')}
            <span className={'block font-bold'}>{elo}</span>
          </p>
        </Container>
      </Container>
      {profileButton && (
        <Button onClick={() => router.visit('/profile')}>{t('home.buttons.profile')}</Button>
      )}
    </Container>
  )
}
