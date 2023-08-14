import {useRef, useState, useEffect} from 'react'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {throttle} from 'lodash'
import {themeScreens} from 'lib/utils'
import HomeModule from './home-module'
import PictureCard from './picture-card'
import {LatestPictures} from 'types/gallery'
import useLatestPicturesContext from 'contexts/LatestPictures'
import ButtonToggle from './button-toggle'
import {paramCase} from 'change-case'

const SCROLL_POSITIONS = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right'
}

const DynamicGalleryCarousel = dynamic(
  () => import('components/gallery-carousel')
)

export default function HomeLatestPictures({
  latestPictures
}: HomeLatestPicturesProps) {
  const {query} = useRouter()
  const {t} = useTranslation('home')
  const queryKey = t('common:gallery.carousel.query-key')
  const {[queryKey]: querySlug} = query
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)
  const {latestPictures: sortingOrder, setLatestPictures: setSortingOrder} =
    useLatestPicturesContext()
  const isSortedByProcessingDate = sortingOrder === 'byProcessingDate'
  const pictures = latestPictures[sortingOrder]
  const {sm, xl} = themeScreens
  const sizes = `(min-width: ${xl}) 25vw, (min-width: ${sm}) 33vw, 50vw`
  const elementRef = useRef(null)
  const [scrollPosition, setScrollPosition] = useState(SCROLL_POSITIONS.LEFT)

  function handleScroll() {
    const isOnLeft = elementRef.current?.scrollLeft <= 0
    const isOnRight =
      elementRef.current?.scrollLeft >=
      elementRef.current?.scrollWidth -
        elementRef.current?.getBoundingClientRect().width

    if (isOnLeft) {
      setScrollPosition(SCROLL_POSITIONS.LEFT)
    } else if (isOnRight) {
      setScrollPosition(SCROLL_POSITIONS.RIGHT)
    } else {
      setScrollPosition(SCROLL_POSITIONS.CENTER)
    }
  }

  useEffect(() => {
    setIsCarouselOpen(Boolean(querySlug))
  }, [setIsCarouselOpen, querySlug])

  const sortingButtons = () => (
    <nav className="flex items-center">
      {Object.keys(latestPictures).map((order: keyof LatestPictures) => {
        const isActive = sortingOrder === order
        const title = t(`latest-pictures.sorting-order.${paramCase(order)}`)

        return (
          <ButtonToggle
            key={order}
            label={title}
            isToggled={isActive}
            isDisabled={isActive}
            onClick={() => {
              setSortingOrder(order)
            }}
          >
            {title}
          </ButtonToggle>
        )
      })}
    </nav>
  )

  return (
    <HomeModule
      title={t('latest-pictures.title')}
      additionalInfo={sortingButtons()}
    >
      <div
        style={{
          WebkitMaskImage: `linear-gradient(to left, rgba(0, 0, 0, 1) ${
            scrollPosition !== SCROLL_POSITIONS.LEFT ? '90%' : '100%'
          }, transparent 100%)`
        }}
      >
        <div
          ref={elementRef}
          className="flex h-60 gap-3 overflow-x-scroll p-3 lg:h-80"
          style={{
            WebkitMaskImage: `linear-gradient(to right, rgba(0, 0, 0, 1) ${
              scrollPosition !== SCROLL_POSITIONS.RIGHT ? '90%' : '100%'
            }, transparent 100%)`
          }}
          onScroll={throttle(handleScroll)}
        >
          {pictures.map(
            (
              {
                id,
                name,
                url,
                image,
                date,
                prettyDate,
                processingDate,
                prettyProcessingDate
              },
              index
            ) => (
              <PictureCard
                key={id}
                title={name}
                url={url}
                image={image}
                sizes={sizes}
                needsPreload={index === 0 || index === 1}
              >
                <div className="flex flex-col text-xs font-light text-neutral-600 drop-shadow">
                  {isSortedByProcessingDate && processingDate ? (
                    <time
                      className="leading-normal text-neutral-300/40"
                      dateTime={processingDate}
                    >
                      {t('common:gallery.picture.processing-date', {
                        date: prettyProcessingDate
                      })}
                    </time>
                  ) : (
                    <time
                      className="leading-normal text-neutral-300/40"
                      dateTime={date}
                    >
                      {prettyDate}
                    </time>
                  )}
                </div>
              </PictureCard>
            )
          )}
        </div>
      </div>

      {isCarouselOpen && (
        <DynamicGalleryCarousel
          pictures={pictures}
          setIsCarouselOpen={setIsCarouselOpen}
        />
      )}
    </HomeModule>
  )
}

interface HomeLatestPicturesProps {
  latestPictures: LatestPictures
}
