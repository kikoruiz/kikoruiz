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
  children
}) {
  const isLink = Boolean(url)
  const [isLoaded, setIsLoaded] = useState(false)
  const wrapperClassName = `relative overflow-hidden${
    isRounded ? ' rounded-sm' : ''
  }`
  const roundedStyle =
    isRounded || isFullRounded
      ? {
          '-webkit-mask-image': '-webkit-radial-gradient(white, black)'
        }
      : {}

  function handleImageLoad() {
    setIsLoaded(true)
  }

  const content = (
    <>
      <div
        aria-hidden
        className={`absolute inset-0 h-full w-full blur-3xl${
          isLoaded ? ' hidden' : ''
        }${isFullRounded ? ' rounded-full' : ''}`}
        style={{
          ...fallbackStyle,
          transform: 'translate3d(0, 0, 0)',
          ...roundedStyle
        }}
      />
      <NextImage
        src={src}
        alt={alt}
        className="object-cover"
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
  children: PropTypes.node
}
