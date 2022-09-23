import Link from 'next/link'
import LogoIcon from '../assets/icons/logo.svg'

export default function Header() {
  return (
    <header>
      <div className="flex justify-center p-6">
        <Link href="/">
          <a title="Kiko Ruiz">
            <LogoIcon className="w-24 fill-neutral-300 transition-colors ease-in-out hover:fill-orange-200" />
          </a>
        </Link>
      </div>
    </header>
  )
}
