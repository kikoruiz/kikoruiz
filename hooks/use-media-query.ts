import {useEffect, useRef} from 'react'

interface MediaQueryOptions {
  minWidth?: number
  maxWidth?: number
}

export function useMediaQuery(
  query: MediaQueryOptions,
  _device: undefined,
  onChange: (matches: boolean) => void
) {
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  })

  useEffect(() => {
    const parts: string[] = []
    if (query.minWidth !== undefined)
      parts.push(`(min-width: ${query.minWidth}px)`)
    if (query.maxWidth !== undefined)
      parts.push(`(max-width: ${query.maxWidth}px)`)

    const mql = window.matchMedia(parts.join(' and '))
    const listener = (e: MediaQueryListEvent) => onChangeRef.current(e.matches)

    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [query.minWidth, query.maxWidth])
}
