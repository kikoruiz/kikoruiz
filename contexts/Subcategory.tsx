import React, {
  useState,
  useMemo,
  useContext,
  createContext,
  PropsWithChildren
} from 'react'

const useValue = () => {
  const [subcategory, setSubcategory] = useState<string | null>(null)
  const value = useMemo(
    () => ({
      subcategory,
      setSubcategory
    }),
    [subcategory]
  )

  return value
}

export const SubcategoryContext = createContext(
  null as ReturnType<typeof useValue>
)

export const SubcategoryProvider = ({children}: PropsWithChildren) => {
  return (
    <SubcategoryContext.Provider value={useValue()}>
      {children}
    </SubcategoryContext.Provider>
  )
}

export function useSubcategoryContext() {
  const context = useContext(SubcategoryContext)

  return context
}

export default useSubcategoryContext
