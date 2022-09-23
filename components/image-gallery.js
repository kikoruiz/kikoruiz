import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

export default function ImageGallery({items}) {
  return (
    <div className="columns-2 gap-1 space-y-1 px-1 pb-1 md:columns-3">
      {items.map(({name, key, url, image}, index) => {
        const {src, orientation, base64} = image
        const className = `relative inline-block break-inside-avoid-column w-full ${
          orientation === 'vertical' ? 'aspect-2/3' : 'aspect-3/2'
        }${index === 0 ? ' mt-1' : ''}`
        const content = (
          <>
            <span>{name}</span>

            <Image
              src={src}
              layout="fill"
              objectFit="cover"
              alt={name}
              className="rounded-sm"
              placeholder="blur"
              blurDataURL={base64}
            />
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
      }).isRequired
    })
  )
}
