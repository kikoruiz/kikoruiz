import React, {useState, useMemo, useContext, createContext} from 'react'

export const HeroContext = createContext(null)

export const HeroProvider = ({children, value: initialValue}) => {
  const [hero, setHero] = useState(initialValue)
  const values = useMemo(
    () => ({
      hero,
      setHero
    }),
    [hero]
  )

  return <HeroContext.Provider value={values}>{children}</HeroContext.Provider>
}

export function useHeroContext() {
  const context = useContext(HeroContext)

  return context
}

export default useHeroContext
