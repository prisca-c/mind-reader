import React, { useState, useEffect } from 'react'
import { useTransmit } from '~/hooks/use_transmit'
import { Api } from '~/services/api'

interface MessageProps {
  timestamp: string
  username: string
  message: string
}

export const useChat = () => {
  const [messages, setMessages] = useState<MessageProps[]>([])
  const { subscription } = useTransmit({ url: 'chat' })

  useEffect(() => {
    if (subscription) {
      subscription.create()
      subscription.onMessage((data: MessageProps) => {
        setMessages((prevMessages) => [...prevMessages, data])
      })
    }
  }, [subscription])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const message = formData.get('message') as string
    event.currentTarget.reset()
    const api = new Api()
    try {
      await api.post('/chat', { message })
      event.currentTarget.reset()
    } catch (error) {
      // handle error
    }
  }

  return { messages, handleSubmit }
}
