import Link from 'next/link'
import {useRouter} from 'next/router'
import {SECTIONS} from '../config/index.js'

export default function Navbar() {
  const {asPath} = useRouter()

  return (
    <nav className="flex">
      <ul className="flex justify-center self-center">
        {SECTIONS.map(({name, slug}) => {
          const href = `/${slug}`
          const isActiveSection = asPath.includes(href)
          const isActualSection = asPath === href
          const content = (
            <a
              title={name}
              className={`relative block px-6 py-3 after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-transparent font-extrabold${
                isActualSection ? ' hover:cursor-default' : ''
              }${
                isActiveSection
                  ? ' text-orange-300 after:via-orange-300'
                  : ' hover:text-orange-200 hover:after:via-orange-200'
              }`}
            >
              <span>{name.toLowerCase()}</span>
            </a>
          )

          return (
            <li key={slug}>
              {isActualSection ? content : <Link href={href}>{content}</Link>}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
