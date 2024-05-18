import type { GameSessionId, WordList } from '#types/game_session'
import { useTransmit } from '~/hooks/use_transmit'
import type User from '#models/user'
import React, { useEffect, useState } from 'react'
import { Api } from '~/services/api'
import { GameStatus, type GameStatusEnum } from '#enums/game_status'
import { router } from '@inertiajs/react'

interface GameSessionProps {
  sessionId: GameSessionId
  user: User
  word?: string
  wordsList?: WordList
  turn?: boolean
}

export default function GameSession(props: GameSessionProps) {
  const { sessionId, user, word, wordsList, turn } = props
  const [hintGiverWords, setHintGiverWords] = useState<string[]>([])
  const [guesserWords, setGuesserWords] = useState<string[]>([])
  const [gameState, setGameState] = useState<GameStatusEnum>(GameStatus.WAITING)

  const sessionListener = useTransmit({ url: `game/session/${sessionId}/user/${user.id}` })

  useEffect(() => {
    if (turn) {
      setGameState('playing')
    }

    if (!turn) {
      setGameState('waiting')
    }

    if (wordsList) {
      setHintGiverWords(wordsList.hintGiver)
      setGuesserWords(wordsList.guesser)
    }
  }, [])

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const answer = formData.get('answer') as string

    if (
      gameState === GameStatus.WAITING ||
      gameState === GameStatus.WIN ||
      gameState === GameStatus.LOSE
    ) {
      return
    }

    await new Api().post(`/game/session/${sessionId}/answer`, { answer })
    form.reset()
  }

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
