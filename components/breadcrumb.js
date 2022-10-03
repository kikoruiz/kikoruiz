import Link from 'next/link'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {fromRouteToBreadcrumbItems} from '../lib/mappers.js'

export default function Breadcrumb() {
  const {t} = useTranslation()
  const router = useRouter()
  const {route, query} = router
  const items = fromRouteToBreadcrumbItems({route, query})

  return items.length > 0 ? (
    <div className="bg-neutral-800/75">
      <div className="container mx-auto py-3 px-4 text-xl">
        {items.map(({href, slug, localeKey}) => {
          const name = t(localeKey)

          if (href) {
            return (
              <Link href={href} key={slug}>
                <a
                  title={t('breadcrumb.back-to', {section: name})}
                  className="text-neutral-400/30 after:content-['\00a0/\00a0'] hover:text-neutral-300/60 hover:after:text-neutral-400/30"
                >
                  {name}
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
