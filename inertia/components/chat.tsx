import React, { useEffect } from 'react'
import { Api } from '~/services/api'
import { useTransmit } from '~/hooks/use_transmit'

export const Chat = () => {
  const [messages, setMessages] = React.useState<string[]>([])
  const { subscription } = useTransmit({ url: 'chat' })

  useEffect(() => {
    if (subscription) {
      subscription.create()
      subscription.onMessage(({ message }: { message: string }) => {
        setMessages((value) => [...value, message])
      })
    }
  }, [subscription])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const message = formData.get('message') as string
    const api = new Api()
    await api.post('/chat', { message })
  }

  return (
    <section className={'flex flex-col items-center'}>
      <h1>Chat</h1>
      <div className={'flex flex-col chat'}>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <form method={'post'} className={'flex'} onSubmit={handleSubmit}>
        <input type={'text'} name={'message'} />
        <button type={'submit'}>Send</button>
      </form>
    </section>
  )
}
