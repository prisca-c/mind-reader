import React from 'react'

interface ChatFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  setOpenChat?: React.Dispatch<React.SetStateAction<boolean>>
}

export const ChatForm = (props: ChatFormProps) => {
  const { onSubmit, setOpenChat } = props
  return (
    <form method={'post'} className={'flex w-full flex-col gap-2'} onSubmit={onSubmit}>
      <input type={'text'} name={'message'} className={'w-auto rounded p-2'} />
      <div className={'flex w-full gap-1'}>
        <button
          type={'submit'}
          className={
            'bg-white border-2 w-full border-gray-500 p-2 rounded hover:bg-gray-500 hover:text-white'
          }
        >
          Send
        </button>

        <button
          className={'border-2 border-gray-500 hover:bg-gray-500 hover:text-white rounded px-2'}
          onClick={() => setOpenChat && setOpenChat(false)}
        >
          ❌
        </button>
      </div>
    </form>
  )
}
