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
  const [heroImage, setHeroImage] = useState<string | null>(defaultImage)

  return useMemo(
    () => ({
      heroImage,
      setHeroImage
    }),
    [heroImage]
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
