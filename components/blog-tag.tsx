import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {Tag} from 'types'

export default function BlogTag({
  id,
  href,
  name,
  size = 'small'
}: BlogTagProps) {
  const {t} = useTranslation('blog')
  const isLarge = size === 'large'

  return (
    <Link
      href={href}
      title={t('post.tag', {tag: name})}
      className={`relative flex rotate-12 rounded-r rounded-l-3xl border p-2 pl-6 font-medium text-neutral-900 transition-transform duration-300 ease-in-out before:absolute before:left-2 before:top-1/2 before:mt-[-4.5px] before:h-[9px] before:w-[9px] before:rounded-full before:border before:bg-neutral-900 last:ml-0 hover:translate-x-1 hover:rotate-3 ${
        isLarge ? '-ml-3' : '-ml-6'
      } ${tagClassName(id)}`}
    >
      {name}
    </Link>
  )
}

function tagClassName(tag) {
  switch (tag) {
    case 'photography':
      return 'bg-red-400/60 hover:bg-red-400 border-red-900 before:border-red-900'
    case 'personal':
      return 'bg-blue-400/60 hover:bg-blue-400 border-blue-900 before:border-blue-900'
    default:
      return 'bg-orange-400/60 hover:bg-orange-400 border-orange-900 before:border-orange-900'
  }
}

interface BlogTagProps extends Tag {
  size?: 'small' | 'large'
}
