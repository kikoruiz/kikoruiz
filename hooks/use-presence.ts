import {useLayoutEffect, useState} from 'react'

// Keeps something mounted through its closing transition. `isVisible` is the
// state to style from: it is off when the thing is laid out, so the browser has
// a starting point to travel from, and it turns on before the first paint, so
// the transition begins in the very frame of the click.
export function usePresence(isOpen: boolean, duration = 300) {
  const [isRendered, setIsRendered] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(isOpen)

  useLayoutEffect(() => {
    if (isOpen) {
      // Reading a layout property flushes the styles of the hidden state.
      void document.body.offsetHeight
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRendered(true)
      setIsVisible(true)

      return
    }

    setIsVisible(false)
    const timeout = setTimeout(() => setIsRendered(false), duration)

    return () => clearTimeout(timeout)
  }, [isOpen, duration])

  return {isRendered: isOpen || isRendered, isVisible}
}
