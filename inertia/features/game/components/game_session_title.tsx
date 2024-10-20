import React from 'react'
import { useTranslation } from 'react-i18next'

export const GameSessionTitle = ({
  handleCopySessionId,
}: {
  handleCopySessionId: () => void
}) => {
  const { t } = useTranslation()
  const onKeyDown = (event: React.KeyboardEvent<HTMLImageElement>) => {
    if (event.ctrlKey && event.key === 'c') {
      handleCopySessionId()
    }
  }

  return (
    <h1 className='flex align-middle'>
      {t('gameSession.title')}{' '}
      <img
        src='/images/copy.svg'
        onClick={handleCopySessionId}
        onKeyDown={onKeyDown}
        alt={'Copy icon'}
        className='cursor-pointer h-4 w-auto my-auto'
      />
    </h1>
  )
}
