import {useMediaQuery} from 'react-responsive'
import {HighlightedImage} from 'types/gallery'
import Image from './image'
import {screens} from 'lib/utils'

export default function Hero({images}: HeroProps) {
  const {md, xl} = screens
  const isMobile = useMediaQuery({maxWidth: md - 1})
  const isTablet = useMediaQuery({minWidth: md, maxWidth: xl - 1})

  let heroImage
  let heroImageClassName

  if (isMobile) {
    heroImage = images.mobile
    heroImageClassName = 'aspect-2/3'
  } else if (isTablet) {
    heroImage = images.tablet
    heroImageClassName = 'aspect-square'
  } else {
    heroImage = images.desktop
    heroImageClassName = 'aspect-3/2'
  }

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
  images: {
    mobile: HighlightedImage
    tablet: HighlightedImage
    desktop: HighlightedImage
  }
}
