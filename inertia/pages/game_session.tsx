import type { GameSessionId, WordList } from '#features/game_session/types/game_session'
import type User from '#models/user'
import { GameState } from '#features/game_session/enums/game_state'
import { router } from '@inertiajs/react'
import { useGame } from '~/features/game/use_game'
import type { GameResponseStatus } from '~/features/game/types/game_response_status'
import { useTranslation } from 'react-i18next'
import { WordForm } from '~/features/game/word_form'
import { Role } from '~/enums/roles'
import { SessionState } from '#features/game_session/enums/session_state'

export interface GameSessionProps {
  sessionId: GameSessionId
  user: User
  role: Role
  word?: string
  wordsList?: WordList
  turn: boolean | null
  sessionState: SessionState
  sessionDate: string
  gameLength: number
}

export default function GameSession(props: GameSessionProps) {
  const { user, role } = props
  const { t } = useTranslation()
  const {
    sessionListener,
    guesserWords,
    hintGiverWords,
    gameState,
    handleSubmit,
    handleGameState,
    handleCopySessionId,
    wordState,
    wordOnChange,
    wordToGuess,
    timer,
    isActive,
  } = useGame(props)

  sessionListener.subscription?.create()

  sessionListener.subscription?.onMessage(
    (message: {
      turn: boolean
      word: string | null
      wordsList?: string
      status?: GameResponseStatus
      sessionState: SessionState
    }) => {
      handleGameState(message)
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
      {wordToGuess && (
        <p className={gameState === GameState.WIN ? 'text-green-500' : 'text-red-500'}>
          Word: {wordToGuess}
        </p>
      )}
      <p>{timer}</p>
      {gameState === GameState.WIN && <p className={'text-green-500'}>'(GG)'</p>}
      {gameState === GameState.LOSE && <p className={'text-red-500'}>'(Bouh)'</p>}
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
        <WordForm
          role={role}
          wordOnChange={wordOnChange}
          handleSubmit={handleSubmit}
          wordState={wordState}
          timerIsActive={isActive}
        />
      </div>
      {gameState === GameState.WIN || gameState === GameState.LOSE ? (
        <button onClick={() => router.visit('/game')}>{t('gameSession.buttons.backToMenu')}</button>
      ) : null}
    </div>
  )
}
