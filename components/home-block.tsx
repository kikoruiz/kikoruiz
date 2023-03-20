import {ReactNode} from 'react'

export default function HomeBlock({children, className = ''}: HomeBlockProps) {
  return (
    <section className={`mt-12${className ? ` ${className}` : ''}`}>
      {children}
    </section>
  )
}

interface HomeBlockProps {
  children: ReactNode
  className?: string
}
