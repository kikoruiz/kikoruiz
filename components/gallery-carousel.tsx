import {useEffect, useState, memo} from 'react'
import {useRouter} from 'next/router'
import useEmblaCarousel from 'embla-carousel-react'
import useTranslation from 'next-translate/useTranslation'
import Image from './image'
import PictureInfo from './picture-info'
import {getAspectRatio, getSlug} from 'lib/utils'
import {Picture} from 'types/gallery'
import ArrowLeftIcon from 'assets/icons/arrow-left.svg'
import ArrowRightIcon from 'assets/icons/arrow-right.svg'

let startIndex: number | undefined

function GalleryCarousel({items, setIsCarouselOpen}: GalleryCarouselProps) {
  const [showPictureInfo, setShowPictureInfo] = useState(false)
  const {t} = useTranslation('gallery')
  const {push, asPath, query} = useRouter()
  const {carousel} = query
  const index = items.findIndex(({name}) => getSlug(name) === carousel)
  if (typeof startIndex === 'undefined') startIndex = index
  const [emblaRef, emblaApi] = useEmblaCarousel({startIndex})
  const needsButtonPrevious = emblaApi
    ? emblaApi.selectedScrollSnap() !== 0
    : startIndex !== 0
  const needsButtonNext = emblaApi
    ? emblaApi.selectedScrollSnap() !== items.length - 1
    : startIndex !== items.length - 1

  function handleButtonClose() {
    const destination = asPath.split('?')[0]

    push(destination, destination, {shallow: true})
    setIsCarouselOpen(false)
    startIndex = undefined
  }

  function handleButtonPrevious() {
    if (emblaApi.canScrollPrev()) emblaApi.scrollPrev()
  }

  function handleButtonNext() {
    if (emblaApi.canScrollNext()) emblaApi.scrollNext()
  }

  useEffect((): (() => void) => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()

        const destination = asPath.split('?')[0]

        push(destination, destination, {shallow: true})
        setIsCarouselOpen(false)
        startIndex = undefined
      }

      // Arrow left key.
      if (event.keyCode === 37) {
        event.preventDefault()
        if (emblaApi.canScrollPrev()) emblaApi.scrollPrev()
      }

      // Arrow right key.
      if (event.keyCode === 39) {
        event.preventDefault()
        if (emblaApi.canScrollNext()) emblaApi.scrollNext()
      }

      // Key "I".
      if (event.keyCode === 73) {
        event.preventDefault()
        setShowPictureInfo(!showPictureInfo)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    asPath,
    push,
    setIsCarouselOpen,
    emblaApi,
    setShowPictureInfo,
    showPictureInfo
  ])

  useEffect((): (() => void) => {
    function handleCarouselChange() {
      const index = emblaApi.selectedScrollSnap()
      const slug = getSlug(items[index].name)
      const pathSeparator = '?carousel='
      const [destinationPath] = asPath.split(pathSeparator)
      const destination = `${destinationPath}${pathSeparator}${slug}`

      push(destination, destination, {shallow: true})
    }

    emblaApi?.on('select', handleCarouselChange)

    return () => emblaApi?.off('select', handleCarouselChange)
  }, [emblaApi, items, push, asPath])

  return (
    <div className="fixed inset-0 z-10 h-screen w-screen">
      <button
        aria-label={t('carousel.close')}
        title={t('carousel.close')}
        className="group absolute top-3 right-3 z-20 flex h-11 w-11 rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 hover:text-neutral-300 focus:outline-none sm:top-6 sm:right-6"
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

      <nav className="hidden sm:block">
        {needsButtonPrevious && (
          <button
            aria-label={t('carousel.navigation.previous')}
            title={t('carousel.navigation.previous')}
            className="absolute -left-14 top-2/4 z-20 -mt-14 flex h-28 w-28 items-center justify-end rounded-full bg-gradient-to-l from-neutral-800/60 pr-3.5 text-neutral-400 hover:from-neutral-800/30 hover:text-neutral-300 focus:outline-none"
            onClick={handleButtonPrevious}
          >
            <ArrowLeftIcon className="w-9" />
          </button>
        )}
        {needsButtonNext && (
          <button
            aria-label={t('carousel.navigation.next')}
            title={t('carousel.navigation.next')}
            className="absolute -right-14 top-2/4 z-20 -mt-14 flex h-28 w-28 items-center justify-start rounded-full bg-gradient-to-r from-neutral-800/60 pl-3.5 text-neutral-400 hover:from-neutral-800/30 hover:text-neutral-300 focus:outline-none"
            onClick={handleButtonNext}
          >
            <ArrowRightIcon className="w-9" />
          </button>
        )}
      </nav>

      <div
        className="embla h-full w-full overflow-hidden bg-neutral-900"
        ref={emblaRef}
      >
        <div className="embla__container flex h-full w-full items-center">
          {items.map(
            (
              {
                name,
                id,
                image,
                imageSize,
                date,
                prettyDate,
                shotInfo,
                isPano,
                model,
                lens,
                editingSoftware
                // tags
              },
              index
            ) => {
              const aspectRatio = getAspectRatio(imageSize)
              const pictureInfoProps = {
                shotInfo,
                isPano,
                model,
                lens,
                editingSoftware,
                aspectRatio
              }

              return (
                <div key={id} className="embla__slide flex-[0_0_100%]">
                  <div className="contents h-screen w-screen">
                    <Image
                      src={image.src}
                      alt={name}
                      className="m-auto max-h-screen overflow-hidden"
                      aspectRatio={aspectRatio}
                      sizes="100vw"
                      needsPreload={index === startIndex}
                      fallbackStyle={image.css}
                    />

                    <div className="fixed top-0 flex h-full w-full flex-col-reverse">
                      <div className="bg-gradient-to-r from-neutral-900">
                        <section className="mx-auto p-6 text-neutral-400 xl:max-w-5xl">
                          <header className="mb-1 text-3xl font-black drop-shadow-xl group-hover:text-orange-300">
                            {name}
                          </header>
                          <time
                            className="flex text-neutral-300/40"
                            dateTime={date}
                          >
                            {prettyDate}
                          </time>

                          {/* <div className="mt-1">
                            {tags.map(tag => (
                              <span
                                key={tag}
                                className="mr-2 mt-2 inline-flex rounded-full bg-neutral-600/20 p-2 text-xs leading-[0.5] text-neutral-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div> */}

                          <PictureInfo
                            {...pictureInfoProps}
                            isOpen={showPictureInfo}
                            handleToggle={() => {
                              setShowPictureInfo(!showPictureInfo)
                            }}
                          />
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(GalleryCarousel)

interface GalleryCarouselProps {
  items: Picture[]
  setIsCarouselOpen: (isCarouselOpen: boolean) => void
}
