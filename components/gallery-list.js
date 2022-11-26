import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {themeScreens, getTitle, getSlug} from '../lib/utils.js'
import ArrowLeft from '../assets/icons/arrow-left.svg'

export default function GalleryList({items, isAlbum = false}) {
  const {
    query: {slug}
  } = useRouter()
  const {t} = useTranslation()
  const {sm, lg} = themeScreens
  const sizes = `(min-width: ${lg}) 33vw, (min-width: ${sm}) 50vw, 100vw`
  const title = isAlbum ? t('sections.gallery.name') : getTitle(slug)

  return (
    <>
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
            <Link href={`/${getSlug(t('sections.gallery.name'))}`}>
              <a
                title={t('gallery:album.back-to-gallery')}
                className="inline-flex items-center text-xs font-light text-neutral-300/30 hover:text-neutral-300/90 sm:text-sm"
              >
                <ArrowLeft className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                {t('gallery:album.back-to-gallery')}
              </a>
            </Link>
          )}
        </div>
      </header>

      <div className="columns-1 gap-3 space-y-3 px-3 pb-3 sm:columns-2 lg:columns-3">
        {items.map(({name, id, url, slug, image, metadata}, index) => {
          if (!isAlbum) url = `${url}/?carousel=${slug}`
          const isFirstImage = index === 0
          const isSecondImage = index === 1
          const needsPreload =
            isFirstImage ||
            (isSecondImage && items[0].image.orientation === 'horizontal')
          const {src, orientation, base64} = image
          const imageAspectClassName =
            orientation === 'vertical' ? 'aspect-2/3' : 'aspect-3/2'
          const aspectClassName = isAlbum
            ? 'aspect-square'
            : imageAspectClassName
          const className = `relative inline-flex flex-col-reverse break-inside-avoid-column w-full after:rounded-sm after:absolute after:w-full after:h-full after:border after:border-transparent hover:after:border-orange-300 after:inset-0 ${aspectClassName}${
            isFirstImage ? ' mt-3' : ''
          }`
          const captionBaseClassName =
            'relative rounded-bl-sm bg-gradient-to-r from-neutral-900 text-xs lg:text-sm'
          const captionClassName = isAlbum
            ? `${captionBaseClassName} px-3 py-6 overflow-hidden`
            : `${captionBaseClassName} p-3.5 text-neutral-400`
          const content = (
            <>
              <Image
                src={src}
                layout="fill"
                sizes={sizes}
                objectFit="cover"
                alt={name ?? t(`gallery.albums.${id}.name`)}
                className="rounded-sm"
                placeholder="blur"
                blurDataURL={base64}
                priority={needsPreload}
                lazyBoundary="120px"
              />

              <figcaption className={captionClassName}>
                <header
                  className={`drop-shadow group-hover:text-orange-300 ${
                    isAlbum
                      ? 'break-words text-6xl font-thin leading-none text-neutral-300/90 sm:text-5xl md:text-6xl'
                      : 'text-sm font-bold'
                  }`}
                >
                  {name ?? t(`gallery.albums.${id}.name`)}
                </header>
                {metadata && (
                  <div className="space-x-1 font-light text-neutral-600 drop-shadow">
                    <span className="after:content-['\00a0·']">
                      {metadata.shutterSpeed}s
                    </span>
                    {metadata.aperture && (
                      <span className="inline-block after:content-['\00a0·']">
                        <span className="italic">f</span>/{metadata.aperture}
                      </span>
                    )}
                    <span>ISO {metadata.iso}</span>
                  </div>
                )}
              </figcaption>
            </>
          )

          return (
            <Link href={url} shallow={!isAlbum} key={id}>
              <a
                title={name ?? t(`gallery.albums.${id}.name`)}
                className={`${className} group`}
              >
                {content}
              </a>
            </Link>
          )
        })}
      </div>
    </>
  )
}

GalleryList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string.isRequired,
      url: PropTypes.string,
      image: PropTypes.shape({
        src: PropTypes.string.isRequired,
        orientation: PropTypes.string.isRequired,
        base64: PropTypes.string
      }).isRequired,
      metadata: PropTypes.shape({
        iso: PropTypes.number,
        aperture: PropTypes.number,
        shutterSpeed: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    })
  ),
  isAlbum: PropTypes.bool
}
