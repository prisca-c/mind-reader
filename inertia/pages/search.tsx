import { useMatchmaking } from '~/features/matchmaking/use_matchmaking'
import { Button } from '~/features/utils/components/button'
import type { GameSessionId } from '#features/game_session/types/game_session'
import User from '#models/user'

export type SearchProps = {
  user: User
  existingSession: GameSessionId
}

export default function Search(props: SearchProps) {
  const { queueCount, cancelQueue, t } = useMatchmaking(props)

  return (
    <div className={'text-center'}>
      <h1>{t('search.search')}</h1>
      <p>
        {t('search.queueCount')}: <b>{queueCount}</b>
      </p>
      <Button onClick={cancelQueue}>{t('global.cancel')}</Button>
    </div>
  )
}
