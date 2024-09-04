import { GameNormalized } from '#shared/types/game_normalized'
import { WordsList } from '~/features/profile/components/words_list'
import { useTranslation } from 'react-i18next'

interface GamesTableItemProps {
  game: GameNormalized
  onGameClick: (str: string) => void
  openedGame: string | null
}

export const GamesTableItem = (props: GamesTableItemProps) => {
  const { game, onGameClick, openedGame } = props
  const { t } = useTranslation()

  return (
    <div>
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
            <WordsList game={game} />
          </div>
        )}
      </div>
    </div>
  )
}
