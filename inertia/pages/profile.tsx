import { router } from '@inertiajs/react'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { ProfileCard } from '~/features/home/components/profile_card'
import { GamesTable } from '~/features/profile/components/games_table'
import { Button } from '~/features/utils/components/button'
import { Container } from '~/features/utils/components/container'
import type { GameNormalized } from '#shared/types/game_normalized'

interface ProfileProps {
  user: {
    username: string
    avatarUrl: string
    elo: number
  }
  games: GameNormalized[]
}

export default function Profile(props: ProfileProps) {
  const { user, games } = props
  const { t } = useTranslation()

  const sortedGames = games
    .sort((a, b) => {
      return (
        DateTime.fromFormat(a.date, 'dd/MM/yyyy HH:mm:ss').toMillis() -
        DateTime.fromFormat(b.date, 'dd/MM/yyyy HH:mm:ss').toMillis()
      )
    })
    .reverse()

  return (
    <Container
      justify={'center'}
      align={'center'}
      gap={4}
      className={'text-center'}
    >
      <Button onClick={() => router.visit('/game')}>
        {t('profile.buttons.home')}
      </Button>
      <h1>{t('profile.title')}</h1>
      <ProfileCard
        username={user.username}
        avatarUrl={user.avatarUrl}
        elo={user.elo}
      />
      <h2>{t('profile.gameHistory')}</h2>
      <GamesTable games={sortedGames} />
    </Container>
  )
}
