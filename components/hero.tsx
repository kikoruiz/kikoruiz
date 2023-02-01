import {useEffect, useState} from 'react'
import {useMediaQuery} from 'react-responsive'
import Image from './image'
import {screens} from 'lib/utils'
import {device, HeroImages} from 'types'

const HERO_IMAGE_CLASS_NAMES = {
  mobile: 'aspect-2/3',
  tablet: 'aspect-square',
  desktop: 'aspect-3/2'
}

export default function Hero({images, device}: HeroProps) {
  const {md, xl} = screens
  const isMobile = useMediaQuery({maxWidth: md - 1})
  const isTablet = useMediaQuery({minWidth: md, maxWidth: xl - 1})
  const [heroImage, setHeroImage] = useState(images[device])
  const [heroImageClassName, setHeroImageClassName] = useState(
    HERO_IMAGE_CLASS_NAMES[device]
  )

  useEffect(() => {
    if (isMobile) {
      setHeroImage(images.mobile)
      setHeroImageClassName(HERO_IMAGE_CLASS_NAMES.mobile)
    } else if (isTablet) {
      setHeroImage(images.tablet)
      setHeroImageClassName(HERO_IMAGE_CLASS_NAMES.tablet)
    } else {
      setHeroImage(images.desktop)
      setHeroImageClassName(HERO_IMAGE_CLASS_NAMES.desktop)
    }
  }, [isMobile, isTablet, images])

  return (
    <div className="absolute inset-0 -z-10 aspect-3/2 w-screen">
      <Image
        src={heroImage.src}
        alt={heroImage.alt}
        fallbackStyle={heroImage.css}
        className={`overflow-hidden ${heroImageClassName}`}
        sizes={heroImage.sizes}
        needsPreload
      />
    </div>
  )
}

interface HeroProps {
  images: HeroImages
  device: device
}
