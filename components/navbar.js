import Link from 'next/link'
import {useRouter} from 'next/router'
import {useMenuContext} from '../context/menu.js'
import {SECTIONS} from '../config/index.js'
import {useMediaQuery} from 'react-responsive'
import resolveConfig from 'tailwindcss/resolveConfig.js'
import tailwindConfig from '../tailwind.config.js'

const config = resolveConfig(tailwindConfig)
const {screens} = config.theme

export default function Navbar() {
  const {isMenuOpen, setIsMenuOpen} = useMenuContext()
  const {asPath} = useRouter()

  useMediaQuery(
    {minWidth: Number(screens.sm.split('px')[0])},
    undefined,
    handleMediaQueryChange
  )

  function handleMediaQueryChange(matches) {
    if (matches) setIsMenuOpen(false)
  }

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav
      className={`my-auto${
        isMenuOpen
          ? ' relative before:fixed before:top-0 before:left-0 before:h-screen before:w-screen before:bg-neutral-900/75'
          : ''
      }`}
    >
      <button
        className="relative flex h-10 w-10 rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 hover:text-neutral-300 focus:outline-none sm:hidden"
        onClick={toggleMenu}
      >
        <span className="sr-only">Open main menu</span>
        <div className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 transform">
          <span
            aria-hidden="true"
            className={`absolute flex h-0.5 w-5 transform bg-current transition duration-500 ease-in-out ${
              isMenuOpen ? 'rotate-45' : '-translate-y-1.5'
            }`}
          ></span>
          <span
            aria-hidden="true"
            className={`absolute flex h-0.5 w-5 transform bg-current transition duration-500 ease-in-out${
              isMenuOpen ? ' opacity-0' : ''
            }`}
          ></span>
          <span
            aria-hidden="true"
            className={`absolute flex h-0.5 w-5 transform bg-current transition duration-500 ease-in-out ${
              isMenuOpen ? '-rotate-45' : 'translate-y-1.5'
            }`}
          ></span>
        </div>
      </button>

      <ul
        className={`${
          isMenuOpen
            ? 'absolute right-0 top-full z-20 mt-3 w-[calc(100vw-3rem)] rounded-md bg-neutral-800 p-3 drop-shadow-lg'
            : 'hidden sm:flex'
        }`}
      >
        {SECTIONS.map(({name, slug}) => {
          const href = `/${slug}`
          const isActiveSection = asPath.includes(href)
          const isActualSection = asPath === href
          const content = (
            <a
              title={name}
              className={`relative block px-6 py-2 after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-transparent font-extrabold${
                isActualSection ? ' hover:cursor-default' : ''
              }${
                isActiveSection
                  ? ' text-orange-300 after:via-orange-300'
                  : ' hover:text-orange-200 hover:after:via-orange-200'
              }`}
              onClick={isMenuOpen && !isActualSection ? toggleMenu : () => {}}
            >
              <span>{name.toLowerCase()}</span>
            </a>
          )
          const itemProps = {
            key: slug,
            ...(isMenuOpen && {className: 'first:mt-1 last:mb-2'})
          }

          return (
            // eslint-disable-next-line
            <li {...itemProps}>
              {isActualSection ? content : <Link href={href}>{content}</Link>}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
