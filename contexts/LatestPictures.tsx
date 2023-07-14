import React, {
  useState,
  useMemo,
  useContext,
  createContext,
  PropsWithChildren
} from 'react'
import {LatestPictures} from 'types/gallery'

type latestPicturesType = keyof LatestPictures

const DEFAULT_SORTING_ORDER: latestPicturesType = 'byCreationDate'

const useValue = () => {
  const [latestPictures, setLatestPictures] = useState<latestPicturesType>(
    DEFAULT_SORTING_ORDER
  )
  const value = useMemo(
    () => ({
      latestPictures,
      setLatestPictures
    }),
    [latestPictures]
  )

  return value
}

export const LatestPicturesContext = createContext(
  {} as ReturnType<typeof useValue>
)

export const LatestPicturesProvider = ({children}: PropsWithChildren) => {
  return (
    <LatestPicturesContext.Provider value={useValue()}>
      {children}
    </LatestPicturesContext.Provider>
  )
}

export function useLatestPicturesContext() {
  const context = useContext(LatestPicturesContext)

  return context
}

export default useLatestPicturesContext
