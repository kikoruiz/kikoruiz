import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

export default function ImageGallery({items, isAlbum = false}) {
  return (
    <div
      className={`gap-3 space-y-3 px-3 pb-3 md:columns-3${
        isAlbum ? ' columns-2' : ' columns-1 sm:columns-2'
      }`}
    >
      {items.map(({name, key, url, image, metadata}, index) => {
        const {src, orientation, base64} = image
        const imageAspectClassName =
          orientation === 'vertical' ? 'aspect-2/3' : 'aspect-3/2'
        const aspectClassName = isAlbum ? 'aspect-square' : imageAspectClassName
        const className = `relative inline-flex flex-col-reverse break-inside-avoid-column w-full drop-shadow-md ${aspectClassName}${
          index === 0 ? ' mt-3' : ''
        }`
        const captionBaseClassName =
          'relative rounded-bl-sm bg-gradient-to-r from-neutral-900 text-xs lg:text-sm'
        const captionClassName = isAlbum
          ? `${captionBaseClassName} px-3 py-6 md:px-6 md:py-9`
          : `${captionBaseClassName} p-3 text-neutral-400`
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
                className={`font-bold drop-shadow group-hover:text-orange-300${
                  isAlbum
                    ? ' text-2xl text-neutral-400 md:text-3xl lg:text-4xl'
                    : ''
                }`}
              >
                {name}
              </header>
              {metadata && (
                <div className="space-x-1 text-neutral-600 drop-shadow">
                  <span className="after:content-['\00a0·']">
                    {metadata.shutterSpeed}s
                  </span>
                  {metadata.aperture && (
                    <span className="inline-block after:content-['\00a0·']">
                      <span className="italic">f</span>/{metadata.aperture}
                    </span>
                  )}
                  <span>ISO {metadata.iso}</span>
                </div>
              )}
            </figcaption>
          </>
        )

        return url ? (
          <Link href={url} key={key}>
            <a
              className={`${className} group block rounded-sm border-2 border-transparent hover:border-orange-300/60`}
            >
              {content}
            </a>
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
