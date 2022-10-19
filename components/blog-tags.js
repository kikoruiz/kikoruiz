import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

export default function BlogTags({tags, isPost, hasSeparator}) {
  const {t} = useTranslation('blog')

  return (
    <div
      className={`flex items-center gap-3 text-xs ${
        isPost ? 'mt-12 sm:mt-16' : 'mt-6 justify-center'
      }${
        hasSeparator
          ? ' relative pt-9 after:absolute after:left-0 after:top-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-orange-300/60'
          : ''
      }`}
    >
      {!isPost && <span className="font-light">{t('list.filter-by')}</span>}
      <ul className="flex gap-3 text-xs">
        {tags.map(({name, id, slug, href}) => {
          return (
            <li className="flex" key={slug}>
              <Link href={href}>
                <a
                  className={`relative rounded-r rounded-l-3xl border p-2 pl-6 font-medium text-neutral-900 before:absolute before:left-2 before:top-1/2 before:mt-[-4.5px] before:h-[9px] before:w-[9px] before:rounded-full before:border before:bg-neutral-900 ${tagClassName(
                    id
                  )}`}
                  title={t('post.tag', {tag: name})}
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
      return 'bg-red-400/60 hover:bg-red-400 border-red-900 before:border-red-900'
    case 'personal':
      return 'bg-blue-400/60 hover:bg-blue-400 border-blue-900 before:border-blue-900'
    default:
      return 'bg-orange-400/60 hover:bg-orange-400 border-orange-900 before:border-orange-900'
  }
}
