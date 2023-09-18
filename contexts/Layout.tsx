import React, {
  useState,
  useMemo,
  useContext,
  createContext,
  PropsWithChildren
} from 'react'

type layout = {
  headerHeight?: number
}

const useValue = () => {
  const [layout, setLayout] = useState<layout | null>(null)
  const value = useMemo(
    () => ({
      layout,
      setLayout
    }),
    [layout]
  )

  return value
}

export const LayoutContext = createContext(null as ReturnType<typeof useValue>)

export const LayoutProvider = ({children}: PropsWithChildren) => {
  return (
    <LayoutContext.Provider value={useValue()}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayoutContext() {
  const context = useContext(LayoutContext)

  return context
}

export default useLayoutContext
