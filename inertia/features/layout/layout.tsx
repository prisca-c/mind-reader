import React from 'react'
import { Footer } from '~/features/layout/footer'
import { Header } from '~/features/layout/header'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className={'relative flex justify-center items-center h-screen w-auto'}>
        <Header />
        {children}
      </div>

      <Footer />
    </div>
  )
}
