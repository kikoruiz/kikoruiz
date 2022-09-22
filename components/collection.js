import {Fragment} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

export default function Collection({items}) {
  return (
    <div className="columns-2 gap-1 space-y-1 p-1 md:columns-3">
      {items.map(({name, key, url, image}, index) => {
        const {src, orientation} = image
        const className = `relative ${
          orientation === 'vertical' ? 'aspect-2/3' : 'aspect-3/2'
        }`
        const content = (
          <div className={className}>
            <span>{name}</span>

            <Image
              src={src}
              layout="fill"
              objectFit="cover"
              alt={name}
              className="rounded-sm"
              priority={index === 0}
            />
          </div>
        )

        return url ? (
          <Link href={url} key={key}>
            <a className={`${className} block`}>{content}</a>
          </Link>
        ) : (
          <Fragment key={key}>{content}</Fragment>
        )
      })}
    </div>
  )
}

Collection.propTypes = {
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
