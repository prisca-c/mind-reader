import React, { useEffect, useState } from 'react'
import { GameState, GameStateEnum } from '#features/game_session/enums/game_state'
import { useTransmit } from '~/hooks/use_transmit'
import type { GameSessionProps } from '~/pages/game_session'
import { Api } from '~/services/api'
import type { WordList } from '#features/game_session/types/game_session'
import type { GameResponseStatus } from '~/features/game/types/game_response_status'

type Props = GameSessionProps
export const useGame = (props: Props) => {
  const { sessionId, user, wordsList, turn } = props

  const [hintGiverWords, setHintGiverWords] = useState<string[]>([])
  const [guesserWords, setGuesserWords] = useState<string[]>([])
  const [gameState, setGameState] = useState<GameStateEnum>(GameState.WAITING)

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const answer = formData.get('answer') as string

    if (
      gameState === GameState.WAITING ||
      gameState === GameState.WIN ||
      gameState === GameState.LOSE
    ) {
      return
    }

    await new Api().post(`/game/session/${sessionId}/answer`, { answer })
    form.reset()
  }

  const handleGameState = (message: {
    words: WordList
    status?: GameResponseStatus
    turn: boolean
  }) => {
    if (message.words) {
      setHintGiverWords(message.words.hintGiver)
      setGuesserWords(message.words.guesser)
    }

    if (message.status === GameState.WIN) {
      setGameState(GameState.WIN)
    } else if (message.status === GameState.LOSE) {
      setGameState(GameState.LOSE)
    } else if (message.turn) {
      setGameState(GameState.PLAYING)
    } else {
      setGameState(GameState.WAITING)
    }
  }

  const handleCopySessionId = () => {
    navigator.clipboard.writeText(sessionId).then(() => alert('Session ID copied'))
  }

  return {
    hintGiverWords,
    guesserWords,
    gameState,
    sessionListener,
    setGameState,
    setGuesserWords,
    setHintGiverWords,
    handleSubmit,
    handleGameState,
    handleCopySessionId,
  }
}
