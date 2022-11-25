import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import ArrowLeft from '../assets/icons/arrow-left.svg'
import PostCard from './post-card.js'
import BlogTags from './blog-tags.js'
import {getSlug} from '../lib/utils.js'

export default function PostsList({tag, tags, posts}) {
  const {t} = useTranslation('blog')
  const title = t('common:sections.blog.name')
  const titleClassName = tag
    ? 'inline-block text-5xl sm:text-6xl'
    : 'truncate text-6xl sm:text-8xl'
  const currentTag = tag && t(`tags.${tag}`)

  return (
    <>
      <header
        className={`my-9 px-6 text-center ${tag ? 'sm:-mt-1' : 'sm:-mt-3'}`}
      >
        <div className="flex flex-col items-center justify-center gap-y-3 sm:flex-row">
          <h1
            className={`bg-gradient-to-t from-orange-300 to-neutral-900 bg-clip-text font-black leading-tight text-transparent drop-shadow sm:leading-tight ${titleClassName}`}
            title={title}
          >
            {title}
          </h1>
          {currentTag && (
            <span className="relative ml-3 inline-flex rounded-l-[2.4rem] rounded-r-md bg-gradient-to-t from-neutral-600/30 to-neutral-600/60 p-3 pl-11 text-3xl font-medium leading-tight text-neutral-900 before:absolute before:left-4 before:top-1/2 before:mt-[-8px] before:h-[16px] before:w-[16px] before:rounded-full before:bg-neutral-900 sm:rounded-r-lg sm:rounded-l-[4.8rem] sm:pl-20 sm:pr-6 sm:text-6xl sm:leading-tight sm:before:left-7 sm:before:mt-[-15px] sm:before:h-[30px] sm:before:w-[30px]">
              {currentTag}
            </span>
          )}
        </div>
        {currentTag && (
          <div className="relative mt-9 pt-6 after:absolute after:left-0 after:top-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-orange-300/60">
            <Link href={`/${getSlug(t('common:sections.blog.name'))}`}>
              <a
                title={t('list.back-to-all')}
                className="inline-flex items-center text-xs font-light text-neutral-300/30 hover:text-neutral-300/90 sm:text-sm"
              >
                <ArrowLeft className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                {t('list.back-to-all')}
              </a>
            </Link>
          </div>
        )}
        {!currentTag && (
          <>
            <p className="relative mt-3 pb-6 font-light text-neutral-300/60 after:absolute after:left-0 after:bottom-[-1px] after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-orange-300/60">
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
