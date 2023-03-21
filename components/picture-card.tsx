import {PropsWithChildren} from 'react'
import {Image as ImageType} from 'types/gallery'
import Image from './image'

export default function PictureCard({
  aspectRatio = '1:1',
  title,
  url,
  image,
  sizes,
  needsPreload = false,
  isAlbum = false,
  className = '',
  children
}: PictureCardProps) {
  const {src, css} = image
  const imageClassName = `group inline-flex flex-col-reverse w-full h-full after:absolute after:inset-0 after:h-full after:w-full after:border after:border-transparent hover:after:border-orange-300${
    className ? ` ${className}` : ''
  }`
  const captionBaseClassName =
    'relative bg-gradient-to-r from-neutral-900 text-xs lg:text-sm'
  const captionClassName = isAlbum
    ? `${captionBaseClassName} px-3 py-6 overflow-hidden`
    : `${captionBaseClassName} p-3.5 text-neutral-400`

  return (
    <Image
      src={src}
      url={url}
      alt={title}
      className={imageClassName}
      aspectRatio={aspectRatio}
      sizes={sizes}
      needsPreload={needsPreload}
      fallbackStyle={css}
      isRounded
      isShallowLink={!isAlbum}
    >
      <figcaption className={captionClassName}>
        <header
          className={`drop-shadow group-hover:text-orange-300 ${
            isAlbum
              ? 'break-words text-6xl font-thin leading-none text-neutral-300/90 sm:text-5xl md:text-6xl'
              : 'text-sm font-bold'
          }`}
        >
          {title}
        </header>

        {children}
      </figcaption>
    </Image>
  )
}

interface PictureCardProps extends PropsWithChildren {
  aspectRatio?: string
  title: string
  url: string
  image: ImageType
  sizes: string
  needsPreload?: boolean
  isAlbum?: boolean
  className?: string
}
