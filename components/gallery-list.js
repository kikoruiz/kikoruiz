import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import {themeScreens} from '../lib/utils.js'
import {
  SORTING_OPTIONS,
  DEFAULT_SORTING_OPTION,
  DISABLED_SORTING_OPTIONS
} from '../config/gallery.js'
import ArrowPathRoundedSquare from '../assets/icons/arrow-path-rounded-square.svg'

export default function GalleryList({
  items,
  isAlbum = false,
  onSort,
  sortingOption,
  toggleSortingDirection,
  isReversedSorting
}) {
  const {t} = useTranslation()
  const {sm, lg} = themeScreens
  const sizes = `(min-width: ${lg}) 33vw, (min-width: ${sm}) 50vw, 100vw`

  return (
    <section className="px-3">
      {!isAlbum && (
        <div className="flex justify-center gap-2 pt-3 sm:justify-end">
          <div className="flex items-center text-xs">
            <label htmlFor="sorting" className="mr-2 text-neutral-500">
              {t('gallery:sorting.label')}
            </label>
            <select
              id="sorting"
              className="block appearance-none rounded-md border border-neutral-700 bg-neutral-800 bg-select bg-[length:0.75rem] bg-[right_0.5rem_center] bg-no-repeat py-1.5 pl-3 pr-7 shadow-sm focus:border-orange-300/60 focus:outline-none focus:ring-orange-300/60"
              onChange={onSort}
              defaultValue={DEFAULT_SORTING_OPTION}
            >
              {SORTING_OPTIONS.map(option => {
                const isDisabled = DISABLED_SORTING_OPTIONS.includes(option)

                return (
                  <option
                    key={`sorting-by-${option}`}
                    value={option}
                    disabled={isDisabled}
                  >
                    {t(`gallery:sorting.options.${option}`)}
                  </option>
                )
              })}
            </select>
          </div>
          <button
            onClick={toggleSortingDirection}
            className="group flex items-center rounded-md border border-neutral-700 bg-neutral-800 p-1.5 text-xs font-light hover:border-orange-300/60 focus:border-orange-300/60 focus:outline-none focus:ring-orange-300/60"
            aria-label={t('gallery:sorting.direction')}
            title={t('gallery:sorting.direction')}
          >
            <span className="text-neutral-300/60">
              {isReversedSorting ? 'Z' : 'A'}
            </span>
            <ArrowPathRoundedSquare className="w-6 px-1 group-hover:fill-orange-300" />
            <span className="text-neutral-300/60">
              {isReversedSorting ? 'A' : 'Z'}
            </span>
          </button>
        </div>
      )}

      <div className="columns-1 gap-3 space-y-3 pb-3 sm:columns-2 lg:columns-3">
        {items.map(
          ({name, id, date, prettyDate, url, slug, image, metadata}, index) => {
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
            const sortedPropertyClassName = 'font-bold text-neutral-300/40'
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
                  {!isAlbum && !sortingOption?.includes('name') && (
                    <div className="space-x-1 text-xs font-light text-neutral-600 drop-shadow">
                      {sortingOption.includes('date') && (
                        <time className="text-neutral-300/40" dateTime={date}>
                          {prettyDate}
                        </time>
                      )}
                      {metadata && sortingOption.includes('metadata') && (
                        <>
                          <span
                            className={`${
                              sortingOption.includes('shutter-speed')
                                ? sortedPropertyClassName
                                : ''
                            }`}
                          >
                            {metadata.shutterSpeed}s
                          </span>
                          {' ·'}
                          {metadata.aperture && (
                            <>
                              <span
                                className={`inline-block${
                                  sortingOption.includes('aperture')
                                    ? ` ${sortedPropertyClassName}`
                                    : ''
                                }`}
                              >
                                <span className="italic">f</span>/
                                {metadata.aperture}
                              </span>
                              {' ·'}
                            </>
                          )}
                          <span
                            className={`${
                              sortingOption.includes('iso')
                                ? sortedPropertyClassName
                                : ''
                            }`}
                          >
                            ISO {metadata.iso}
                          </span>
                          {metadata.focalLength && (
                            <>
                              {' ·'}
                              <span
                                className={`${
                                  sortingOption.includes('focal-length')
                                    ? `${sortedPropertyClassName}`
                                    : ''
                                }`}
                              >
                                {metadata.focalLength} mm
                              </span>
                            </>
                          )}
                        </>
                      )}
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
          }
        )}
      </div>
    </section>
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
