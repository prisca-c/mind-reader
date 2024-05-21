import React, { useEffect, useState } from 'react'
import { GameStatus, GameStatusEnum } from '#features/game_session/enums/game_status'
import { useTransmit } from '~/hooks/use_transmit'
import type { GameSessionProps } from '~/pages/game_session'
import { Api } from '~/services/api'

type Props = GameSessionProps
export const useGame = (props: Props) => {
  const { sessionId, user, wordsList, turn } = props

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

  return {
    hintGiverWords,
    guesserWords,
    gameState,
    sessionListener,
    setGameState,
    setGuesserWords,
    setHintGiverWords,
    handleSubmit,
  }
}
