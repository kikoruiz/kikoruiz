import {useRouter} from 'next/router'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {getSlug} from 'lib/utils'
import {LEGAL_PAGES, SECTIONS} from 'config'
import {Alternate} from 'types'
import commonES from '../locales/es/common.json'

interface FooterGroup {
  id: string
  name: string
  href?: string
  links: {id: string; name: string; href: string; isCurrent?: boolean}[]
}

export default function FooterLinks({alternates}: {alternates?: Alternate[]}) {
  const {pathname, locale, defaultLocale} = useRouter()
  const {t} = useTranslation()
  // The canonical address of the page is the one place that always says where
  // we are in the language being read, even when the URL is a rewrite of a
  // Spanish route, so the links are compared against it rather than against
  // the router's own path.
  const currentHref = alternates?.find(
    alternate => alternate.locale === locale
  )?.href
  const localePrefix = locale === defaultLocale ? '' : `/${locale}`
  const currentPath = currentHref
    ? new URL(currentHref).pathname.replace(
        new RegExp(`^${localePrefix}(?=/|$)`),
        ''
      ) || '/'
    : null
  const sectionGroups: FooterGroup[] = SECTIONS.map(section => {
    const name = t(`sections.${section.id}.name`)
    const href = `/${getSlug(name)}`

    return {
      id: section.id,
      name,
      href,
      links: (section.categories ?? []).map(({id}) => {
        const categoryName = t(`${section.localePrefix}${id}.name`)
        const categoryHref = `${href}/${getSlug(categoryName)}`

        return {
          id,
          name: categoryName,
          href: categoryHref,
          isCurrent: currentPath === categoryHref
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

  // From a tablet up the groups sit in three columns that are laid out by hand
  // rather than left to the browser's height balancing, which moved a whole
  // group to another column whenever a link changed size: the gallery on its
  // own, the shop with the blog, and about me with the legal pages. A group
  // that is in none of them still shows, in a column of its own. Below `md`
  // the columns dissolve and the groups flow into two balanced ones, so a
  // short group shares a column instead of leaving the others long. From `lg`
  // the footer is a single row again, where each column is only as wide as its
  // longest link and the rest goes to the social icons. Only at `xl` is there
  // room for every group in a row of its own. The block must not shrink in a
  // row or the longest legal titles wrap. Each gap is padding on the group
  // because a margin at the top of a column is kept by some browsers and
  // dropped by others, and the negative margin takes back the padding the last
  // group of each column leaves at the bottom.
  const groups = [...sectionGroups, legalGroup]
  const tabletColumns = [['gallery'], ['store', 'blog'], ['about-me', 'legal']]
  const placed = tabletColumns.flat()
  const columns = [
    ...tabletColumns.map(ids => groups.filter(({id}) => ids.includes(id))),
    groups.filter(({id}) => !placed.includes(id))
  ].filter(column => column.length > 0)

  return (
    <div className="-mb-9 w-full columns-2 gap-6 md:grid md:columns-auto md:grid-cols-3 lg:flex lg:w-auto lg:shrink-0 lg:gap-x-9 xl:mb-0 xl:gap-x-12">
      {columns.map(column => (
        <div
          key={column.map(({id}) => id).join()}
          className="contents md:flex md:flex-col xl:contents"
        >
          {column.map(({id, name, href, links}) => (
            <div key={id} className="break-inside-avoid-column pb-9 xl:pb-0">
              <header className="mb-3 font-bold text-neutral-100">
                {href && currentPath !== href ? (
                  <Link
                    href={href}
                    title={name}
                    className="transition-colors hover:text-neutral-300"
                  >
                    {name}
                  </Link>
                ) : (
                  // On its own page a heading is no longer a way to go
                  // anywhere, and it keeps looking the same: only the child
                  // links are marked.
                  <span
                    aria-current={currentPath === href ? 'page' : undefined}
                  >
                    {name}
                  </span>
                )}
              </header>

              {links.length > 0 && (
                <ul className="space-y-3 text-sm">
                  {links.map(link => (
                    <li key={link.id} className="font-light">
                      {link.isCurrent ? (
                        <span aria-current="page" className="text-neutral-300">
                          {link.name}
                        </span>
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
      ))}
    </div>
  )
}

FooterLinks.displayName = 'FooterLinks'
