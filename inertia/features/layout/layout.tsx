import React from 'react'
import { Footer } from '~/features/layout/footer'
import { Header } from '~/features/layout/header'
import { Container } from '~/features/utils/components/container'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className={'h-screen w-screen'}>
      <Container className="flex-grow-1 w-full relative">
        <Header />
        {children}
      </Container>
      <Footer />
    </Container>
  )
}
