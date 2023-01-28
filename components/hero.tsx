import Image from './image'

export default function Hero({image}) {
  return (
    <div className="absolute inset-0 -z-10 aspect-3/2 w-screen">
      <Image
        src={image.src}
        alt={image.alt}
        fallbackStyle={image.css}
        className="aspect-3/2 overflow-hidden"
        sizes={image.sizes}
        needsPreload
      />
    </div>
  )
}
