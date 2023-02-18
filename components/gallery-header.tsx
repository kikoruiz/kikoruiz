import Link from 'next/link'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {GALLERY_TAGS} from 'config/gallery'
import {getSlug, getTitle} from 'lib/utils'
import IconArrowLeft from 'assets/icons/arrow-left.svg'
import IconArrowRight from 'assets/icons/arrow-right.svg'

export default function GalleryHeader({
  isAlbum = false,
  isTagsIndex = false
}: GalleryHeaderProps) {
  const {
    query: {slug, tag}
  } = useRouter()
  const {t} = useTranslation()
  let originalTag
  if (tag) {
    originalTag = GALLERY_TAGS.find(
      galleryTag => getSlug(t(`gallery:tags.${getSlug(galleryTag)}`)) === tag
    )
  }
  const galleryListTitle = originalTag
    ? t(`gallery:tags.${getSlug(originalTag)}`).toLowerCase()
    : slug && getTitle(slug as string)
  let title
  if (isAlbum) {
    title = t('sections.gallery.name')
  } else if (isTagsIndex) {
    title = t('gallery:header.tags')
  } else {
    title = galleryListTitle
  }
  const sectionSlug = getSlug(t('sections.gallery.name'))
  const backButtonHref = tag
    ? `/${sectionSlug}/${getSlug(t('tags'))}`
    : `/${sectionSlug}`
  const backButtonTitle = tag
    ? t('gallery:album.back-to-tags')
    : t('gallery:album.back-to-gallery')

  return (
    <header
      className={`mt-9 px-6 text-center sm:-mt-3 ${
        isAlbum ? 'mb-9 sm:mb-12' : 'mb-6 sm:mb-9'
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-y-3 sm:flex-row">
        <h1
          className={`bg-gradient-to-t to-neutral-900 bg-clip-text text-6xl font-black leading-tight text-transparent drop-shadow sm:text-8xl sm:leading-tight ${
            tag ? 'from-neutral-300/60' : 'from-orange-300'
          }`}
          title={title}
        >
          {tag ? (
            <>
              <span className="font-extralight">#</span> {title}
            </>
          ) : (
            title
          )}
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
            {t('sections.gallery.description')}{' '}
          </p>
        ) : (
          <Link
            href={backButtonHref}
            title={backButtonTitle}
            className="inline-flex items-center text-xs font-light text-neutral-300/30 hover:text-neutral-300/90 sm:text-sm"
          >
            <IconArrowLeft className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            {backButtonTitle}
          </Link>
        )}
      </div>
      {isAlbum && (
        <Link
          href={`/${sectionSlug}/${getSlug(t('tags'))}`}
          title={t('gallery:header.tags')}
          className="mt-6 inline-flex items-center text-xs font-light text-orange-300/60 hover:text-orange-300/90 sm:text-sm"
        >
          {t('gallery:header.go-to-tags')}
          <IconArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
        </Link>
      )}
    </header>
  )
}

interface GalleryHeaderProps {
  isAlbum?: boolean
  isTagsIndex?: boolean
}
