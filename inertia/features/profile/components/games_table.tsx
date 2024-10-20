import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GamesTableItem } from '~/features/profile/components/games_table_item'
import type { GameNormalized } from '#shared/types/game_normalized'

interface GamesTableProps {
  games: GameNormalized[]
}

export const GamesTable = (props: GamesTableProps) => {
  const { games } = props

  const [openedGame, setOpenedGame] = useState<string | null>(null)

  const { t } = useTranslation()

  const onGameClick = (id: string) => {
    if (openedGame === id) {
      setOpenedGame(null)
    } else {
      setOpenedGame(id)
    }
  }

  return (
    <div className='text-center border-solid border-2 border-gray-300 rounded-lg w-xs md:w-xl'>
      <div className='grid grid-cols-[5fr_5fr_2fr] font-bold shadow-md py-2 w-full'>
        <div>{t('profile.game.date')}</div>
        <div>{t('profile.game.word')}</div>
        <div></div>
      </div>
      <div className='max-h-96 overflow-y-auto p-2'>
        {games.map((game) => (
          <GamesTableItem
            game={game}
            onGameClick={onGameClick}
            openedGame={openedGame}
            key={game.id}
          />
        ))}
      </div>
    </div>
  )
}
