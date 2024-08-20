import { useEffect, useState } from 'react'

export const useTimer = (initialTime: number) => {
  const [timer, setTimer] = useState(initialTime)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (!isActive) return

    const intervalId = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isActive])

  useEffect(() => {
    if (timer <= 0) {
      setIsActive(false)
      setTimer(0)
    }
  }, [timer])

  return { timer, isActive, setIsActive }
}
