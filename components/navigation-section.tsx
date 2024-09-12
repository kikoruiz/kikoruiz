import {MouseEvent, useEffect} from 'react'
import Link, {LinkProps} from 'next/link'
import {useMediaQuery} from 'react-responsive'
import useTranslation from 'next-translate/useTranslation'
import NavigationCategoriesList from './navigation-categories-list'
import NavigationSectionItem from './navigation-section-item'
import {SECTIONS} from 'config'
import {getSlug, screens} from 'lib/utils'

type Section = (typeof SECTIONS)[number]
type ExpandedSections = (typeof SECTIONS)[number]['id'][]

interface NavigationSectionProps {
  path: string
  section: Section
  activeSection: Section
  expandedSections: ExpandedSections
  setExpandedSections: (expandedSections: ExpandedSections) => void
  isMenuOpen: boolean
  setIsMenuOpen: (isMenuOpen: boolean) => void
  onClick: LinkProps['onClick']
}

const {sm} = screens

export default function NavigationSection({
  path,
  section,
  activeSection,
  expandedSections,
  setExpandedSections,
  isMenuOpen,
  setIsMenuOpen,
  onClick
}: NavigationSectionProps) {
  const {t} = useTranslation()
  const href = `/${getSlug(t(`sections.${section.id}.name`))}`
  const isActiveSection = path.includes(href)
  const isActualSection = path === href
  const hasCategories = Boolean(section.categories)
  const isSectionExpanded = expandedSections.includes(section.id)
  const sectionName = t(`sections.${section.id}.name`)
  const sectionClassName = `relative px-6 font-bold after:absolute after:left-0 after:block after:from-transparent ${
    isMenuOpen
      ? 'mx-3 py-3 after:top-0 after:h-full after:w-[1px] after:bg-gradient-to-b cursor-pointer'
      : 'py-2 after:bottom-0 after:h-[1px] after:w-full after:bg-gradient-to-r'
  } ${isActualSection ? 'sm:hover:cursor-default' : 'block'} ${
    isActiveSection
      ? 'text-orange-300 after:via-orange-300'
      : 'after:via-transparent group-hover:text-orange-200 group-hover:after:via-orange-200'
  }${
    hasCategories && !isMenuOpen
      ? ' group-hover:before:absolute group-hover:before:bottom-0 group-hover:before:left-[-0.5rem] group-hover:before:block group-hover:before:h-full group-hover:before:w-[calc(100%+1rem)] group-hover:before:rounded-t group-hover:before:bg-neutral-800 group-hover:before:drop-shadow-md'
      : ''
  }`
  const content = (
    <NavigationSectionItem
      name={sectionName}
      section={section}
      hasCategories={hasCategories}
      isExpanded={!isMenuOpen || isSectionExpanded}
    />
  )

  useMediaQuery({maxWidth: sm - 1}, undefined, handleMobileDownChange)
  useMediaQuery({minWidth: sm}, undefined, handleMobileUpChange)

  function handleMobileDownChange(matches: boolean) {
    if (matches && activeSection) {
      setExpandedSections([activeSection.id])
    }
  }

  function handleMobileUpChange(matches: boolean) {
    if (matches) {
      setIsMenuOpen(false)
      setExpandedSections([])
    }
  }

  function handleSectionClick(event: MouseEvent) {
    const section = SECTIONS.find(
      ({id}) =>
        t(`sections.${id}.name`) === event.currentTarget.getAttribute('title')
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

  useEffect(() => {
    setExpandedSections(activeSection ? [activeSection.id] : [])
  }, [activeSection, setExpandedSections])

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
          onClick={onClick}
        >
          {content}
        </Link>
      )}

      {hasCategories && (
        <NavigationCategoriesList
          path={path}
          section={section}
          isMenuOpen={isMenuOpen}
          isSectionExpanded={isSectionExpanded}
          onCategoryClick={onClick}
        />
      )}
    </li>
  )
}
