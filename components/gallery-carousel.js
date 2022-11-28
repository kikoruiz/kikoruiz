import {useEffect, memo} from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import useTranslation from 'next-translate/useTranslation'
import {getSlug} from '../lib/utils.js'

let startIndex

function GalleryCarousel({items, setIsCarouselOpen}) {
  const {t} = useTranslation('gallery')
  const {push, asPath, query} = useRouter()
  const {carousel} = query
  const index = items.findIndex(({name}) => getSlug(name) === carousel)
  if (typeof startIndex === 'undefined') startIndex = index
  const [emblaRef, emblaApi] = useEmblaCarousel({startIndex})

  function handleButtonClose() {
    const destination = asPath.split('?')[0]

    push(destination, destination, {shallow: true})
    setIsCarouselOpen(false)
    startIndex = undefined
  }

  useEffect(() => {
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
        className="absolute top-3 right-3 z-20 flex h-11 w-11 rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 hover:text-neutral-300 focus:outline-none sm:top-6 sm:right-6"
        onClick={handleButtonClose}
      >
        <span className="sr-only">{t('carousel.close')}</span>
        <div className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 transform">
          <span
            aria-hidden="true"
            className="absolute flex h-0.5 w-5 rotate-45 transform bg-current"
          ></span>
          <span
            aria-hidden="true"
            className="absolute flex h-0.5 w-5 -rotate-45 transform bg-current"
          ></span>
        </div>
      </button>

      <div
        className="embla h-full w-full overflow-hidden bg-neutral-900"
        ref={emblaRef}
      >
        <div className="embla__container flex h-full w-full items-center">
          {items.map(({name, id, image}, index) => {
            const imageAspectClassName =
              image.orientation === 'vertical' ? 'aspect-2/3' : 'aspect-3/2'

            return (
              <div key={id} className="embla__slide flex-[0_0_100%]">
                <figure
                  className={`relative mx-auto max-h-screen ${imageAspectClassName}`}
                >
                  <Image
                    src={image.src}
                    layout="fill"
                    objectFit="cover"
                    alt={name}
                    placeholder="blur"
                    blurDataURL={image.base64}
                    priority={index === startIndex}
                    lazyBoundary="0px"
                  />
                  <figcaption className="absolute left-0 bottom-0 bg-gradient-to-r from-neutral-900 p-6 text-neutral-400">
                    <header className="mb-1 text-3xl font-black drop-shadow-xl group-hover:text-orange-300">
                      {name}
                    </header>
                  </figcaption>
                </figure>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default memo(GalleryCarousel)
