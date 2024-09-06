import { useTranslation } from 'react-i18next'
import { useGame } from '~/features/game/use_game'
import type { GameSessionId, WordList } from '#features/game_session/types/game_session'
import type User from '#models/user'
import type { GameResponseStatus } from '~/features/game/types/game_response_status'
import { router } from '@inertiajs/react'
import { SessionState } from '#features/game_session/enums/session_state'
import { WordsList } from '~/features/game/components/words_list'
import { TurnStatus } from '~/features/game/components/turn_status'
import { OpponentInfo } from '~/features/game/components/opponent_info'
import { GameStatus } from '~/features/game/components/game_status'
import { PlayerInfo } from '~/features/game/components/player_info'
import { GameSessionTitle } from '~/features/game/components/game_session_title'
import { WordForm } from '~/features/game/components/word_form'
import type { Role } from '#shared/types/roles'

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

export interface SessionListenerMessage {
  turn: boolean
  word: string | null
  wordsList?: string
  opponent?: string
  status?: GameResponseStatus
  sessionState: SessionState
}

export default function GameSession(props: GameSessionProps) {
  const { user, role } = props
  const {
    sessionListener,
    guesserWords,
    hintGiverWords,
    gameState,
    handleSubmit,
    handleGameState,
    handleCopySessionId,
    wordState,
    opponent,
    wordOnChange,
    wordToGuess,
    turnState,
    timer,
    isActive,
    isGameOver,
  } = useGame(props)

  sessionListener.subscription?.create()
  sessionListener.subscription?.onMessage(handleGameState)

  const { t } = useTranslation()

  return (
    <div>
      <GameSessionTitle handleCopySessionId={handleCopySessionId} />
      <PlayerInfo user={user} />
      <GameStatus gameState={gameState} wordToGuess={wordToGuess} />
      <OpponentInfo opponent={opponent} isGameOver={isGameOver} />
      <TurnStatus turnState={turnState} isGameOver={isGameOver} />
      <p>{timer}</p>
      <div className="grid grid-cols-2 gap-4">
        <WordsList title={'Hint Words'} words={hintGiverWords} />
        <WordsList title={'Guesser Words'} words={guesserWords} />
        <WordForm
          role={role}
          wordOnChange={wordOnChange}
          handleSubmit={handleSubmit}
          wordState={wordState}
          timerIsActive={isActive}
        />
      </div>
      {isGameOver && (
        <button onClick={() => router.visit('/game')}>{t('gameSession.buttons.backToMenu')}</button>
      )}
    </div>
  )
}
