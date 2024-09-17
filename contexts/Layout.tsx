import {
  useState,
  useMemo,
  useContext,
  createContext,
  PropsWithChildren
} from 'react'

type Layout = {
  headerHeight?: number
}

const useValue = () => {
  const [layout, setLayout] = useState<Layout | null>(null)

  return useMemo(
    () => ({
      layout,
      setLayout
    }),
    [layout]
  )
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
  return useContext(LayoutContext)
}

export default useLayoutContext
