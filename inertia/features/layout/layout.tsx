import React from 'react'
import { Footer } from '~/features/layout/footer'
import { Header } from '~/features/layout/header'
import { Container } from '~/features/utils/components/container'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Container className={'h-screen w-auto relative'}>
        <Header />
        {children}
      </Container>
      <Footer />
    </div>
  )
}
