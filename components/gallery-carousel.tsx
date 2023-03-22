import {useEffect, useState, memo} from 'react'
import {useRouter} from 'next/router'
import useEmblaCarousel from 'embla-carousel-react'
import useTranslation from 'next-translate/useTranslation'
// import {DEFAULT_ORIGIN} from 'config'
import {getSlug} from 'lib/utils'
import {Picture, Subcategory} from 'types/gallery'
import PictureDetail from './picture-detail'
import IconArrowLeft from 'assets/icons/arrow-left.svg'
import IconArrowRight from 'assets/icons/arrow-right.svg'
import IconArrowsPointingIn from 'assets/icons/arrows-pointing-in.svg'
import IconArrowsPointingOut from 'assets/icons/arrows-pointing-out.svg'
import {trackEvent} from 'lib/tracking'
// import IconShare from 'assets/icons/share.svg'

let startIndex: number | undefined

// function getShareData({name, url}) {
//   return {
//     title: name,
//     text: name,
//     url: `${
//       typeof window !== 'undefined' ? window.location.origin : DEFAULT_ORIGIN
//     }${url}`
//   }
// }

function GalleryCarousel({
  pictures,
  subcategories,
  setIsCarouselOpen
}: GalleryCarouselProps) {
  const items: Picture[] = subcategories
    ? subcategories.reduce(
        (acc, subcategory) => [
          ...acc,
          ...pictures.filter(({rawTags}) => rawTags.includes(subcategory.tag))
        ],
        []
      )
    : pictures
  const [isFullScreen, setIsFullScreen] = useState(false)
  const {t} = useTranslation('gallery')
  const {push, asPath, query} = useRouter()
  const {carousel} = query
  const index =
    carousel && items.findIndex(({name}) => getSlug(name) === carousel)
  if (typeof startIndex === 'undefined') startIndex = index
  // const [shareData, setShareData] = useState(getShareData(items[index]))
  const [emblaRef, emblaApi] = useEmblaCarousel({startIndex})
  const needsButtonPrevious = emblaApi
    ? emblaApi.selectedScrollSnap() !== 0
    : startIndex !== 0
  const needsButtonNext = emblaApi
    ? emblaApi.selectedScrollSnap() !== items.length - 1
    : startIndex !== items.length - 1
  const fullScreenButtonText = isFullScreen
    ? t('carousel.exit-full-screen')
    : t('carousel.enter-full-screen')
  // const shareButtonText = t('carousel.share')

  function resetCarousel() {
    startIndex = undefined
  }

  function trackCarouselEvent(action: string, name?: string) {
    const index = emblaApi?.selectedScrollSnap()
    const label = name || (index && items[index].name)

    trackEvent({action, category: 'carousel', ...(label && {label})})
  }

  function handleButtonClose() {
    const destination = asPath.split('?')[0]

    push(destination, destination, {shallow: true})
    setIsCarouselOpen(false)
    resetCarousel()
    trackCarouselEvent('close')
  }

  function handleButtonPrevious() {
    if (emblaApi.canScrollPrev()) emblaApi.scrollPrev()
    trackCarouselEvent('go_to_previous')
  }

  function handleButtonNext() {
    if (emblaApi.canScrollNext()) emblaApi.scrollNext()
    trackCarouselEvent('go_to_next')
  }

  function toggleFullScreen() {
    if (isFullScreen) {
      trackCarouselEvent('exit_full_screen')
    } else {
      trackCarouselEvent('enter_full_screen')
    }
    setIsFullScreen(!isFullScreen)
  }

  useEffect((): (() => void) => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleButtonClose()
      }

      switch (event.keyCode) {
        // Arrow left key.
        case 37:
          event.preventDefault()
          handleButtonPrevious()
          break
        // Arrow right key.
        case 39:
          event.preventDefault()
          handleButtonNext()
          break
        // // Key "i".
        // case 73:
        //   event.preventDefault()
        //   setShowInfo(!showInfo)
        //   break
        // Key "f".
        case 70:
          event.preventDefault()
          toggleFullScreen()
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  useEffect((): (() => void) => {
    function handleCarouselChange() {
      const index = emblaApi.selectedScrollSnap()
      const item = items[index]
      const slug = getSlug(item.name)
      const pathSeparator = '?carousel='
      const [destinationPath] = asPath.split(pathSeparator)
      const destination = `${destinationPath}${pathSeparator}${slug}`

      // setShareData(getShareData(item))
      push(destination, destination, {shallow: true})
    }

    emblaApi?.on('select', handleCarouselChange)

    return () => emblaApi?.off('select', handleCarouselChange)
  }, [emblaApi, items, push, asPath])

  return (
    <div className="fixed inset-0 z-10 h-screen w-screen">
      <div className="absolute top-3 right-3 z-20 flex flex-row-reverse gap-3 sm:top-6 sm:right-6">
        <button
          aria-label={t('carousel.close')}
          title={t('carousel.close')}
          className="group relative flex h-11 w-11 rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 drop-shadow-xl hover:text-neutral-300 focus:outline-none"
          onClick={handleButtonClose}
        >
          <span className="sr-only">{t('carousel.close')}</span>
          <div className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 transform">
            <span
              aria-hidden="true"
              className="absolute flex h-0.5 w-5 rotate-45 transform bg-current group-hover:bg-current"
            ></span>
            <span
              aria-hidden="true"
              className="absolute flex h-0.5 w-5 -rotate-45 transform bg-current group-hover:bg-current"
            ></span>
          </div>
        </button>

        <button
          aria-label={fullScreenButtonText}
          title={fullScreenButtonText}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 drop-shadow-xl hover:text-neutral-300 focus:outline-none"
          onClick={toggleFullScreen}
        >
          <span className="sr-only">{fullScreenButtonText}</span>
          {isFullScreen ? (
            <IconArrowsPointingIn className="w-[55%]" />
          ) : (
            <IconArrowsPointingOut className="w-[55%]" />
          )}
        </button>

        {/* <button
          aria-label={shareButtonText}
          title={shareButtonText}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 drop-shadow-xl hover:text-neutral-300 focus:outline-none"
          onClick={async () => {
            if (navigator.share) {
              await navigator.share(shareData)
            } else {
              console.warn('This browser cannot share data via Web Share API.')
            }
          }}
        >
          <span className="sr-only">{shareButtonText}</span>
          <IconShare className="w-[55%]" />
        </button> */}
      </div>

      {!isFullScreen && (
        <span className="pointer-events-none absolute top-6 left-6 z-10 rounded-full bg-gradient-to-t from-neutral-800 py-1.5 px-3 text-xs font-extralight text-neutral-400 drop-shadow-xl">
          {index + 1} <span className="opacity-60">/ {items.length}</span>
        </span>
      )}

      <nav className="hidden sm:block">
        {needsButtonPrevious && (
          <button
            aria-label={t('carousel.navigation.previous')}
            title={t('carousel.navigation.previous')}
            className="absolute -left-14 top-2/4 z-20 -mt-14 flex h-28 w-28 items-center justify-end rounded-full bg-gradient-to-l from-neutral-800/60 pr-3.5 text-neutral-400 hover:from-neutral-800/30 hover:text-neutral-300 focus:outline-none"
            onClick={handleButtonPrevious}
          >
            <IconArrowLeft className="w-9" />
          </button>
        )}
        {needsButtonNext && (
          <button
            aria-label={t('carousel.navigation.next')}
            title={t('carousel.navigation.next')}
            className="absolute -right-14 top-2/4 z-20 -mt-14 flex h-28 w-28 items-center justify-start rounded-full bg-gradient-to-r from-neutral-800/60 pl-3.5 text-neutral-400 hover:from-neutral-800/30 hover:text-neutral-300 focus:outline-none"
            onClick={handleButtonNext}
          >
            <IconArrowRight className="w-9" />
          </button>
        )}
      </nav>

      <div
        className="embla h-full w-full overflow-hidden bg-neutral-900"
        ref={emblaRef}
      >
        <div className="embla__container flex h-full w-full items-center">
          {items.map(item => (
            <PictureDetail
              key={item.slug}
              picture={item}
              isFullScreen={isFullScreen}
              onExit={resetCarousel}
              trackEvent={trackCarouselEvent}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(GalleryCarousel)

interface GalleryCarouselProps {
  pictures: Picture[]
  subcategories?: Subcategory[]
  setIsCarouselOpen: (isCarouselOpen: boolean) => void
}
