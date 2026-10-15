import {useEffect, useState} from 'react'

// Keeps something mounted through its closing transition. `isVisible` is the
// state to style from: it turns on a couple of frames after mounting, or there
// would be no starting point to travel from, and off as soon as `isOpen` is.
export function usePresence(isOpen: boolean, duration = 300) {
  const [isRendered, setIsRendered] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRendered(true)
      let innerFrame: number
      const outerFrame = requestAnimationFrame(() => {
        innerFrame = requestAnimationFrame(() => setIsVisible(true))
      })

      return () => {
        cancelAnimationFrame(outerFrame)
        cancelAnimationFrame(innerFrame)
      }
    }

    setIsVisible(false)
    const timeout = setTimeout(() => setIsRendered(false), duration)

    return () => clearTimeout(timeout)
  }, [isOpen, duration])

  return {isRendered, isVisible}
}
