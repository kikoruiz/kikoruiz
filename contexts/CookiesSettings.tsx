import {
  useState,
  useMemo,
  useContext,
  createContext,
  PropsWithChildren
} from 'react'

const useValue = () => {
  const [isOpen, setIsOpen] = useState(false)

  return useMemo(
    () => ({
      isOpen,
      setIsOpen
    }),
    [isOpen]
  )
}

export const CookiesSettingsContext = createContext(
  null as ReturnType<typeof useValue>
)

export const CookiesSettingsProvider = ({children}: PropsWithChildren) => {
  return (
    <CookiesSettingsContext.Provider value={useValue()}>
      {children}
    </CookiesSettingsContext.Provider>
  )
}

export function useCookiesSettingsContext() {
  return useContext(CookiesSettingsContext)
}

export default useCookiesSettingsContext
