import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {getSectionSeparator} from '../lib/utils.js'

export default function BlogTags({tags, isPost, hasSeparator}) {
  const {t} = useTranslation('blog')

  return (
    <div
      className={`flex items-center gap-3 text-xs ${
        isPost ? 'mt-12 sm:mt-16' : 'mt-6 justify-center'
      }${hasSeparator ? ` ${getSectionSeparator({isAccent: true})}` : ''}`}
    >
      {!isPost && <span className="font-light">{t('list.filter-by')}</span>}
      <ul className="flex gap-3 text-xs">
        {tags.map(({name, id, slug, href}) => {
          return (
            <li className="flex overflow-hidden rounded-r-md" key={slug}>
              <Link href={href}>
                <a
                  className={`relative rounded-l-full p-2 pl-6 font-medium text-neutral-900 before:absolute before:left-2 before:top-1/2 before:mt-[-4.5px] before:h-[9px] before:w-[9px] before:rounded-full before:bg-neutral-900 ${tagClassName(
                    id
                  )}`}
                  title={t('post.filter-by-tag', {tag: name})}
                >
                  {name}
                </a>
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
      return 'bg-red-400/60 hover:bg-red-400'
    case 'personal':
      return 'bg-blue-400/60 hover:bg-blue-400'
    default:
      return 'bg-orange-400/60 hover:bg-orange-400'
  }
}
