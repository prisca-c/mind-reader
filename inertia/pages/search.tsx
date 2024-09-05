import { useTransmit } from '~/hooks/use_transmit'
import User from '#models/user'
import { useEffect, useState } from 'react'
import { Api } from '~/services/api'
import { router } from '@inertiajs/react'
import type { GameSessionId } from '#features/game_session/types/game_session'
import { Button } from '~/features/utils/components/button'
import { useTranslation } from 'react-i18next'

type Props = {
  user: User
  existingSession: GameSessionId
}

export default function Search(props: Props) {
  const { user, existingSession } = props
  const [queueCount, setQueueCount] = useState(0)
  const { subscription: userListener } = useTransmit({ url: `game/user/${user.id}` })
  const { subscription: queueListener } = useTransmit({ url: 'game/search' })

  const { t } = useTranslation()

  const registerToQueue = async () => {
    const response: { message: string; queueCount: number } = await new Api().post('/game/search')
    setQueueCount(response.queueCount)
  }

  useEffect(() => {
    if (existingSession) {
      router.visit(`/game/session/${existingSession}`)
      return
    }
    registerToQueue()
  }, [])

  userListener?.create()
  queueListener?.create()

  userListener?.onMessage(async (message: { status: string; sessionId: string }) => {
    if (message.status === 'accept') {
      await new Api().get(`/game/session/${message.sessionId}/accept`)
      return
    }

    if (message.status === 'removed') {
      await queueListener?.delete()
      await userListener?.delete()
      return router.visit('/game')
    }

    if (message.status === 'start') {
      return router.visit(`/game/session/${message.sessionId}`)
    }
  })

  queueListener?.onMessage((message: { queueCount: number }) => {
    setQueueCount(message.queueCount)
  })

  const cancelQueue = async () => {
    await new Api().delete('/game/search')
    await queueListener?.delete()
    await userListener?.delete()
    return router.visit('/game')
  }

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
