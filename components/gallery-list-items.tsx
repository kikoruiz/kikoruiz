import useTranslation from 'next-translate/useTranslation'
import Image from './image'
import {getAspectRatio, themeScreens} from 'lib/utils'
import {Picture} from 'types/gallery'

export default function GalleryListItems({
  items,
  isAlbum,
  sortingOption
}: GalleryListItemsProps) {
  const {t} = useTranslation()
  const {sm, lg} = themeScreens
  const sizes = `(min-width: ${lg}) 33vw, (min-width: ${sm}) 50vw, 100vw`

  return (
    <div className="columns-1 gap-3 space-y-3 pb-3 sm:columns-2 lg:columns-3 xl:gap-4 xl:space-y-4 xl:pb-4">
      {items.map(
        (
          {name, id, date, prettyDate, url, image, imageSize, shotInfo, isPano},
          index
        ) => {
          const isFirstImage = index === 0
          const isSecondImage = index === 1
          const needsPreload =
            isFirstImage ||
            (isSecondImage && items[0].image.orientation === 'horizontal')
          const {src, css} = image
          const className = `group inline-flex flex-col-reverse break-inside-avoid-column w-full after:absolute after:inset-0 after:h-full after:w-full after:border after:border-transparent hover:after:border-orange-300${
            isFirstImage ? ' mt-3 xl:mt-4' : ''
          }`
          const captionBaseClassName =
            'relative bg-gradient-to-r from-neutral-900 text-xs lg:text-sm'
          const captionClassName = isAlbum
            ? `${captionBaseClassName} px-3 py-6 overflow-hidden`
            : `${captionBaseClassName} p-3.5 text-neutral-400`
          const sortedPropertyClassName = 'font-bold text-neutral-300/40'
          const aspectRatio = isAlbum ? '1:1' : getAspectRatio(imageSize)

          return (
            <Image
              key={id}
              src={src}
              url={url}
              alt={name ?? t(`gallery.albums.${id}.name`)}
              className={className}
              aspectRatio={aspectRatio}
              sizes={sizes}
              needsPreload={needsPreload}
              fallbackStyle={css}
              isRounded
              isShallowLink={!isAlbum}
            >
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
                    {shotInfo && sortingOption.includes('shot-info') && (
                      <>
                        <span
                          className={`${
                            sortingOption.includes('shutter-speed')
                              ? sortedPropertyClassName
                              : ''
                          }`}
                        >
                          {shotInfo.shutterSpeed}s
                        </span>
                        {' ·'}
                        {shotInfo.aperture && (
                          <>
                            <span
                              className={`inline-block${
                                sortingOption.includes('aperture')
                                  ? ` ${sortedPropertyClassName}`
                                  : ''
                              }`}
                            >
                              <span className="italic">f</span>/
                              {shotInfo.aperture}
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
                          ISO {shotInfo.iso}
                        </span>
                        {shotInfo.focalLength && (
                          <>
                            {' ·'}
                            <span
                              className={`${
                                sortingOption.includes('focal-length')
                                  ? `${sortedPropertyClassName}`
                                  : ''
                              }`}
                            >
                              {shotInfo.focalLength} mm
                              {isPano && ' (pano)'}
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
              </figcaption>
            </Image>
          )
        }
      )}
    </div>
  )
}

interface GalleryListItemsProps {
  items: Picture[]
  isAlbum?: boolean
  sortingOption?: string
}
