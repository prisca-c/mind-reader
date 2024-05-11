import { MessagesList } from '~/features/chat/messages_list'
import { ChatForm } from '~/features/chat/chat_form'
import { useChat } from '~/features/chat/use_chat'

export const Chat = () => {
  const { messages, handleSubmit } = useChat()

  return (
    <section
      className={
        'flex flex-col justify-between items-center gap-2 max-w-[400px] w-full bg-blue-200 p-4 rounded'
      }
    >
      <div className={'flex flex-col items-center justify-center w-full gap-2'}>
        <h1 className={'text-center'}>Chat</h1>
        <MessagesList messages={messages} />
      </div>
      <ChatForm onSubmit={handleSubmit} />
    </section>
  )
}
