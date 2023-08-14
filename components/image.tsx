import {useState, CSSProperties} from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import {ImageFallbackStyle} from 'types/gallery'

function getAspectRatioClassName(aspectRatio: string): string {
  switch (aspectRatio) {
    case '1:1':
      return 'aspect-square'
    case '2:1':
      return 'aspect-2/1'
    case '3:2':
      return 'aspect-3/2'
    case '2:3':
      return 'aspect-2/3'
    case '4:3':
      return 'aspect-4/3'
    case '3:4':
      return 'aspect-3/4'
    case '5:4':
      return 'aspect-5/4'
    case '4:5':
      return 'aspect-4/5'
    case '5:3':
      return 'aspect-5/3'
    case '3:5':
      return 'aspect-3/5'
    case '16:9':
      return 'aspect-16/9'
    case '9:16':
      return 'aspect-9/16'
    case '16:10':
      return 'aspect-16/10'
    default:
      return ''
  }
}

export default function Image({
  src,
  url,
  alt,
  className = '',
  style = {},
  aspectRatio,
  sizes,
  needsPreload,
  isLazy = true,
  fallbackStyle,
  isRounded,
  isFullRounded,
  isShallowLink,
  scrollToTop = false,
  children
}: ImageProps) {
  const isLink = Boolean(url)
  const [isLoaded, setIsLoaded] = useState(false)
  const wrapperClassName = `relative${isRounded ? ' rounded-sm' : ''}`
  const isFullSize = sizes === '100vw'
  const imageStyle = {
    ...style,
    ...(isRounded || isFullRounded
      ? {
          WebkitMaskImage: '-webkit-radial-gradient(white, black)'
        }
      : {})
  }

  function handleImageLoad() {
    setIsLoaded(true)
  }

  const content = (
    <>
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 h-full w-full ${
          isFullSize ? 'blur-3xl' : 'blur-2xl'
        }${isLoaded ? ' hidden' : ''}${isFullRounded ? ' rounded-full' : ''}`}
        style={{
          ...fallbackStyle,
          transform: 'translate3d(0, 0, 0)'
        }}
      />
      <NextImage
        src={src}
        alt={alt}
        className={`object-cover ${isLoaded ? 'visible' : 'invisible'}`}
        priority={needsPreload}
        loading={isLazy && !needsPreload ? 'lazy' : 'eager'}
        onLoad={handleImageLoad}
        sizes={sizes}
        fill
      />
      {children}
    </>
  )
  const aspectRatioClassName = getAspectRatioClassName(aspectRatio)
  const aspectClassName = aspectRatioClassName
    ? ` ${getAspectRatioClassName(aspectRatio)}`
    : ''

  return isLink ? (
    <Link
      href={url}
      title={alt}
      className={`${
        className ? `${className} ` : ''
      }${wrapperClassName}${aspectClassName}`}
      style={imageStyle}
      shallow={isShallowLink}
      scroll={scrollToTop}
    >
      {content}
    </Link>
  ) : (
    <figure
      className={`${
        className ? `${className} ` : ''
      }${wrapperClassName}${aspectClassName}`}
      style={imageStyle}
    >
      {content}
    </figure>
  )
}

interface ImageProps {
  src: string
  url?: string
  alt: string
  className: string
  style?: CSSProperties
  aspectRatio?: string
  sizes: string
  needsPreload?: boolean
  isLazy?: boolean
  fallbackStyle: ImageFallbackStyle | object
  isRounded?: boolean
  isFullRounded?: boolean
  isShallowLink?: boolean
  scrollToTop?: boolean
  children?: JSX.Element
}
