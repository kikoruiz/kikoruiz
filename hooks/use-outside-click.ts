import {RefObject, useEffect} from 'react'

export default function useOutsideClick(
  ref: RefObject<HTMLElement | undefined | null>,
  callback: () => void
) {
  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
      callback()
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  })
}
