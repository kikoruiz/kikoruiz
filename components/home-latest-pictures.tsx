import {useMemo, useRef, useState} from 'react'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import throttle from 'lodash/throttle'
import {kebabCase} from 'change-case'
import {themeScreens} from 'lib/utils'
import {useAnimatedValue} from 'hooks/use-animated-value'
import HomeModule from './home-module'
import PictureCard from './picture-card'
import {LatestPictures} from 'types/gallery'
import useLatestPicturesContext from 'contexts/LatestPictures'
import ButtonToggle from './button-toggle'

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
  const {t} = useTranslation('home')
  const {query} = useRouter()
  const queryKey = t('common:gallery.carousel.query-key')
  const {latestPictures: sortingOrder, setLatestPictures: setSortingOrder} =
    useLatestPicturesContext()
  const isSortedByProcessingDate = sortingOrder === 'byProcessingDate'
  const pictures = latestPictures[sortingOrder]
  const openPicture = pictures.find(({slug}) => slug === query[queryKey])
  const {sm, xl} = themeScreens
  const sizes = `(min-width: ${xl}) 25vw, (min-width: ${sm}) 33vw, 50vw`
  const elementRef = useRef(null)
  const [scrollPosition, setScrollPosition] = useState(SCROLL_POSITIONS.LEFT)
  const leftFadeStop = useAnimatedValue(
    scrollPosition === SCROLL_POSITIONS.LEFT ? 100 : 90
  )
  const rightFadeStop = useAnimatedValue(
    scrollPosition === SCROLL_POSITIONS.RIGHT ? 100 : 90
  )

  // Memoized so the throttle wrapper, and the ref read inside it, is created
  // once instead of on every render, which both the lint rule and throttling
  // itself care about: a new wrapper each render has no memory of the last
  // call it throttled. lodash defers the actual call to the scroll event, so
  // the ref is never read during this render despite what the rule assumes.
  const handleScroll = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs
      throttle(() => {
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
      }),
    []
  )

  const sortingButtons = () => (
    <nav className="flex items-center">
      {Object.keys(latestPictures).map((order: keyof LatestPictures) => {
        const isActive = sortingOrder === order
        const title = t(`latest-pictures.sorting-order.${kebabCase(order)}`)

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
          WebkitMaskImage: `linear-gradient(to left, rgba(0, 0, 0, 1) ${leftFadeStop}%, transparent 100%)`
        }}
      >
        <div
          ref={elementRef}
          className="flex h-60 gap-3 overflow-x-scroll scrollbar-hide p-3 lg:h-80"
          style={{
            WebkitMaskImage: `linear-gradient(to right, rgba(0, 0, 0, 1) ${rightFadeStop}%, transparent 100%)`
          }}
          onScroll={handleScroll}
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
                shallowUrl={url}
                image={image}
                sizes={sizes}
                needsPreload={index === 0 || index === 1}
                needsFullWidth={false}
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

      {openPicture && (
        <DynamicGalleryCarousel
          pictures={pictures}
          openPicture={openPicture}
          basePath="/"
        />
      )}
    </HomeModule>
  )
}

interface HomeLatestPicturesProps {
  latestPictures: LatestPictures
}

HomeLatestPictures.displayName = 'HomeLatestPictures'
