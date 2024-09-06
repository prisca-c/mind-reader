import { useTranslation } from 'react-i18next'

export const GameSessionTitle = ({ handleCopySessionId }: { handleCopySessionId: () => void }) => {
  const { t } = useTranslation()
  return (
    <h1 className="flex align-middle">
      {t('gameSession.title')}{' '}
      <img
        src="/images/copy.svg"
        onClick={handleCopySessionId}
        alt={'Copy icon'}
        className="cursor-pointer h-4 w-auto my-auto"
      />
    </h1>
  )
}
