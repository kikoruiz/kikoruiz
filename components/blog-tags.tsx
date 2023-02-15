import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {Tag} from 'types'

export default function BlogTags({tags, isPost = false}: BlogTagsProps) {
  const {t} = useTranslation('blog')

  return (
    <div
      className={`flex items-center gap-3 text-xs ${
        isPost ? 'mt-12 sm:mt-16' : 'mt-9 justify-center'
      }`}
    >
      {!isPost && <span className="font-light">{t('list.filter-by')}</span>}
      <ul className="flex flex-row-reverse gap-3 text-xs">
        {tags.map(({name, id, slug, href}) => {
          return (
            <li className="-ml-6 flex last:ml-0" key={slug}>
              <Link
                href={href}
                className={`relative rotate-12 rounded-r rounded-l-3xl border p-2 pl-6 font-medium text-neutral-900 transition-transform duration-300 ease-in-out before:absolute before:left-2 before:top-1/2 before:mt-[-4.5px] before:h-[9px] before:w-[9px] before:rounded-full before:border before:bg-neutral-900 hover:translate-x-1 hover:rotate-3 ${tagClassName(
                  id
                )}`}
                title={t('post.tag', {tag: name})}
              >
                {name}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
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

interface BlogTagsProps {
  tags: Tag[]
  isPost?: boolean
}
