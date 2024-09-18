import {MouseEvent, useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {
  HERO_IMAGES,
  LEGAL_PAGES,
  SECTIONS,
  SIMPLE_PAGES,
  SPECIAL_SUBSECTIONS
} from 'config'
import {getRandomElement, getSlug} from 'lib/utils'
import NavigationSection from './navigation-section'
import NavigationButton from './navigation-button'
import SearchBar from './search-bar'
import useHeroImageContext from 'contexts/HeroImage'
import IconMagnifyingGlass from 'assets/icons/magnifying-glass.svg'
import IconSwatch from 'assets/icons/swatch.svg'
import IconArrowPath from 'assets/icons/arrow-path.svg'
import IconEye from 'assets/icons/eye.svg'
import IconEyeSlash from 'assets/icons/eye-slash.svg'
import Popover from './popover'
import Button from './button'

interface NavigationProps {
  section: string
  subSection?: string
  hasHero?: boolean
  isMenuOpen: boolean
  setIsMenuOpen: (isMenuOpen: boolean) => void
  isSearchBarOpen: boolean
  setIsSearchBarOpen: (isSearchBarOpen: boolean) => void
}

export default function Navigation({
  section,
  subSection,
  hasHero,
  isMenuOpen,
  setIsMenuOpen,
  isSearchBarOpen,
  setIsSearchBarOpen
}: NavigationProps) {
  const {t} = useTranslation()
  const {heroImage, setHeroImage, showImage, setShowImage} =
    useHeroImageContext()
  const router = useRouter()
  const {asPath} = router
  const isNotSectionPage =
    LEGAL_PAGES.includes(section) ||
    SIMPLE_PAGES.includes(section) ||
    section === 'home'
  const sectionData = SECTIONS.find(({id}) => id === section)
  const isSpecialSubsection = SPECIAL_SUBSECTIONS.includes(subSection)
  let path =
    section && !isNotSectionPage
      ? asPath.replace(
          /(\/[a-z,-]+)(\/[a-z,-]+)?/,
          `/${getSlug(t(`sections.${section}.name`))}${
            subSection && sectionData?.localePrefix && !isSpecialSubsection
              ? `/${getSlug(
                  t(`${sectionData?.localePrefix}${subSection}.name`)
                )}`
              : '$2'
          }`
        )
      : asPath
  if (path.includes('#')) {
    path = path.split('#')[0]
  }
  const activeSection = SECTIONS.find(({id, categories}) => {
    const sectionSlug = getSlug(t(`sections.${id}.name`))

    return sectionSlug && path.includes(sectionSlug) && categories
  })
  const [expandedSections, setExpandedSections] = useState(
    activeSection ? [activeSection.id] : []
  )

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen)
  }

  function toggleSearch() {
    setIsSearchBarOpen(!isSearchBarOpen)
  }

  function handleElementClick(event: MouseEvent) {
    const section = SECTIONS.find(
      ({id}) =>
        t(`sections.${id}.name`) === event.currentTarget.getAttribute('title')
    )

    if (isMenuOpen) toggleMenu()
    if (isSearchBarOpen) toggleSearch()
    if (section?.id) setExpandedSections([])
  }

  useEffect(() => {
    // Set "⌘K" keyboard shortcut.
    function handleKeyDown({code, metaKey}: KeyboardEvent) {
      if (code === 'KeyK' && metaKey && !isSearchBarOpen) {
        setIsSearchBarOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  return (
    <nav
      className={`my-auto flex gap-3${hasHero && !isMenuOpen ? ' text-neutral-100' : ''}${isMenuOpen ? ' relative' : ''}`}
    >
      <ul
        className={`${
          isMenuOpen
            ? 'absolute right-0 top-full z-20 mt-3 w-[calc(100vw-1.5rem)] rounded-md bg-neutral-800 py-4 drop-shadow-lg'
            : 'hidden sm:mt-[3px] sm:flex'
        }`}
      >
        {SECTIONS.map(section => (
          <NavigationSection
            key={section.id}
            path={path}
            section={section}
            activeSection={activeSection}
            expandedSections={expandedSections}
            setExpandedSections={setExpandedSections}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            onClick={handleElementClick}
          />
        ))}
      </ul>

      <NavigationButton
        title={t('navigation.search')}
        className={`items-center justify-center hover:text-orange-200 ${hasHero ? 'from-neutral-300/10' : 'from-neutral-800'}`}
        onClick={toggleSearch}
        onBlur={event => event.preventDefault()}
      >
        <IconMagnifyingGlass />
      </NavigationButton>

      {hasHero && (
        <Popover
          trigger={
            <NavigationButton
              title={t('navigation.switch-hero-image.title')}
              className={`items-center justify-center ${hasHero ? 'from-neutral-300/10' : 'from-neutral-800'}`}
            >
              <IconSwatch />
            </NavigationButton>
          }
          className="flex flex-col gap-1.5"
        >
          <Button
            title={t('navigation.switch-hero-image.randomize')}
            onClick={() => {
              setHeroImage(getRandomElement(HERO_IMAGES, heroImage))
            }}
            className="flex gap-1.5 w-full items-center justify-center"
            size="small"
            intent="accent"
          >
            <IconArrowPath className="size-4" />

            {t('navigation.switch-hero-image.randomize')}
          </Button>

          <Button
            title={t(
              `navigation.switch-hero-image.${showImage ? 'hide' : 'show'}`
            )}
            onClick={() => {
              setShowImage(!showImage)
            }}
            className="flex gap-1.5 w-full items-center justify-center"
            size="small"
            intent="light"
          >
            {showImage ? (
              <IconEyeSlash className="size-4" />
            ) : (
              <IconEye className="size-4" />
            )}

            {t(`navigation.switch-hero-image.${showImage ? 'hide' : 'show'}`)}
          </Button>
        </Popover>
      )}

      <NavigationButton
        title={
          isMenuOpen ? t('navigation.close-menu') : t('navigation.open-menu')
        }
        className={`relative hover:text-neutral-300 sm:hidden ${
          hasHero ? 'from-neutral-300/10' : 'from-neutral-800'
        }${isMenuOpen ? ' z-20' : ''}`}
        onClick={toggleMenu}
      >
        <div className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 transform">
          <span
            aria-hidden="true"
            className={`absolute flex h-0.5 w-5 transform bg-current transition duration-300 ease-in-out ${
              isMenuOpen ? 'rotate-45' : '-translate-y-1.5'
            }`}
          />
          <span
            aria-hidden="true"
            className={`absolute flex h-0.5 w-5 transform bg-current transition duration-300 ease-in-out${
              isMenuOpen ? ' opacity-0' : ''
            }`}
          />
          <span
            aria-hidden="true"
            className={`absolute flex h-0.5 w-5 transform bg-current transition duration-300 ease-in-out ${
              isMenuOpen ? '-rotate-45' : 'translate-y-1.5'
            }`}
          />
        </div>
      </NavigationButton>

      {/* NavigationModalBackdrop */}
      <button
        aria-hidden="true"
        tabIndex={-1}
        className={`fixed z-10 inset-0 h-screen w-screen bg-neutral-900/60 backdrop-blur transition-opacity ${
          isMenuOpen || isSearchBarOpen
            ? 'opacity-1 touch-none'
            : 'pointer-events-none touch-auto opacity-0 sm:hidden'
        }`}
        onClick={handleElementClick}
      />
      <SearchBar isOpen={isSearchBarOpen} setIsOpen={setIsSearchBarOpen} />
    </nav>
  )
}
