import { useState } from 'react'
import { GameNormalized } from '#shared/types/game_normalized'
import { useTranslation } from 'react-i18next'
import { Container } from '~/features/utils/components/container'
import { ProfileCard } from '~/features/home/components/profile_card'
import { Button } from '~/features/utils/components/button'
import { router } from '@inertiajs/react'

interface ProfileProps {
  user: {
    username: string
    avatarUrl: string
    elo: number
  }
  games: GameNormalized[]
}

export default function Profile(props: ProfileProps) {
  const { user, games: gamesList } = props
  const [openedGame, setOpenedGame] = useState<string | null>(null)
  const { t } = useTranslation()

  gamesList.sort((a, b) => {
    return a.date > b.date ? -1 : 1
  })

  const onGameClick = (id: string) => {
    if (openedGame === id) {
      setOpenedGame(null)
    } else {
      setOpenedGame(id)
    }
  }

  const roleHint = (role: string, gameRole: string) => {
    if (role === gameRole) {
      return `(${t('global.you')})`
    }
    return ''
  }

  return (
    <Container justify={'center'} align={'center'} gap={4} className={'text-center'}>
      <Button onClick={() => router.visit('/game')}>{t('profile.buttons.home')}</Button>
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
            <div key={game.id}>
              <div
                className="grid grid-cols-[5fr_5fr_2fr] py-2 w-full cursor-pointer"
                onClick={() => onGameClick(game.id)}
              >
                <p>{game.date}</p>
                <p>{game.word}</p>
                <p className="text-center">{game.guessed ? '✅' : '❌'}</p>
              </div>
              <div>
                {openedGame === game.id && (
                  <div className="bg-gray-200 py-2 w-full">
                    <p>
                      {t('profile.game.opponent')}: {game.opponent}
                    </p>
                    <div>
                      <p>{t('profile.game.wordsList')}</p>
                      <div className={'grid grid-cols-2'}>
                        <div>
                          <p className={'font-bold'}>
                            {t('global.hintGiver')} {roleHint('hintGiver', game.role)}
                          </p>
                          {game.wordsList.hintGiver.map((word, index) => (
                            <p key={`${game.id}-hintGiver-${index}`}>{word}</p>
                          ))}
                        </div>
                        <div>
                          <p className={'font-bold'}>
                            {t('global.guesser')} {roleHint('guesser', game.role)}
                          </p>
                          {game.wordsList.guesser.map((word, index) => (
                            <p key={`${game.id}-guesser-${index}`}>{word}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
