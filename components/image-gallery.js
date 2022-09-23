import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

export default function ImageGallery({items, isAlbum = false}) {
  return (
    <div className="columns-1 gap-1 space-y-1 px-1 pb-1 sm:columns-2 md:columns-3">
      {items.map(({name, key, url, image, metadata}, index) => {
        const {src, orientation, base64} = image
        const imageAspectClassName =
          orientation === 'vertical' ? 'aspect-2/3' : 'aspect-3/2'
        const aspectClassName = isAlbum ? 'aspect-square' : imageAspectClassName
        const className = `relative inline-flex flex-col-reverse break-inside-avoid-column w-full ${aspectClassName}${
          index === 0 ? ' mt-1' : ''
        }`
        const captionClassName = isAlbum
          ? 'relative rounded-bl-sm bg-gradient-to-r from-neutral-900 px-6 py-9 text-xs text-4xl'
          : 'relative rounded-bl-sm bg-gradient-to-r from-neutral-800 p-3 text-xs text-neutral-400'
        const content = (
          <>
            <Image
              src={src}
              layout="fill"
              objectFit="cover"
              alt={name}
              className="rounded-sm"
              placeholder="blur"
              blurDataURL={base64}
            />

            <figcaption className={captionClassName}>
              <header
                className={`font-bold${isAlbum ? ' text-neutral-500' : ''}`}
              >
                {name}
              </header>
              {metadata && (
                <div className="space-x-1">
                  <span className="text-neutral-500">
                    {metadata.shutterSpeed}s
                  </span>
                  <span className="inline-block text-neutral-600">
                    <span className="italic">f</span>/{metadata.aperture}
                  </span>
                  <span className="text-neutral-700">ISO {metadata.iso}</span>
                </div>
              )}
            </figcaption>
          </>
        )

        return url ? (
          <Link href={url} key={key}>
            <a className={`${className} block`}>{content}</a>
          </Link>
        ) : (
          <div key={key} className={className}>
            {content}
          </div>
        )
      })}
    </div>
  )
}

ImageGallery.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      key: PropTypes.string.isRequired,
      url: PropTypes.string,
      image: PropTypes.shape({
        src: PropTypes.string.isRequired,
        orientation: PropTypes.string.isRequired
      }).isRequired,
      metadata: PropTypes.shape({
        iso: PropTypes.number,
        aperture: PropTypes.number,
        shutterSpeed: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    })
  ),
  isAlbum: PropTypes.bool
}
