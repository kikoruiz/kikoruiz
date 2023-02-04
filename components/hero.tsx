import {useEffect, useState} from 'react'
import {useMediaQuery} from 'react-responsive'
import Image from './image'
import {screens} from 'lib/utils'
import {HeroImages} from 'types'
import useHeroContext from 'contexts/hero'
import {DEFAULT_DEVICE} from 'config'

const HERO_IMAGE_CLASS_NAMES = {
  mobile: 'aspect-2/3',
  tablet: 'aspect-square',
  desktop: 'aspect-3/2'
}

export default function Hero({images}: HeroProps) {
  const {hero, setHero} = useHeroContext()
  const {md, xl} = screens
  const isMobile = useMediaQuery({maxWidth: md - 1})
  const isTablet = useMediaQuery({minWidth: md, maxWidth: xl - 1})
  const [heroClassName, setHeroClassName] = useState(
    HERO_IMAGE_CLASS_NAMES[DEFAULT_DEVICE]
  )

  useEffect(() => {
    if (isMobile) {
      setHero(images.mobile)
      setHeroClassName(HERO_IMAGE_CLASS_NAMES.mobile)
    } else if (isTablet) {
      setHero(images.tablet)
      setHeroClassName(HERO_IMAGE_CLASS_NAMES.tablet)
    } else {
      setHero(images.desktop)
      setHeroClassName(HERO_IMAGE_CLASS_NAMES.desktop)
    }
  }, [isMobile, isTablet, images, setHero])

  return (
    <div
      className="absolute inset-0 -z-10 aspect-3/2 w-screen"
      style={{
        WebkitMaskImage:
          'linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, transparent 100%)'
      }}
    >
      <Image
        src={hero.src}
        alt={hero.alt}
        fallbackStyle={hero.css}
        className={`overflow-hidden ${heroClassName}`}
        sizes={hero.sizes}
        needsPreload
      />
    </div>
  )
}

interface HeroProps {
  images: HeroImages
}
