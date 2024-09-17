import {
  useState,
  useMemo,
  useContext,
  createContext,
  PropsWithChildren
} from 'react'

const useValue = () => {
  const [subcategory, setSubcategory] = useState<string | null>(null)

  return useMemo(
    () => ({
      subcategory,
      setSubcategory
    }),
    [subcategory]
  )
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
  return useContext(SubcategoryContext)
}

export default useSubcategoryContext
