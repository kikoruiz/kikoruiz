import Link from 'next/link'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import Image from './image'
import {getPrettyDate} from 'lib/blog/date'
import {HighlightedImage} from 'types/gallery'
import PostTitle from './post-title'
import IconChevronRight from 'assets/icons/chevron-right.svg'

export default function PostCard({
  title,
  href,
  createdAt,
  readingTime,
  excerpt,
  highlightedImage,
  className = '',
  isLatest = false,
  needsPreload = false
}: PostCardProps) {
  const {locale} = useRouter()
  const {t} = useTranslation()
  const isTutorial = title.toLowerCase().includes(t('blog.tags.tutorial'))
  const isLatestTutorial = isLatest && isTutorial
  const latestWrapperClassName = isLatestTutorial
    ? 'border-orange-300/30 hover:border-orange-300/60'
    : 'border-neutral-300/30 hover:border-neutral-300/60'
  const latestTagClassName = isLatestTutorial
    ? 'border-orange-600/60 from-orange-300/90 to-orange-200'
    : 'border-neutral-600/60 from-neutral-300/90 to-neutral-200'
  const latestTagTextClassName = isLatestTutorial
    ? 'from-orange-400 via-orange-600 to-orange-800'
    : 'from-neutral-400 via-neutral-600 to-neutral-800'

  return (
    <Link href={href} title={title} className={className}>
      <article
        className={`group flex flex-col overflow-hidden rounded border bg-gradient-to-t from-neutral-900/90 to-neutral-900/30 shadow-md hover:shadow-black/20${
          isLatest
            ? ` relative ${latestWrapperClassName}`
            : ' border-neutral-600/60 hover:border-orange-300/60'
        }`}
      >
        {isLatest && (
          <div
            className={`pointer-events-none absolute top-3 left-3 z-[1] flex items-center justify-center rounded-xl border bg-gradient-to-t py-1 px-2 text-center drop-shadow${
              isLatest ? ` ${latestTagClassName}` : ''
            }`}
          >
            <span
              className={`bg-gradient-to-tl bg-clip-text text-xs font-medium lowercase leading-snug text-transparent drop-shadow-sm${
                isLatest ? ` ${latestTagTextClassName}` : ''
              }`}
            >
              {isTutorial
                ? t('blog.post.latest-tutorial')
                : t('blog.post.latest-post')}
            </span>
          </div>
        )}
        {highlightedImage && (
          <div className="overflow-hidden">
            <Image
              src={highlightedImage.src}
              alt={highlightedImage.alt}
              className="aspect-3/2 transition-transform group-hover:scale-105"
              sizes={highlightedImage.sizes}
              fallbackStyle={highlightedImage.css}
              needsPreload={needsPreload}
            />
          </div>
        )}

        <div className="p-4 text-sm">
          <header className="flex items-start justify-between">
            {isLatest ? (
              <h3 className="text-2xl font-black">
                <PostTitle title={title} />
              </h3>
            ) : (
              <h2 className="text-2xl font-black">
                <PostTitle title={title} />
              </h2>
            )}

            {!isLatest && (
              <span className="w-1/4 text-right text-xs text-neutral-600/60">
                {t('blog.post.reading-time-message', {count: readingTime})}
              </span>
            )}
          </header>

          {!isLatest && (
            <time className="text-orange-300/60" dateTime={createdAt}>
              {getPrettyDate(createdAt, locale)}
            </time>
          )}

          <p
            className={`font-light text-neutral-600 ${
              isLatest ? 'mt-1' : 'mt-3'
            }`}
          >
            {excerpt}
          </p>

          {isLatest && (
            <div className="mt-3 hidden justify-end sm:flex">
              <button
                aria-label={
                  isLatestTutorial
                    ? t('blog.post.read-tutorial')
                    : t('blog.post.read-post')
                }
                className={`pointer-events-none flex appearance-none items-center rounded-full border border-neutral-600/30 bg-neutral-800 py-2 px-4 text-sm font-light shadow-sm ${
                  isLatestTutorial
                    ? 'text-orange-300/60 group-hover:text-orange-300'
                    : 'text-neutral-300/60 group-hover:text-neutral-300'
                }`}
              >
                {isLatestTutorial
                  ? t('blog.post.read-tutorial')
                  : t('blog.post.read-post')}
                <IconChevronRight className="invisible relative -left-3 w-0 transition-all group-hover:visible group-hover:left-0 group-hover:ml-1 group-hover:-mr-1 group-hover:w-4" />
              </button>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

interface PostCardProps {
  title: string
  href: string
  createdAt: string
  readingTime: number
  excerpt: string
  highlightedImage: HighlightedImage
  className?: string
  isLatest?: boolean
  needsPreload?: boolean
}
