import {useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useMediaQuery} from 'react-responsive'
import useTranslation from 'next-translate/useTranslation'
import {SECTIONS} from '../config/index.js'
import {screens} from '../lib/utils.js'
import IconChevronDown from '../assets/icons/chevron-down.svg'

const {sm} = screens

export default function Navbar() {
  const {t} = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {asPath} = useRouter()

  useMediaQuery({minWidth: sm}, undefined, handleMediaQueryChange)

  function handleMediaQueryChange(matches) {
    if (matches) setIsMenuOpen(false)
  }

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className={`my-auto${isMenuOpen ? ' relative' : ''}`}>
      <button
        aria-hidden="true"
        tabIndex="-1"
        className={`fixed inset-0 top-0 left-0 h-screen w-screen bg-neutral-900/60 backdrop-blur transition-opacity sm:hidden ${
          isMenuOpen
            ? 'opacity-1 touch-none'
            : 'pointer-events-none touch-auto opacity-0'
        }`}
        onClick={isMenuOpen ? toggleMenu : () => {}}
      ></button>

      <button
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        className="relative flex h-11 w-11 rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 hover:text-neutral-300 focus:outline-none sm:hidden"
        onClick={toggleMenu}
      >
        <span className="sr-only">
          {isMenuOpen ? 'Close menu' : 'Open menu'}
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

      <ul
        className={`${
          isMenuOpen
            ? 'absolute right-0 top-full z-20 mt-3 w-[calc(100vw-1.5rem)] rounded-md bg-neutral-800 py-4 drop-shadow-lg'
            : 'hidden sm:flex'
        }`}
      >
        {SECTIONS.map(section => {
          const href = `/${t(`sections.${section.id}.slug`)}`
          const isActiveSection = asPath.includes(href)
          const isActualSection = asPath === href
          const hasCategories = section.categories
          const sectionName = t(`sections.${section.id}.name`)
          const sectionClassName = `relative px-6 font-extrabold ${
            isMenuOpen
              ? 'mx-3 py-3 after:absolute after:top-0 after:left-0 after:block after:h-full after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-transparent'
              : 'py-2 after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-transparent'
          } ${isActualSection ? 'hover:cursor-default' : 'block'}${
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
                <IconChevronDown className="ml-2 h-[12px] w-[12px]" />
              )}
            </div>
          )

          return (
            <li
              key={section.id}
              className={`group ${
                isMenuOpen ? 'first:mt-1 last:mb-2' : 'relative'
              }`}
            >
              {isActualSection ? (
                <div title={sectionName} className={sectionClassName}>
                  {content}
                </div>
              ) : (
                <Link href={href}>
                  <a
                    title={sectionName}
                    className={sectionClassName}
                    onClick={isMenuOpen ? toggleMenu : () => {}}
                  >
                    {content}
                  </a>
                </Link>
              )}
              {hasCategories && (
                <ul
                  className={`group-hover:block${
                    isMenuOpen
                      ? ''
                      : ' absolute left-2/4 hidden w-[calc(100%+1rem)] -translate-x-1/2 rounded-b bg-neutral-800 pt-3 drop-shadow-md'
                  }`}
                >
                  {section.categories.map(category => {
                    const categoryHref = `/${t(
                      `sections.${section.id}.slug`
                    )}/${t(`${section.localePrefix}${category.id}.slug`)}`
                    const isActualCategory = asPath === categoryHref
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
                          <Link href={categoryHref}>
                            <a
                              title={categoryName}
                              className={categoryClassName}
                              onClick={isMenuOpen ? toggleMenu : () => {}}
                            >
                              {categoryName}
                            </a>
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
    </nav>
  )
}
