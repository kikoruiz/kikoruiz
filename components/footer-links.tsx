import {useRouter} from 'next/router'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {getSlug} from 'lib/utils'
import {LEGAL_PAGES, SECTIONS} from 'config'
import commonES from '../locales/es/common.json'

interface FooterGroup {
  id: string
  name: string
  href?: string
  links: {id: string; name: string; href: string; isCurrent?: boolean}[]
}

export default function FooterLinks() {
  const {pathname} = useRouter()
  const {t} = useTranslation()
  const sectionGroups: FooterGroup[] = SECTIONS.map(section => {
    const name = t(`sections.${section.id}.name`)
    const href = `/${getSlug(name)}`

    return {
      id: section.id,
      name,
      href,
      links: (section.categories ?? []).map(({id}) => {
        const categoryName = t(`${section.localePrefix}${id}.name`)

        return {
          id,
          name: categoryName,
          href: `${href}/${getSlug(categoryName)}`
        }
      })
    }
  })
  const legalName = t('legal.name')
  const legalGroup: FooterGroup = {
    id: 'legal',
    name: legalName,
    href: `/${getSlug(legalName)}`,
    links: LEGAL_PAGES.map(slug => {
      const name = t(`legal.pages.${slug}.name`)

      return {
        id: slug,
        name,
        href: `/${getSlug(name)}`,
        isCurrent: pathname === `/${getSlug(commonES.legal.pages[slug].name)}`
      }
    })
  }

  // Below `lg` the groups flow into balanced columns, two on a phone and three
  // on a tablet, so a short one shares a column instead of leaving the others
  // long. Each gap is padding on the group because a margin at the top of a
  // column is kept by some browsers and dropped by others, and the negative
  // margin takes back the padding the last group of each column leaves at the
  // bottom.
  return (
    <div className="-mb-9 w-full columns-2 gap-6 md:columns-3 lg:mb-0 lg:flex lg:w-auto lg:columns-auto lg:gap-12">
      {[...sectionGroups, legalGroup].map(({id, name, href, links}) => (
        <div key={id} className="break-inside-avoid-column pb-9 lg:pb-0">
          <header className="mb-1.5 font-bold text-neutral-100">
            {href ? (
              <Link
                href={href}
                title={name}
                className="transition-colors hover:text-neutral-300"
              >
                {name}
              </Link>
            ) : (
              name
            )}
          </header>

          {links.length > 0 && (
            <ul>
              {links.map(link => (
                <li key={link.id} className="font-light">
                  {link.isCurrent ? (
                    <span className="text-neutral-300">{link.name}</span>
                  ) : (
                    <Link
                      href={link.href}
                      title={link.name}
                      className="text-neutral-300/60 transition-colors hover:text-neutral-300"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}

FooterLinks.displayName = 'FooterLinks'
