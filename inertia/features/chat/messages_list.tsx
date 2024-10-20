export interface MessageProps {
  timestamp: string
  username: string
  message: string
}

interface MessagesListProps {
  messages: MessageProps[]
}

const Message = ({ message }: { message: MessageProps }) => (
  <div
    className={`flex flex-col p-2 border-2 border-gray-500 rounded ${new Date(message.timestamp).getTime() % 2 === 0 ? 'bg-gray-200' : 'bg-white-100'}`}
  >
    <span className={'flex justify-between text-xs'}>
      <span className={'truncate font-bold'}>{message.username}</span>
      <span>{message.timestamp}</span>
    </span>
    <span>{message.message}</span>
  </div>
)

export const MessagesList = ({ messages }: MessagesListProps) => {
  return (
    <div
      className={
        'flex flex-col gap-1 chat overflow-y-scroll bg-white w-full rounded h-[200px] p-1'
      }
    >
      {messages.map((message) => (
        <Message
          key={`${message.username}-${message.timestamp}-${Math.random()}`}
          message={message}
        />
      ))}
    </div>
  )
}
