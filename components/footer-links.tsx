import {LEGAL_PAGES} from 'config'
import {getSlug} from 'lib/utils'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'

export default function FooterLinks() {
  const {t} = useTranslation()

  return (
    <div className="flex">
      <div>
        <header className="font-bold mb-1.5">{t('legal.name')}</header>

        <ul>
          {LEGAL_PAGES.map(slug => {
            const pageName = t(`legal.pages.${slug}`)
            const href = `/${getSlug(pageName)}`

            return (
              <li key={slug} className='font-light text-neutral-300/60 hover:text-neutral-300 transition-colors'>
                <Link href={href}>{pageName}</Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
