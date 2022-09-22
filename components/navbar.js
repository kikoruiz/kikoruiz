import Link from 'next/link'
import {SECTIONS} from '../config/index.js'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 w-full bg-neutral-900/75 backdrop-blur">
      <ul className="flex justify-center">
        {SECTIONS.map(({name, slug}) => (
          <li key={slug}>
            <Link href={`/${slug}`}>
              <a className="block border-b border-transparent px-6 py-3 font-extrabold hover:border-orange-200 hover:text-orange-200">
                {name.toLowerCase()}.
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
