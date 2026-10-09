import {useRouter} from 'next/router'
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
  const {query} = useRouter()
  const {sm, lg} = themeScreens
  const sizes = `(min-width: ${lg}) 33vw, (min-width: ${sm}) 50vw, 100vw`
  // With a picture open the whole grid sits behind the viewer, so preloading
  // any of it would only compete with the picture actually on screen.
  const hasOpenPicture = Boolean(
    query.picture ?? query[t('gallery.carousel.query-key')]
  )

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
            permalink,
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
            !hasOpenPicture &&
            (isFirstImage ||
              (isSecondImage && items[0].image.orientation === 'horizontal'))
          const className = `break-inside-avoid-column${
            isFirstImage ? ' mt-3 xl:mt-4' : ''
          }`
          const sortedPropertyClassName = 'font-bold text-neutral-300/40'
          const aspectRatio = isAlbum ? '1:1' : getAspectRatio(imageSize)

          // The page of a picture hangs from the album owning it, so only there
          // the viewer can show it in the address bar. Browsed from any other
          // album the open picture stays in the query, which is the only URL
          // this listing can honestly claim.
          const [albumSlug] = permalink?.split('/').slice(-2) ?? []
          const ownsPicture = albumSlug === query.slug

          return (
            <PictureCard
              key={id}
              aspectRatio={aspectRatio}
              title={name ?? t(`gallery.albums.${id}.name`)}
              url={isAlbum || !ownsPicture ? url : permalink}
              shallowUrl={isAlbum ? undefined : url}
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

GalleryListItems.displayName = 'GalleryListItems'
