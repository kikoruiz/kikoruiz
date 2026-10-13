import {
  useState,
  useMemo,
  useContext,
  createContext,
  PropsWithChildren
} from 'react'
import {HERO_IMAGES} from 'config'

const useValue = (defaultImage: string) => {
  const [chosenImage, setHeroImage] = useState<string | null>(null)
  const [showImage, setShowImage] = useState<boolean>(false)
  // The page picks the hero while it renders, so leaving the state empty until
  // someone switches it by hand is what lets the server's choice through, and
  // what keeps a hand-picked one across navigations.
  const heroImage = chosenImage ?? defaultImage

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

export const HeroImageProvider = ({
  defaultImage = HERO_IMAGES[0],
  children
}: PropsWithChildren<{defaultImage?: string}>) => {
  return (
    <HeroImageContext.Provider value={useValue(defaultImage)}>
      {children}
    </HeroImageContext.Provider>
  )
}

export function useHeroImageContext() {
  return useContext(HeroImageContext)
}

export default useHeroImageContext
