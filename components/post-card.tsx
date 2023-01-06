import Link from 'next/link'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import Image from './image'
import {getPrettyDate} from 'lib/blog/date'
import {HighlightedImage} from 'types/gallery'

export default function PostCard({
  title,
  href,
  createdAt,
  readingTime,
  excerpt,
  highlightedImage
}: PostCardProps) {
  const {locale} = useRouter()
  const {t} = useTranslation('blog')

  return (
    <Link href={href} title={title}>
      <article className="flex flex-col overflow-hidden rounded border border-neutral-600/30 bg-neutral-800/30 shadow-md hover:border-orange-300/60 hover:shadow-black/20">
        {highlightedImage && (
          <Image
            src={highlightedImage.src}
            alt={highlightedImage.src}
            className="aspect-video"
            sizes={highlightedImage.sizes}
            fallbackStyle={highlightedImage.css}
          />
        )}
        <div className="p-4 text-sm">
          <header className="flex items-center justify-between">
            <h2 className="text-2xl font-black">{title}</h2>
            <span className="w-1/4 text-right text-xs text-neutral-600/60">
              {t('post.reading-time-message', {count: readingTime})}
            </span>
          </header>
          <time className="text-orange-300/60" dateTime={createdAt}>
            {getPrettyDate(createdAt, locale)}
          </time>
          <p className="mt-3 font-light text-neutral-600">{excerpt}</p>
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
}
