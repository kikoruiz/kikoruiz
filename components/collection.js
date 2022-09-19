import PropTypes from 'prop-types'
import Link from 'next/link'

export default function Collection({items}) {
  return (
    <ul>
      {items.map(({name, slug, permalink}) => (
        <li key={slug}>
          <Link href={permalink}>
            <a>{name}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

Collection.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string,
      permalink: PropTypes.string
    })
  )
}
