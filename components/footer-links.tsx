import {LEGAL_PAGES} from 'config'
import {getSlug} from 'lib/utils'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'

export default function FooterLinks({}) {
  const {t} = useTranslation()

  return (
    <div className="flex">
      <div>
        <header className="font-bold">{t('legal.name')}</header>

        <ul>
          {LEGAL_PAGES.map(slug => {
            const pageName = t(`legal.pages.${slug}`)
            return (
              <li key={slug}>
                <Link href={getSlug(pageName)}>{pageName}</Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
