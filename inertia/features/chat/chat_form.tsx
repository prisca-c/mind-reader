import React from 'react'

interface ChatFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export const ChatForm = ({ onSubmit }: ChatFormProps) => (
  <form method={'post'} className={'flex flex-col gap-2'} onSubmit={onSubmit}>
    <input type={'text'} name={'message'} className={'w-full rounded p-2'} />
    <button
      type={'submit'}
      className={'bg-white border-2 border-gray-500 p-2 rounded hover:bg-gray-500 hover:text-white'}
    >
      Send
    </button>
  </form>
)
