import { useTransmit } from '~/hooks/use_transmit'
import User from '#models/user'
import { useEffect, useState } from 'react'
import { Api } from '~/services/api'
import { router } from '@inertiajs/react'

type Props = {
  user: User
}

export default function Search({ user }: Props) {
  const [queueCount, setQueueCount] = useState(0)
  const { subscription: userListener } = useTransmit({ url: `game/user/${user.id}` })
  const { subscription: queueListener } = useTransmit({ url: 'game/search' })

  const registerToQueue = async () => {
    const response: { message: string; queueCount: number } = await new Api().post('/game/search')
    setQueueCount(response.queueCount)
  }

  useEffect(() => {
    registerToQueue()
  }, [])

  userListener?.create()
  queueListener?.create()

  userListener?.onMessage(async (message: { status: string; sessionId: string }) => {
    if (message.status === 'accept') {
      await new Api().post(`/game/session/${message.sessionId}/accept`)
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

  return (
    <div>
      <h1>Search</h1>
      <p>Queue count: {queueCount}</p>
    </div>
  )
}
