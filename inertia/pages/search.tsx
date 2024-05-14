import { useTransmit } from '~/hooks/use_transmit'
import User from '#models/user'
import { useEffect } from 'react'
import { Api } from '~/services/api'

type Props = {
  user: User
}

export default function Search({ user }: Props) {
  const { subscription } = useTransmit({ url: `/game/user/${user.id}` })
  subscription?.onMessage((message) => {
    console.log(message)
  })

  const registerToQueue = async () => {
    await new Api().post('/game/search')
  }

  useEffect(() => {
    registerToQueue()
  }, [])
  return (
    <div>
      <h1>Search</h1>
    </div>
  )
}
