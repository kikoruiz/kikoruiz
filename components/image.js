import PropTypes from 'prop-types'
import {useState} from 'react'
import Link from 'next/link'
import NextImage from 'next/image'

export default function Image({
  src,
  url,
  alt,
  className,
  sizes,
  needsPreload,
  fallbackStyle,
  isRounded,
  isFullRounded,
  isShallowLink,
  children
}) {
  const isLink = Boolean(url)
  const [isLoaded, setIsLoaded] = useState(false)
  const wrapperClassName = `relative overflow-hidden${
    isRounded ? ' rounded-sm' : ''
  }`
  const isFullSize = sizes === '100vw'
  const roundedStyle =
    isRounded || isFullRounded
      ? {
          WebkitMaskImage: '-webkit-radial-gradient(white, black)'
        }
      : {}

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
        onLoad={handleImageLoad}
        sizes={sizes}
        fill
      />
      {children}
    </>
  )

  return isLink ? (
    <Link
      href={url}
      title={alt}
      className={`${className} ${wrapperClassName}`}
      style={roundedStyle}
      shallow={isShallowLink}
    >
      {content}
    </Link>
  ) : (
    <figure className={`${className} ${wrapperClassName}`} style={roundedStyle}>
      {content}
    </figure>
  )
}

Image.propTypes = {
  src: PropTypes.string,
  url: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  sizes: PropTypes.string,
  needsPreload: PropTypes.bool,
  fallbackStyle: PropTypes.shape({
    backgroundImage: PropTypes.string,
    backgroundPosition: PropTypes.string,
    backgroundRepeat: PropTypes.string,
    backgroundSize: PropTypes.string
  }),
  isRounded: PropTypes.bool,
  isShallowLink: PropTypes.bool,
  children: PropTypes.node
}
