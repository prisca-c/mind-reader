import type { GameSessionId, WordList } from '#features/game_session/types/game_session'
import type User from '#models/user'
import { GameStatus } from '#features/game_session/enums/game_status'
import { router } from '@inertiajs/react'
import { useGame } from '~/features/game/use_game'

export interface GameSessionProps {
  sessionId: GameSessionId
  user: User
  word?: string
  wordsList?: WordList
  turn?: boolean
}

export default function GameSession(props: GameSessionProps) {
  const { sessionId, user, word } = props

  const {
    sessionListener,
    guesserWords,
    hintGiverWords,
    gameState,
    setGameState,
    setGuesserWords,
    setHintGiverWords,
    handleSubmit,
  } = useGame(props)

  sessionListener.subscription?.create()

  sessionListener.subscription?.onMessage(
    (message: { turn: boolean; wordsList: string; status?: 'success' | 'error' | 'win' }) => {
      const words = JSON.parse(message.wordsList) as WordList

      if (message.status && message.status === 'win') {
        setGameState(GameStatus.WIN)
        return
      }

      if (message.turn && words) {
        setHintGiverWords(words.hintGiver)
        setGuesserWords(words.guesser)
        setGameState(GameStatus.PLAYING)
        return
      }

      if (!message.turn && words) {
        setHintGiverWords(words.hintGiver)
        setGuesserWords(words.guesser)
        setGameState(GameStatus.WAITING)
        return
      }
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
