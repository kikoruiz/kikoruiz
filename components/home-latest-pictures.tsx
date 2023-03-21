import {useRef, useState} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {throttle} from 'lodash'
import HomeModule from './home-module'
import PictureCard from './picture-card'
import {themeScreens} from 'lib/utils'

const SCROLL_POSITIONS = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right'
}

export default function HomeLatestPictures({
  latestPictures
}: HomeLatestPicturesProps) {
  const {sm, xl} = themeScreens
  const sizes = `(min-width: ${xl}) 25vw, (min-width: ${sm}) 33vw, 50vw`
  const {t} = useTranslation('home')
  const elementRef = useRef()
  const [scrollPosition, setScrollPosition] = useState(SCROLL_POSITIONS.LEFT)

  function handleScroll() {
    const isOnLeft = elementRef.current.scrollLeft === 0
    const isOnRight =
      elementRef.current.scrollLeft ===
      elementRef.current.scrollWidth -
        elementRef.current.getBoundingClientRect().width

    if (isOnLeft) {
      setScrollPosition(SCROLL_POSITIONS.LEFT)
    } else if (isOnRight) {
      setScrollPosition(SCROLL_POSITIONS.RIGHT)
    } else {
      setScrollPosition(SCROLL_POSITIONS.CENTER)
    }
  }

  return (
    <HomeModule title={t('latest-pictures')}>
      <div
        style={{
          ...(scrollPosition !== SCROLL_POSITIONS.LEFT && {
            WebkitMaskImage: [
              'linear-gradient(to left, rgba(0, 0, 0, 1) 90%, transparent 100%)'
            ]
          })
        }}
      >
        <div
          ref={elementRef}
          className="flex h-60 gap-3 overflow-x-scroll p-3 lg:h-96"
          style={{
            ...(scrollPosition !== SCROLL_POSITIONS.RIGHT && {
              WebkitMaskImage: [
                'linear-gradient(to right, rgba(0, 0, 0, 1) 90%, transparent 100%)'
              ]
            })
          }}
          onScroll={throttle(handleScroll)}
        >
          {latestPictures.map(({id, name, url, image}) => (
            <PictureCard
              key={id}
              aspectRatio="1:1"
              title={name}
              url={url}
              image={image}
              sizes={sizes}
            />
          ))}
        </div>
      </div>
    </HomeModule>
  )
}

interface HomeLatestPicturesProps {
  latestPictures: Picture[]
}
