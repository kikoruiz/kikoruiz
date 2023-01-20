import React, {useState, useMemo, useContext, createContext} from 'react'

export const SubcategoryContext = createContext(null)
export const SubcategoryContextProvider = ({children}) => {
  const [subcategory, setSubcategory] = useState(null)
  const values = useMemo(
    () => ({
      subcategory,
      setSubcategory
    }),
    [subcategory]
  )

  return (
    <SubcategoryContext.Provider value={values}>
      {children}
    </SubcategoryContext.Provider>
  )
}

export function useSubcategoryContext() {
  const context = useContext(SubcategoryContext)

  return context
}

export default useSubcategoryContext
