import {useRef, useState, useEffect} from 'react'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {throttle} from 'lodash'
import {themeScreens} from 'lib/utils'
import HomeModule from './home-module'
import PictureCard from './picture-card'
import {Picture} from 'types/gallery'

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

  return (
    <HomeModule title={t('latest-pictures')}>
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
          {latestPictures.map(
            ({id, name, url, image, prettyDate, date}, index) => (
              <PictureCard
                key={id}
                title={name}
                url={url}
                image={image}
                sizes={sizes}
                needsPreload={index === 0 || index === 1}
              >
                <div className="space-x-1 text-xs font-light text-neutral-600 drop-shadow">
                  <time className="text-neutral-300/40" dateTime={date}>
                    {prettyDate}
                  </time>
                </div>
              </PictureCard>
            )
          )}
        </div>
      </div>

      {isCarouselOpen && (
        <DynamicGalleryCarousel
          pictures={latestPictures}
          setIsCarouselOpen={setIsCarouselOpen}
        />
      )}
    </HomeModule>
  )
}

interface HomeLatestPicturesProps {
  latestPictures: Picture[]
}
