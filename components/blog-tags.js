import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

export default function BlogTags({tags, isPost}) {
  const {t} = useTranslation('blog')

  return (
    <ul
      className={`flex items-center gap-3 text-xs ${
        isPost ? 'mt-12 sm:mt-16' : 'mt-6 justify-center'
      }`}
    >
      {tags.map(({name, slug, href}) => {
        return (
          <li className="flex overflow-hidden rounded-r-md" key={slug}>
            <Link href={href}>
              <a
                className="relative rounded-l-full bg-orange-300/60 p-2 pl-6 font-medium text-neutral-900 before:absolute before:left-2 before:top-1/2 before:mt-[-4.5px] before:h-[9px] before:w-[9px] before:rounded-full before:bg-neutral-900 hover:bg-orange-300"
                title={t('post.go-to-tag', {tag: name})}
              >
                {name}
              </a>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
