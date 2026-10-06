import {
  useState,
  CSSProperties,
  forwardRef,
  type JSX,
  type MouseEvent
} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import NextImage from 'next/image'
import {getAspectRatioClassName} from 'lib/utils'
import {ImageFallbackStyle} from 'types/gallery'

interface ImageProps {
  src: string
  url?: string
  shallowUrl?: string
  alt: string
  className?: string
  style?: CSSProperties
  aspectRatio?: string
  sizes: string
  needsPreload?: boolean
  isLazy?: boolean
  fallbackStyle: ImageFallbackStyle | object
  isRounded?: boolean
  isFullRounded?: boolean
  isHidden?: boolean
  scrollToTop?: boolean
  onLoad?: () => void
  children?: JSX.Element
}

function Image(
  {
    src,
    url,
    shallowUrl,
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
    isHidden = false,
    scrollToTop = false,
    onLoad = () => {},
    children
  },
  ref
) {
  const isLink = Boolean(url)
  const {push} = useRouter()
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
    onLoad()
  }

  // The link points at the picture's own page so crawlers get a real URL, while
  // a plain click still opens the viewer over the current one. Modified clicks
  // are left alone, so opening in a new tab lands on the page itself.
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    event.preventDefault()
    push(shallowUrl, shallowUrl, {shallow: true, scroll: false})
  }

  const content = (
    <>
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 h-full w-full ${
          isFullSize ? 'blur-3xl' : 'blur-2xl'
        }${isLoaded && !isHidden ? ' hidden' : ''}${isFullRounded ? ' rounded-full' : ''}`}
        style={{
          ...fallbackStyle,
          transform: 'translate3d(0, 0, 0)'
        }}
      />

      <NextImage
        ref={ref}
        src={src}
        alt={alt}
        className={`object-cover transition-opacity duration-300 ${isLoaded && !isHidden ? 'opacity-100' : 'opacity-0'}`}
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
  const aspectClassName = aspectRatioClassName ? ` ${aspectRatioClassName}` : ''

  return isLink ? (
    <Link
      href={url}
      title={alt}
      className={`${
        className ? `${className} ` : ''
      }${wrapperClassName}${aspectClassName}`}
      style={imageStyle}
      scroll={scrollToTop}
      {...(shallowUrl && {onClick: handleClick, prefetch: false})}
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

export default forwardRef<HTMLImageElement, ImageProps>(Image)

Image.displayName = 'Image'
