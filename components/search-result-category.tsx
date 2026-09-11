import {ComponentType, ReactNode, SVGProps} from 'react'

interface SearchResultCategoryProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  children: ReactNode
}

export default function SearchResultCategory({
  icon: Icon,
  title,
  children
}: SearchResultCategoryProps) {
  return (
    <section>
      <header className="flex cursor-default select-none items-center gap-1.5 mx-6 pb-3 pt-6 text-lg font-extralight uppercase text-neutral-600 border-b border-neutral-700">
        <Icon className="w-6 fill-current" />
        {title}
      </header>

      <ul>{children}</ul>
    </section>
  )
}

SearchResultCategory.displayName = 'SearchResultCategory'
