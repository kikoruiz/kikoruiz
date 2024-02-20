import {useRouter} from 'next/router'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {getSlug} from 'lib/utils'
import {LEGAL_PAGES} from 'config'

export default function FooterLinks() {
  const {pathname} = useRouter()
  const {t} = useTranslation()

  return (
    <div className="flex">
      <div>
        <header className="font-bold mb-1.5">{t('legal.name')}</header>

        <ul>
          {LEGAL_PAGES.map(slug => {
            const pageName = t(`legal.pages.${slug}`)
            const href = `/${getSlug(pageName)}`
            const defaultPathname = `/${getSlug(t(`commonES:legal.pages.${slug}`))}`
            const isCurrentPage = pathname === defaultPathname

            return (
              <li key={slug} className="font-light">
                {isCurrentPage ? (
                  <span className="text-orange-300">{pageName}</span>
                ) : (
                  <Link
                    href={href}
                    className="text-neutral-300/60 hover:text-neutral-300 transition-colors"
                  >
                    {pageName}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
