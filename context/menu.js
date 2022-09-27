import {useContext, createContext, useMemo, useState} from 'react'

const MenuContext = createContext(null)

export function MenuContextProvider({children}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const values = useMemo(
    () => ({
      isMenuOpen,
      setIsMenuOpen
    }),
    [isMenuOpen]
  )

  return <MenuContext.Provider value={values}>{children}</MenuContext.Provider>
}

export function useMenuContext() {
  const context = useContext(MenuContext)

  return context
}
