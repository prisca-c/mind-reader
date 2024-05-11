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
    try {
      await api.post('/chat', { message })
      event.currentTarget.reset()
    } catch (error) {
      // handle error
    }
  }

  return (
    <section
      className={
        'flex flex-col justify-between items-center gap-2 max-w-[400px] w-auto bg-blue-200 p-4 rounded'
      }
    >
      <div className={'flex flex-col items-center justify-center w-full gap-2'}>
        <h1 className={'text-center'}>Chat</h1>
        <div className={'flex flex-col chat overflow-y-auto bg-white w-full rounded h-[200px] p-1'}>
          {messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      </div>
      <form method={'post'} className={'flex flex-col gap-2'} onSubmit={handleSubmit}>
        <input type={'text'} name={'message'} className={'w-full rounded p-2'} />
        <button
          type={'submit'}
          className={
            'bg-white border-2 border-gray-500 p-2 rounded hover:bg-gray-500 hover:text-white'
          }
        >
          Send
        </button>
      </form>
    </section>
  )
}
