import Link from 'next/link'
import {useRouter} from 'next/router'
import {SECTIONS} from '../config/index.js'

export default function Navbar() {
  const {asPath} = useRouter()

  return (
    <nav className="sticky top-0 z-10 w-full bg-neutral-900/75 backdrop-blur">
      <ul className="flex justify-center">
        {SECTIONS.map(({name, slug}) => {
          const href = `/${slug}`

          return (
            <li key={slug}>
              <Link href={href}>
                <a
                  className={`block border-b border-transparent px-6 py-3 font-extrabold hover:border-orange-200 hover:text-orange-200${
                    asPath === href ? ' border-orange-300 text-orange-300' : ''
                  }`}
                >
                  <span>{name.toLowerCase()}</span>
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
