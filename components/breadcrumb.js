import Link from 'next/link'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {fromSectionToBreadcrumbItems} from '../lib/mappers.js'

export default function Breadcrumb({section, post, tag}) {
  const {t} = useTranslation()
  const router = useRouter()
  const {query} = router
  const items = fromSectionToBreadcrumbItems({
    section,
    category: query.slug,
    post,
    tag,
    t
  })

  return items.length > 0 ? (
    <div className="bg-neutral-800/75">
      <div className="container mx-auto py-2 px-6">
        {items.map(({href, id, name}) => {
          if (href) {
            return (
              <Link href={href} key={id}>
                <a
                  title={t('navigation.back-to', {section: name})}
                  className="font-light text-neutral-300/30 after:content-['\00a0/\00a0'] hover:text-neutral-300/60 hover:after:text-neutral-400/30"
                >
                  {name}
                </a>
              </Link>
            )
          }

          return (
            <span className="font-bold text-orange-300/60" key={id}>
              {name}
            </span>
          )
        })}
      </div>
    </div>
  ) : null
}
