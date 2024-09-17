import Image from './image'
import {HighlightedImage} from 'types/gallery'

export default function Hero({image}: HeroProps) {
  return (
    <div className="absolute inset-0 -z-10 w-screen">
      <Image
        src={image.src}
        alt={image.alt}
        fallbackStyle={image.css}
        className="overflow-hidden aspect-2/3"
        style={{
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, transparent 100%)'
        }}
        sizes={image.sizes}
        needsPreload
      />
    </div>
  )
}

interface HeroProps {
  image: HighlightedImage
}
