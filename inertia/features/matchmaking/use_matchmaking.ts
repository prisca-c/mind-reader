import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTransmit } from '~/hooks/use_transmit'
import type { SearchProps } from '~/pages/search'
import { Api } from '~/services/api'

export const useMatchmaking = (props: SearchProps) => {
  const { user, existingSession } = props
  const [queueCount, setQueueCount] = useState(0)
  const { subscription: userListener } = useTransmit({
    url: `game/user/${user.id}`,
  })
  const { subscription: queueListener } = useTransmit({ url: 'game/search' })

  const { t } = useTranslation()

  const registerToQueue = async () => {
    const response: { message: string; queueCount: number } =
      await new Api().post('/game/search')
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

  userListener?.onMessage(
    async (message: { status: string; sessionId: string }) => {
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
    },
  )

  queueListener?.onMessage((message: { queueCount: number }) => {
    setQueueCount(message.queueCount)
  })

  const cancelQueue = async () => {
    await new Api().delete('/game/search')
    await queueListener?.delete()
    await userListener?.delete()
    return router.visit('/game')
  }

  return {
    cancelQueue,
    queueCount,
    t,
  }
}
