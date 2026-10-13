import Link, {LinkProps} from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {SECTIONS} from 'config'
import {getSlug} from 'lib/utils'

interface NavigationCategoriesListProps {
  path: string
  section: (typeof SECTIONS)[number]
  isMenuOpen: boolean
  isSectionExpanded: boolean
  isDismissed: boolean
  onCategoryClick: LinkProps['onClick']
}

type NavigationCategory =
  NavigationCategoriesListProps['section']['categories'][number]

export default function NavigationCategoriesList({
  path,
  section,
  isMenuOpen,
  isSectionExpanded,
  isDismissed,
  onCategoryClick
}: NavigationCategoriesListProps) {
  const {t} = useTranslation()

  // From `sm` up the list stays laid out and is merely kept out of sight,
  // which is what gives the fade something to run on: `display` cannot be
  // animated, while `visibility` still keeps the links out of the tab order
  // the way `hidden` did. It fades without travelling, since moving against a
  // tab that stays put read as the two coming apart.
  return (
    <ul
      className={`sm:invisible sm:block sm:opacity-0 sm:transition-[opacity,visibility] sm:duration-300${
        isDismissed
          ? ''
          : ' sm:group-hover:visible sm:group-hover:opacity-100'
      }${
        isMenuOpen
          ? ''
          : ' absolute left-2/4 w-[calc(100%+1rem)] -translate-x-1/2 rounded-b bg-neutral-800 pt-3 drop-shadow-md'
      } ${isSectionExpanded ? 'block' : 'hidden'}`}
    >
      {section.categories.map((category: NavigationCategory) => {
        const categorySlug = getSlug(
          t(`${section.localePrefix}${category.id}.name`)
        )
        const categoryHref = `/${getSlug(
          t(`sections.${section.id}.name`)
        )}/${categorySlug}`
        const isActualCategory = path === categoryHref
        const categoryName = t(`${section.localePrefix}${category.id}.name`)
        const categoryClassName = `block py-3 text-sm text-neutral-400 group-last:rounded-b ${
          isMenuOpen ? 'px-12' : 'px-6'
        } ${
          isActualCategory
            ? 'bg-neutral-600/20 text-orange-300 hover:cursor-default'
            : 'hover:bg-neutral-600/30 hover:text-orange-200'
        }`

        return (
          <li key={category.id} className="group">
            <Link
              href={categoryHref}
              title={categoryName}
              className={categoryClassName}
              onClick={isActualCategory ? e => e.preventDefault() : onCategoryClick}
              aria-current={isActualCategory ? 'page' : undefined}
            >
              {categoryName}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

NavigationCategoriesList.displayName = 'NavigationCategoriesList'
