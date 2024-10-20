import { useTranslation } from 'react-i18next'
import type User from '#models/user'

export const PlayerInfo = ({ user }: { user: User }) => {
  const { t } = useTranslation()
  return (
    <p>
      {t('gameSession.player')}: {user.username}
    </p>
  )
}
