import {
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

  return useMemo(
    () => ({
      latestPictures,
      setLatestPictures
    }),
    [latestPictures]
  )
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
  return useContext(LatestPicturesContext)
}

export default useLatestPicturesContext
