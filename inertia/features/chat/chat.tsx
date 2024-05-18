import { MessagesList } from '~/features/chat/messages_list'
import { ChatForm } from '~/features/chat/chat_form'
import { useChat } from '~/features/chat/use_chat'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  isOpen?: boolean
  setOpenChat?: Dispatch<SetStateAction<boolean>>
}

export const Chat = (props: Props) => {
  const { messages, handleSubmit } = useChat()
  const { isOpen, setOpenChat } = props

  const className = isOpen ? '' : 'hidden'

  return (
    <section
      className={`relative flex flex-col gap-2 bg-blue-200 max-w-[400px] w-full p-4 rounded-md ${className}`}
    >
      <div className={'col gap-2'}>
        <h1 className={'text-center'}>Chat</h1>
        <MessagesList messages={messages} />
      </div>
      <ChatForm onSubmit={handleSubmit} setOpenChat={setOpenChat} />
    </section>
  )
}
