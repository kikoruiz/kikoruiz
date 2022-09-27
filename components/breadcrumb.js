import Link from 'next/link'
import {useRouter} from 'next/router'
import {fromRouteToBreadcrumbItems} from '../lib/mappers.js'

export default function Breadcrumb() {
  const router = useRouter()
  const {route, query} = router
  const items = fromRouteToBreadcrumbItems({route, query})

  return items.length > 0 ? (
    <div className="bg-neutral-800/75">
      <div className="container mx-auto py-3 px-4 text-xl">
        {items.map(({name, href, slug}) => {
          if (href) {
            return (
              <Link href="/gallery" key={slug}>
                <a
                  title={`Back to ${name}`}
                  className="text-neutral-400/30 drop-shadow after:content-['\00a0/\00a0'] hover:text-neutral-300/60 hover:after:text-neutral-400/30"
                >
                  Gallery
                </a>
              </Link>
            )
          }

          return (
            <span className="font-black text-orange-300/75" key={slug}>
              {name}
            </span>
          )
        })}
      </div>
    </div>
  ) : null
}
