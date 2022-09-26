import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

export default function ImageGallery({items, isAlbum = false}) {
  return (
    <div className="columns-1 gap-2 space-y-2 px-2 pb-2 sm:columns-2 md:columns-3">
      {items.map(({name, key, url, image, metadata}, index) => {
        const {src, orientation, base64} = image
        const imageAspectClassName =
          orientation === 'vertical' ? 'aspect-2/3' : 'aspect-3/2'
        const aspectClassName = isAlbum ? 'aspect-square' : imageAspectClassName
        const className = `relative inline-flex flex-col-reverse break-inside-avoid-column w-full ${aspectClassName}${
          index === 0 ? ' mt-2' : ''
        }`
        const captionBaseClassName =
          'relative rounded-bl-sm bg-gradient-to-r text-xs'
        const captionClassName = isAlbum
          ? `${captionBaseClassName} from-neutral-900 px-6 py-9 text-4xl`
          : `${captionBaseClassName} from-neutral-800 via-transparent p-3 text-neutral-400`
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
                className={`drop-shadow transition font-bold${
                  isAlbum ? ' text-neutral-400' : ''
                } group-hover:text-orange-300`}
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
              className={`${className} group block rounded-sm border-2 border-transparent transition hover:border-orange-300/60`}
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
