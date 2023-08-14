import useTranslation from 'next-translate/useTranslation'
import {getAspectRatio, themeScreens} from 'lib/utils'
import {Picture} from 'types/gallery'
import PictureCard from './picture-card'

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
          {
            name,
            id,
            date,
            processingDate,
            prettyDate,
            prettyProcessingDate,
            url,
            image,
            imageSize,
            shotInfo,
            isPano
          },
          index
        ) => {
          const isFirstImage = index === 0
          const isSecondImage = index === 1
          const needsPreload =
            isFirstImage ||
            (isSecondImage && items[0].image.orientation === 'horizontal')
          const className = `break-inside-avoid-column${
            isFirstImage ? ' mt-3 xl:mt-4' : ''
          }`
          const sortedPropertyClassName = 'font-bold text-neutral-300/40'
          const aspectRatio = isAlbum ? '1:1' : getAspectRatio(imageSize)

          return (
            <PictureCard
              key={id}
              aspectRatio={aspectRatio}
              title={name ?? t(`gallery.albums.${id}.name`)}
              url={url}
              image={image}
              sizes={sizes}
              needsPreload={needsPreload}
              isAlbum={isAlbum}
              className={className}
            >
              {!isAlbum && !sortingOption?.includes('name') && (
                <div className="space-x-1 text-xs font-light text-neutral-600 drop-shadow">
                  {sortingOption === 'date' && (
                    <time className="text-neutral-300/40" dateTime={date}>
                      {prettyDate}
                    </time>
                  )}
                  {sortingOption === 'processing-date' && (
                    <time
                      className="text-neutral-300/40"
                      dateTime={processingDate}
                    >
                      {t('gallery.picture.processing-date', {
                        date: prettyProcessingDate
                      })}
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
            </PictureCard>
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
