import {useEffect, useState, memo} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import useTranslation from 'next-translate/useTranslation'
import Image from './image'
import PictureInfo from './picture-info'
import {getAspectRatio, getSlug} from 'lib/utils'
import {Picture, Subcategory} from 'types/gallery'
import IconArrowLeft from 'assets/icons/arrow-left.svg'
import IconArrowRight from 'assets/icons/arrow-right.svg'
import IconArrowsPointingIn from 'assets/icons/arrows-pointing-in.svg'
import IconArrowsPointingOut from 'assets/icons/arrows-pointing-out.svg'

let startIndex: number | undefined

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
  const [showPictureInfo, setShowPictureInfo] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const {t} = useTranslation('gallery')
  const {push, asPath, query} = useRouter()
  const {carousel} = query
  const index =
    carousel && items.findIndex(({name}) => getSlug(name) === carousel)
  if (typeof startIndex === 'undefined') startIndex = index
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

  function resetCarousel() {
    startIndex = undefined
  }

  function handleButtonClose() {
    const destination = asPath.split('?')[0]

    push(destination, destination, {shallow: true})
    setIsCarouselOpen(false)
    resetCarousel()
  }

  function handleButtonPrevious() {
    if (emblaApi.canScrollPrev()) emblaApi.scrollPrev()
  }

  function handleButtonNext() {
    if (emblaApi.canScrollNext()) emblaApi.scrollNext()
  }

  function toggleFullScreen() {
    setIsFullScreen(!isFullScreen)
  }

  useEffect((): (() => void) => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()

        const destination = asPath.split('?')[0]

        push(destination, destination, {shallow: true})
        setIsCarouselOpen(false)
        resetCarousel()
      }

      switch (event.keyCode) {
        // Arrow left key.
        case 37:
          event.preventDefault()
          if (emblaApi.canScrollPrev()) emblaApi.scrollPrev()
          break
        // Arrow right key.
        case 39:
          event.preventDefault()
          if (emblaApi.canScrollNext()) emblaApi.scrollNext()
          break
        // Key "i".
        case 73:
          event.preventDefault()
          setShowPictureInfo(!showPictureInfo)
          break
        // Key "f".
        case 70:
          event.preventDefault()
          setIsFullScreen(!isFullScreen)
          break
        default:
          break
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
    showPictureInfo,
    setIsFullScreen,
    isFullScreen
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
          className="group flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 drop-shadow-xl hover:text-neutral-300 focus:outline-none"
          onClick={toggleFullScreen}
        >
          <span className="sr-only">{fullScreenButtonText}</span>
          {isFullScreen ? (
            <IconArrowsPointingIn className="w-[55%]" />
          ) : (
            <IconArrowsPointingOut className="w-[55%]" />
          )}
        </button>
      </div>

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
                editingSoftware,
                tags
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
                  <div
                    aria-hidden
                    className="absolute top-0 -z-10 h-full w-full overflow-hidden opacity-60 blur-3xl"
                    style={{
                      ...image.css,
                      transform: 'translate3d(0, 0, 0)',
                      WebkitMaskImage: '-webkit-radial-gradient(white, black)'
                    }}
                  />

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

                    {!isFullScreen && (
                      <div className="fixed top-0 flex h-full w-full flex-col-reverse">
                        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900">
                          <section className="mx-auto p-6 text-neutral-400 xl:max-w-5xl">
                            <header className="mb-1 text-3xl font-black drop-shadow group-hover:text-orange-300">
                              {name}
                            </header>
                            <time
                              className="flex text-neutral-300/40"
                              dateTime={date}
                            >
                              {prettyDate}
                            </time>

                            {tags.length > 0 && (
                              <div className="mt-1.5 pb-3">
                                {tags.map(({id, name, href}) => (
                                  <Link
                                    key={id}
                                    href={href}
                                    onClick={resetCarousel}
                                    title={name}
                                    className="mr-1.5 mt-1.5 inline-block rounded border border-neutral-800 bg-gradient-to-b from-neutral-800/60 to-neutral-800/30 px-1.5 py-2.5 text-xs font-extrabold leading-[0.5] text-neutral-300/30 drop-shadow hover:border-orange-300/30 hover:to-transparent hover:text-orange-300/60"
                                  >
                                    <span className="font-extralight">#</span>{' '}
                                    {name}
                                  </Link>
                                ))}
                              </div>
                            )}

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
                    )}
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
  pictures: Picture[]
  subcategories?: Subcategory[]
  setIsCarouselOpen: (isCarouselOpen: boolean) => void
}
