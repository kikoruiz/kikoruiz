import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import ArrowLeft from '../assets/icons/arrow-left.svg'
import PostCard from './post-card.js'
import BlogTags from './blog-tags.js'

export default function PostsList({tag, tags, posts}) {
  const {t} = useTranslation('blog')
  const title = t('common:sections.blog.name')
  const titleClassName = tag
    ? 'inline-block text-3xl sm:text-6xl'
    : 'truncate text-6xl sm:text-8xl'
  const currentTag = tag && t(`tags.${tag}`)

  return (
    <>
      <header className="my-9 px-6 text-center sm:mb-12 sm:-mt-3">
        <h1
          className={`bg-gradient-to-t from-orange-300/90 to-neutral-900 bg-clip-text font-black leading-tight text-transparent drop-shadow sm:leading-tight ${titleClassName}`}
          title={title}
        >
          {title}
        </h1>
        {currentTag && (
          <>
            <span className="ml-3 inline-flex overflow-hidden rounded-r-lg">
              <span className="relative rounded-l-full bg-gradient-to-t from-neutral-600/30 to-neutral-600/60 p-3 pl-10 text-3xl font-medium leading-tight text-neutral-900 before:absolute before:left-4 before:top-1/2 before:mt-[-8px] before:h-[16px] before:w-[16px] before:rounded-full before:bg-neutral-900 sm:pl-12 sm:text-6xl sm:leading-tight sm:before:mt-[-12px] sm:before:h-[24px] sm:before:w-[24px]">
                {currentTag}
              </span>
            </span>
            <div className="mt-3 sm:mt-6">
              <Link href={`/${t('common:sections.blog.slug')}`}>
                <a
                  title={t('list.back-to-all')}
                  className="inline-flex items-center text-xs font-light text-neutral-300/30 hover:text-neutral-300/90 sm:text-sm"
                >
                  <ArrowLeft className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  {t('list.back-to-all')}
                </a>
              </Link>
            </div>
          </>
        )}
        {!currentTag && (
          <>
            <p className="mt-3 font-light text-neutral-300/60">
              {t('common:sections.blog.description')}
            </p>
            <BlogTags tags={tags} />
          </>
        )}
      </header>

      <section className="grid p-4 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
        {posts.map(post => (
          <PostCard key={post.slug} {...post} />
        ))}
      </section>
    </>
  )
}
