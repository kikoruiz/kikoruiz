import {
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
  PropsWithChildren
} from 'react'
import {getRandomElement} from 'lib/utils'
import {HERO_IMAGES} from 'config'

const useValue = () => {
  const defaultImage = HERO_IMAGES[0]
  const [heroImage, setHeroImage] = useState<string>(defaultImage)
  const [showImage, setShowImage] = useState<boolean>(false)

  // The home page is statically generated, so its markup can only ever carry
  // one hero. Drawing another one after mount is what keeps that markup
  // hydratable while still varying the picture from visit to visit, and a
  // random value is precisely what cannot be computed while rendering.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeroImage(getRandomElement(HERO_IMAGES))
  }, [])

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
