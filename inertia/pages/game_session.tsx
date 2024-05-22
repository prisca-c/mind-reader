import type { GameSessionId, WordList } from '#features/game_session/types/game_session'
import type User from '#models/user'
import { GameStatus } from '#features/game_session/enums/game_status'
import { router } from '@inertiajs/react'
import { useGame } from '~/features/game/use_game'
import type { GameResponseStatus } from '~/features/game/types/game_response_status'

export interface GameSessionProps {
  sessionId: GameSessionId
  user: User
  word?: string
  wordsList?: WordList
  turn: boolean | null
}

export default function GameSession(props: GameSessionProps) {
  const { sessionId, user, word } = props

  const {
    sessionListener,
    guesserWords,
    hintGiverWords,
    gameState,
    handleSubmit,
    handleGameState,
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
      <h1>Game Session {sessionId}</h1>
      <p>Player: {user.username}</p>
      {word && (
        <p className={gameState === 'win' ? 'text-green-500' : 'text-red-500'}>Word: {word}</p>
      )}
      {gameState === 'win' && <p className={'text-green-500'}>'(GG)'</p>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2>Hint Giver</h2>
          <ul>
            {hintGiverWords.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Guesser</h2>
          <ul>
            {guesserWords.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="answer" required />
          <button>Submit</button>
        </form>
      </div>
      {gameState === GameStatus.WIN || gameState === GameStatus.LOSE ? (
        <button onClick={() => router.visit('/game')}>Back to menu</button>
      ) : null}
    </div>
  )
}
