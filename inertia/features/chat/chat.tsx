import { Dispatch, SetStateAction } from 'react'
import { ChatForm } from '~/features/chat/chat_form'
import { MessagesList } from '~/features/chat/messages_list'
import { useChat } from '~/features/chat/use_chat'

interface Props {
  isOpen?: boolean
  setOpenChat?: Dispatch<SetStateAction<boolean>>
}

export const Chat = (props: Props) => {
  const { messages, handleSubmit } = useChat()
  const { isOpen, setOpenChat } = props

  const className = isOpen ? 'flex' : 'hidden'

  return (
    <section
      className={`relative ${className} flex-col gap-2 bg-blue-200 max-w-[400px] w-full p-4 rounded-md`}
    >
      <div className={'gap-2'}>
        <h1 className={'text-center'}>Chat</h1>
        <MessagesList messages={messages} />
      </div>
      <ChatForm onSubmit={handleSubmit} setOpenChat={setOpenChat} />
    </section>
  )
}
