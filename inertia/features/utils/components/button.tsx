import React from 'react'

export interface Props {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export const Button = (props: Props) => {
  const { children, onClick, className = '', type = 'button' } = props

  return (
    <button
      type={type}
      onClick={onClick}
      className={`border-2 border-gray-500 hover:bg-gray-500 hover:text-white p-2 rounded-md ${className}`}
    >
      {children}
    </button>
  )
}
