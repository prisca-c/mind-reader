import { Subscription, Transmit } from '@adonisjs/transmit-client'
import React, { useEffect } from 'react'

type Props = {
  url: string
}

export const useTransmit = (props: Props) => {
  const { url } = props
  const [subscription, setSubscription] = React.useState<Subscription | null>(null)

  useEffect(() => {
    if (window) {
      const transmit = new Transmit({
        baseUrl: window.location.origin,
      })

      setSubscription(transmit.subscription(url))
    }
  }, [])

  return { subscription }
}
