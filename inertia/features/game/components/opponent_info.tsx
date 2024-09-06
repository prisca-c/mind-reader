import { useTranslation } from 'react-i18next'

export const OpponentInfo = ({
  opponent,
  isGameOver,
}: {
  opponent: string | null
  isGameOver: boolean
}) => {
  const { t } = useTranslation()
  return (
    isGameOver &&
    opponent && (
      <p>
        {t('gameSession.opponent')}: {opponent}
      </p>
    )
  )
}
