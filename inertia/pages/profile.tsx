import type User from '#models/user'
import { GameNormalized } from '#shared/types/game_normalized'
import { useTranslation } from 'react-i18next'
import { Container } from '~/features/utils/components/container'
import { ProfileCard } from '~/features/home/components/profile_card'

interface ProfileProps {
  user: User
  games: GameNormalized[]
}

export default function Profile(props: ProfileProps) {
  const { user, games: gamesList } = props
  const { t } = useTranslation()

  gamesList.sort((a, b) => {
    return a.date > b.date ? -1 : 1
  })

  return (
    <Container justify={'center'} align={'center'} gap={4} className={'text-center'}>
      <h1>{t('profile.title')}</h1>
      <ProfileCard username={user.username} avatarUrl={user.avatarUrl!} elo={user.elo} />
      <h2>{t('profile.gameHistory')}</h2>
      <div className="text-center border-solid border-2 border-gray-300 rounded-lg w-xs md:w-xl">
        <div className="grid grid-cols-[5fr_5fr_2fr] font-bold shadow-md py-2 w-full">
          <div>{t('profile.game.date')}</div>
          <div>{t('profile.game.word')}</div>
          <div></div>
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {gamesList.map((game) => (
            <div key={game.id} className="grid grid-cols-[5fr_5fr_2fr] py-2 w-full">
              <p>{game.date}</p>
              <p>{game.word}</p>
              <p className="text-center">{game.guessed ? '✅' : '❌'}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
