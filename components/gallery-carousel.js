import {useEffect, memo} from 'react'
import {useRouter} from 'next/router'
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
        className="absolute top-3 right-3 flex h-11 w-11 rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 hover:text-neutral-300 focus:outline-none sm:top-6 sm:right-6"
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
        <div className="embla__container flex">
          {items.map(({name, id}) => {
            return (
              <div key={id} className="embla__slide flex-[0_0_100%]">
                {name}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default memo(GalleryCarousel)
