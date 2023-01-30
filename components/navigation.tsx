import {useEffect, useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useMediaQuery} from 'react-responsive'
import useTranslation from 'next-translate/useTranslation'
import {SECTIONS} from 'config'
import {getSlug, screens} from 'lib/utils'
import IconChevronDown from 'assets/icons/chevron-down.svg'
import IconMagnifyingGlass from 'assets/icons/magnifying-glass.svg'
import SearchBar from './search-bar'

const {sm} = screens

export default function Navigation({section, hasHero}: NavigationProps) {
  const {t} = useTranslation()
  const router = useRouter()
  const {asPath} = router
  let path = section
    ? asPath.replace(
        /(\/[a-z,-]+)/,
        `/${getSlug(t(`sections.${section}.name`))}`
      )
    : asPath
  if (path.includes('#')) path = path.split('#')[0]
  const activeSection = SECTIONS.find(({id, categories}) => {
    const sectionSlug = getSlug(t(`sections.${id}.name`))

    return path.includes(sectionSlug) && categories
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState(
    activeSection ? [activeSection.id] : []
  )

  useMediaQuery({maxWidth: sm - 1}, undefined, handleMobileDownChange)
  useMediaQuery({minWidth: sm}, undefined, handleMobileUpChange)

  function handleMobileUpChange(matches) {
    if (matches) {
      setIsMenuOpen(false)
      setExpandedSections([])
    }
  }

  function handleMobileDownChange(matches) {
    if (matches && activeSection) {
      setExpandedSections([activeSection.id])
    }
  }

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen)
  }

  function toggleSearch() {
    setIsSearchBarOpen(!isSearchBarOpen)
  }

  function handleSectionClick(event) {
    const section = SECTIONS.find(
      ({id}) => t(`sections.${id}.name`) === event.currentTarget.title
    )
    const hasCategories = Boolean(section.categories)
    const expandedSectionsWithCategories = hasCategories
      ? [...expandedSections, section.id]
      : expandedSections
    const newExpandedSections = expandedSections.includes(section.id)
      ? expandedSections.filter(id => id !== section.id)
      : expandedSectionsWithCategories

    setExpandedSections([...new Set(newExpandedSections)])
  }

  function handleElementClick(event) {
    const section = SECTIONS.find(
      ({id}) => t(`sections.${id}.name`) === event.currentTarget.title
    )

    if (isMenuOpen) toggleMenu()
    if (isSearchBarOpen) toggleSearch()
    if (section?.id) setExpandedSections([])
  }

  useEffect(() => {
    setExpandedSections(activeSection ? [activeSection.id] : [])
  }, [activeSection])

  return (
    <nav className={`my-auto flex gap-3${isMenuOpen ? ' relative' : ''}`}>
      <ul
        className={`${
          isMenuOpen
            ? 'absolute right-0 top-full z-20 mt-3 w-[calc(100vw-1.5rem)] rounded-md bg-neutral-800 py-4 drop-shadow-lg'
            : 'hidden sm:mt-[3px] sm:flex'
        }`}
      >
        {SECTIONS.map(section => {
          const href = `/${getSlug(t(`sections.${section.id}.name`))}`
          const isActiveSection = path.includes(href)
          const isActualSection = path === href
          const hasCategories = Boolean(section.categories)
          const isSectionExpanded = expandedSections.includes(section.id)
          const sectionName = t(`sections.${section.id}.name`)
          const sectionClassName = `relative px-6 font-bold ${
            isMenuOpen
              ? 'mx-3 py-3 after:absolute after:top-0 after:left-0 after:block after:h-full after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-transparent cursor-pointer'
              : 'py-2 after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-transparent'
          } ${isActualSection ? 'sm:hover:cursor-default' : 'block'}${
            isActiveSection
              ? ' text-orange-300 after:via-orange-300'
              : ' group-hover:text-orange-200 group-hover:after:via-orange-200'
          }${
            hasCategories && !isMenuOpen
              ? ' group-hover:before:absolute group-hover:before:bottom-0 group-hover:before:left-[-0.5rem] group-hover:before:block group-hover:before:h-full group-hover:before:w-[calc(100%+1rem)] group-hover:before:rounded-t group-hover:before:bg-neutral-800 group-hover:before:drop-shadow-md'
              : ''
          }`
          const content = (
            <div className="relative flex items-center">
              <span>{sectionName}</span>
              {hasCategories && (
                <>
                  <IconChevronDown
                    className={`ml-2 h-[12px] w-[12px] transition-transform ease-in-out${
                      !isMenuOpen || isSectionExpanded
                        ? ' -rotate-180 sm:rotate-0 sm:group-hover:-rotate-180'
                        : ''
                    }`}
                  />
                </>
              )}
            </div>
          )

          return (
            <li
              key={section.id}
              className={`group ${
                isMenuOpen
                  ? 'first:mt-1 last:mb-2'
                  : `relative ${
                      isSectionExpanded && isMenuOpen ? 'z-10' : 'hover:z-10'
                    }`
              }`}
            >
              {isActualSection || (isMenuOpen && hasCategories) ? (
                <div
                  title={sectionName}
                  className={sectionClassName}
                  onClick={isMenuOpen ? handleSectionClick : null}
                >
                  {content}
                </div>
              ) : (
                <Link
                  href={href}
                  title={sectionName}
                  className={sectionClassName}
                  onClick={handleElementClick}
                >
                  {content}
                </Link>
              )}
              {hasCategories && (
                <ul
                  className={`sm:hidden sm:group-hover:block${
                    isMenuOpen
                      ? ''
                      : ' absolute left-2/4 w-[calc(100%+1rem)] -translate-x-1/2 rounded-b bg-neutral-800 pt-3 drop-shadow-md'
                  } ${isSectionExpanded ? 'block' : 'hidden'}`}
                >
                  {section.categories.map(category => {
                    const categorySlug = getSlug(
                      t(`${section.localePrefix}${category.id}.name`)
                    )
                    const categoryHref = `/${getSlug(
                      t(`sections.${section.id}.name`)
                    )}/${categorySlug}`
                    const isActualCategory = path === categoryHref
                    const categoryName = t(
                      `${section.localePrefix}${category.id}.name`
                    )
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
                          <span
                            title={categoryName}
                            className={categoryClassName}
                          >
                            {categoryName}
                          </span>
                        ) : (
                          <Link
                            href={categoryHref}
                            title={categoryName}
                            className={categoryClassName}
                            onClick={handleElementClick}
                          >
                            {categoryName}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>

      <button
        aria-label={t('navigation.search')}
        title={t('navigation.search')}
        className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-t text-neutral-400 hover:text-orange-200 focus:outline-none ${
          hasHero ? 'from-neutral-300/10' : 'from-neutral-800'
        }`}
        onClick={toggleSearch}
        onBlur={event => event.preventDefault()}
      >
        <span className="sr-only">{t('navigation.search')}</span>
        <div className="w-5">
          <IconMagnifyingGlass />
        </div>
      </button>

      <button
        aria-label={
          isMenuOpen ? t('navigation.close-menu') : t('navigation.open-menu')
        }
        className={`relative flex h-11 w-11 rounded-full bg-gradient-to-t text-neutral-400 hover:text-neutral-300 focus:outline-none sm:hidden ${
          hasHero ? 'from-neutral-300/10' : 'from-neutral-800'
        }${isMenuOpen ? ' z-10' : ''}`}
        onClick={toggleMenu}
      >
        <span className="sr-only">
          {isMenuOpen ? t('navigation.close-menu') : t('navigation.open-menu')}
        </span>
        <div className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 transform">
          <span
            aria-hidden="true"
            className={`absolute flex h-0.5 w-5 transform bg-current transition duration-300 ease-in-out ${
              isMenuOpen ? 'rotate-45' : '-translate-y-1.5'
            }`}
          ></span>
          <span
            aria-hidden="true"
            className={`absolute flex h-0.5 w-5 transform bg-current transition duration-300 ease-in-out${
              isMenuOpen ? ' opacity-0' : ''
            }`}
          ></span>
          <span
            aria-hidden="true"
            className={`absolute flex h-0.5 w-5 transform bg-current transition duration-300 ease-in-out ${
              isMenuOpen ? '-rotate-45' : 'translate-y-1.5'
            }`}
          ></span>
        </div>
      </button>

      <button
        aria-hidden="true"
        tabIndex={-1}
        className={`fixed inset-0 h-screen w-screen bg-neutral-900/60 backdrop-blur transition-opacity ${
          isMenuOpen || isSearchBarOpen
            ? 'opacity-1 touch-none'
            : 'pointer-events-none touch-auto opacity-0 sm:hidden'
        }`}
        onClick={handleElementClick}
      ></button>

      <SearchBar isOpen={isSearchBarOpen} setIsOpen={setIsSearchBarOpen} />
    </nav>
  )
}

interface NavigationProps {
  section: string
  hasHero?: boolean
}
