import {MouseEvent, useEffect, useState} from 'react'
import {flushSync} from 'react-dom'
import Link, {LinkProps} from 'next/link'
import {useMediaQuery} from 'hooks/use-media-query'
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
  // A hovered dropdown has no reason to close once a link inside it is
  // followed, since the pointer is left exactly where it was and the page
  // underneath changes without it. Dismissing it by hand is the only way out,
  // and leaving the section is what arms the hover again.
  const [isDismissed, setIsDismissed] = useState(false)
  const href = `/${getSlug(t(`sections.${section.id}.name`))}`
  const isActiveSection = path.includes(href)
  const isActualSection = path === href
  const hasCategories = Boolean(section.categories)
  const isSectionExpanded = expandedSections.includes(section.id)
  const sectionName = t(`sections.${section.id}.name`)
  // Only a section carrying a list gets a tab, which is there to read as one
  // piece with the list hanging from it. It is laid out from the start and
  // merely left transparent, since a pseudo-element that only comes into being
  // on hover has no colour to travel from.
  const tabClassName =
    hasCategories && !isMenuOpen
      ? ` before:absolute before:bottom-0 before:left-[-0.5rem] before:block before:h-full before:w-[calc(100%+1rem)] before:rounded-t before:bg-transparent before:transition-[background-color,box-shadow] before:duration-300${
          isDismissed
            ? ''
            : ' group-hover:before:bg-neutral-800 group-hover:before:shadow-md'
        }`
      : ''
  // The underline fades on its own opacity because a gradient is not something
  // CSS can travel between, so its colour stays put and only its presence moves.
  const sectionClassName = `relative px-6 font-bold transition-colors duration-300 after:absolute after:left-0 after:block after:from-transparent after:transition-opacity after:duration-300 ${
    isMenuOpen
      ? 'mx-3 py-3 after:top-0 after:h-full after:w-[1px] after:bg-gradient-to-b cursor-pointer'
      : 'py-2 after:bottom-0 after:h-[1px] after:w-full after:bg-gradient-to-r'
  } ${isActualSection ? 'sm:hover:cursor-default' : 'block'} ${
    isActiveSection
      ? 'text-orange-300 after:via-orange-300'
      : `after:via-orange-200 after:opacity-0${
          isDismissed
            ? ''
            : ' group-hover:text-orange-200 group-hover:after:opacity-100'
        }`
  }${tabClassName}`
  const content = (
    <NavigationSectionItem
      name={sectionName}
      section={section}
      hasCategories={hasCategories}
      isExpanded={!isMenuOpen || isSectionExpanded}
      isDismissed={isDismissed}
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

  function handleNavigation(event: MouseEvent<HTMLAnchorElement>) {
    // Next batches this together with the route change that follows in the
    // same click, so on a slow enough machine the old hover only lets go once
    // the new page is ready, a beat later than the click itself. Flushing it
    // first is what keeps the two from being tied together.
    flushSync(() => {
      setIsDismissed(true)
    })
    onClick?.(event)
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
      onMouseLeave={() => {
        setIsDismissed(false)
      }}
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
          onClick={handleNavigation}
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
          isDismissed={isDismissed}
          onCategoryClick={handleNavigation}
        />
      )}
    </li>
  )
}

NavigationSection.displayName = 'NavigationSection'
