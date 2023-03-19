import {ReactNode} from 'react'
import HomeBlock from './home-block'

export default function HomeModule({
  title,
  children,
  className = ''
}: HomeModuleProps) {
  return (
    <HomeBlock
      className={`rounded bg-gradient-to-t from-neutral-800 to-neutral-900 hover:border-orange-300 lg:from-neutral-900 lg:to-neutral-900/90${
        className ? ` ${className}` : ''
      }`}
    >
      <header className="mx-3 border-b border-neutral-600/30 py-4 md:py-6">
        <h2 className="bg-gradient-to-t from-orange-300 via-orange-300/80 to-orange-300/40 bg-clip-text text-3xl font-extralight leading-tight text-transparent drop-shadow md:text-5xl md:leading-tight">
          {title}
        </h2>
      </header>

      {children}
    </HomeBlock>
  )
}

interface HomeModuleProps {
  title: string
  children: ReactNode
  className?: string
}
