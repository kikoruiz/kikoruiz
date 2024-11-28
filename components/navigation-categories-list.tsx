import Link, {LinkProps} from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {SECTIONS} from 'config'
import {getSlug} from 'lib/utils'

interface NavigationCategoriesListProps {
  path: string
  section: (typeof SECTIONS)[number]
  isMenuOpen: boolean
  isSectionExpanded: boolean
  onCategoryClick: LinkProps['onClick']
}

type NavigationCategory =
  NavigationCategoriesListProps['section']['categories'][number]

export default function NavigationCategoriesList({
  path,
  section,
  isMenuOpen,
  isSectionExpanded,
  onCategoryClick
}: NavigationCategoriesListProps) {
  const {t} = useTranslation()

  return (
    <ul
      className={`sm:hidden sm:group-hover:block${
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
            {isActualCategory ? (
              <span title={categoryName} className={categoryClassName}>
                {categoryName}
              </span>
            ) : (
              <Link
                href={categoryHref}
                title={categoryName}
                className={categoryClassName}
                onClick={onCategoryClick}
              >
                {categoryName}
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}

NavigationCategoriesList.displayName = 'NavigationCategoriesList'
