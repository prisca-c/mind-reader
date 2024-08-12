import type { GameSessionId, WordList } from '#features/game_session/types/game_session'
import type User from '#models/user'
import { GameState } from '#features/game_session/enums/game_state'
import { router } from '@inertiajs/react'
import { useGame } from '~/features/game/use_game'
import type { GameResponseStatus } from '~/features/game/types/game_response_status'
import { useTranslation } from 'react-i18next'

export interface GameSessionProps {
  sessionId: GameSessionId
  user: User
  role: 'hintGiver' | 'guesser'
  word?: string
  wordsList?: WordList
  turn: boolean | null
}

export default function GameSession(props: GameSessionProps) {
  const { user, word, role } = props
  const { t } = useTranslation()
  const {
    sessionListener,
    guesserWords,
    hintGiverWords,
    gameState,
    handleSubmit,
    handleGameState,
    handleCopySessionId,
  } = useGame(props)

  sessionListener.subscription?.create()

  sessionListener.subscription?.onMessage(
    (message: { turn: boolean; wordsList: string; status?: GameResponseStatus }) => {
      const words = JSON.parse(message.wordsList) as WordList

      handleGameState({ words: words, status: message.status, turn: message.turn })
    }
  )

  return (
    <div>
      <h1 className="flex align-middle">
        {t('gameSession.title')}{' '}
        <img
          src="/images/copy.svg"
          onClick={handleCopySessionId}
          alt={'Copy icon'}
          className="cursor-pointer h-4 w-auto my-auto"
        />
      </h1>
      <p>
        {t('gameSession.player')}: {user.username}
      </p>
      {word && (
        <p className={gameState === 'win' ? 'text-green-500' : 'text-red-500'}>Word: {word}</p>
      )}
      {gameState === 'win' && <p className={'text-green-500'}>'(GG)'</p>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2>{t('gameSession.hint')}</h2>
          <ul>
            {hintGiverWords.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>{t('gameSession.guess')}</h2>
          <ul>
            {guesserWords.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="answer" required />
          <button>{t(`gameSession.buttons.submit.${role}`)}</button>
        </form>
      </div>
      {gameState === GameState.WIN || gameState === GameState.LOSE ? (
        <button onClick={() => router.visit('/game')}>{t('gameSession.buttons.backToMenu')}</button>
      ) : null}
    </div>
  )
}
