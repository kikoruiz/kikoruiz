import {
  useState,
  useMemo,
  useContext,
  createContext,
  PropsWithChildren
} from 'react'
import {HERO_IMAGES} from 'config'

const useValue = () => {
  const defaultImage = HERO_IMAGES[0]
  const [heroImage, setHeroImage] = useState<string>(defaultImage)
  const [showImage, setShowImage] = useState<boolean>(false)

  return useMemo(
    () => ({
      heroImage,
      setHeroImage,
      showImage,
      setShowImage
    }),
    [heroImage, showImage]
  )
}

export const HeroImageContext = createContext(
  null as ReturnType<typeof useValue>
)

export const HeroImageProvider = ({children}: PropsWithChildren) => {
  return (
    <HeroImageContext.Provider value={useValue()}>
      {children}
    </HeroImageContext.Provider>
  )
}

export function useHeroImageContext() {
  return useContext(HeroImageContext)
}

export default useHeroImageContext
