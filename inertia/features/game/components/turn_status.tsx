import { useTranslation } from 'react-i18next'

export const TurnStatus = ({
  turnState,
  isGameOver,
}: {
  turnState: boolean | null
  isGameOver: boolean
}) => {
  const { t } = useTranslation()
  return (
    !isGameOver && (
      <p className='text-blue-500'>
        {turnState
          ? t('gameSession.gameState.playing')
          : t('gameSession.gameState.waiting')}
      </p>
    )
  )
}
