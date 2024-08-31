import { GameState, GameStateEnum } from '#features/game_session/enums/game_state'
import { SessionState } from '#features/game_session/enums/session_state'
import { useTranslation } from 'react-i18next'

export const GameStatus = ({
  gameState,
  wordToGuess,
}: {
  gameState: GameStateEnum | SessionState
  wordToGuess: string | null
}) => {
  const { t } = useTranslation()
  const gameStateClass = gameState === GameState.WIN ? 'text-green-500' : 'text-red-500'
  return (
    <>
      {wordToGuess && <p className={gameStateClass}>Word: {wordToGuess}</p>}
      {gameState === GameState.WIN && (
        <p className="text-green-500">{t('gameSession.gameState.win')}</p>
      )}
      {gameState === GameState.LOSE && (
        <p className="text-red-500">{t('gameSession.gameState.lose')}</p>
      )}
    </>
  )
}
