import Link from 'next/link'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import ArrowLeft from '../assets/icons/arrow-left.svg'
import {getSlug, getTitle} from '../lib/utils'

export default function GalleryHeader({isAlbum = false}: GalleryHeaderProps) {
  const {
    query: {slug}
  } = useRouter()
  const {t} = useTranslation()
  const title = isAlbum ? t('sections.gallery.name') : getTitle(slug as string)

  return (
    <header
      className={`mt-9 px-6 text-center sm:-mt-3 ${
        isAlbum ? 'mb-9 sm:mb-12' : 'mb-6 sm:mb-9'
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-y-3 sm:flex-row">
        <h1
          className="truncate bg-gradient-to-t from-orange-300 to-neutral-900 bg-clip-text text-6xl font-black leading-tight text-transparent drop-shadow sm:text-8xl sm:leading-tight"
          title={title}
        >
          {title}
        </h1>
      </div>
      <div
        className={`relative after:absolute after:left-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent ${
          isAlbum
            ? 'pb-6 after:bottom-[-1px] after:via-orange-300/60'
            : 'mt-6 pt-3 after:top-0 after:via-neutral-600'
        }`}
      >
        {isAlbum ? (
          <p className="mt-3 font-light text-neutral-300/60">
            {t('sections.gallery.description')}
          </p>
        ) : (
          <Link
            href={`/${getSlug(t('sections.gallery.name'))}`}
            title={t('gallery:album.back-to-gallery')}
            className="inline-flex items-center text-xs font-light text-neutral-300/30 hover:text-neutral-300/90 sm:text-sm"
          >
            <ArrowLeft className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            {t('gallery:album.back-to-gallery')}
          </Link>
        )}
      </div>
    </header>
  )
}

interface GalleryHeaderProps {
  isAlbum?: boolean
}
