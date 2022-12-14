import {useEffect, memo} from 'react'
import {useRouter} from 'next/router'
import useEmblaCarousel from 'embla-carousel-react'
import useTranslation from 'next-translate/useTranslation'
import Image from './image'
import {getSlug} from '../lib/utils'

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
          {items.map(
            ({name, id, image, date, prettyDate, shotInfo, isPano}, index) => {
              const imageAspectClassName =
                image.orientation === 'vertical' ? 'aspect-2/3' : 'aspect-3/2'
              const shotInfoList = [
                {
                  id: 'shutter-speed',
                  content: <>{shotInfo.shutterSpeed}s</>
                },
                {
                  id: 'aperture',
                  content: (
                    <>
                      <span className="italic">f</span>/{shotInfo.aperture}
                    </>
                  )
                },
                {
                  id: 'iso',
                  content: <>ISO {shotInfo.iso}</>
                },
                {
                  id: 'focal-length',
                  content: (
                    <>
                      {shotInfo.focalLength} mm{isPano && ' (pano)'}
                    </>
                  )
                }
              ]

              return (
                <div key={id} className="embla__slide flex-[0_0_100%]">
                  <div className="contents h-screen w-screen">
                    <Image
                      src={image.src}
                      alt={name}
                      className={`m-auto max-h-screen ${imageAspectClassName}`}
                      sizes="100vw"
                      needsPreload={index === startIndex}
                      fallbackStyle={image.css}
                    />

                    <div className="fixed top-0 flex h-full w-full flex-col-reverse">
                      <section className="bg-gradient-to-r from-neutral-900 p-6 text-neutral-400">
                        <header className="mb-1 text-3xl font-black drop-shadow-xl group-hover:text-orange-300">
                          {name}
                        </header>
                        <time className="text-neutral-300/40" dateTime={date}>
                          {prettyDate}
                        </time>
                        <dl className="mt-3 text-sm font-light text-neutral-300/60">
                          {shotInfoList.map(({id, content}) => (
                            <div className="flex flex-wrap" key={id}>
                              <dt className="mr-3 basis-2/4 text-right text-orange-300/60">
                                {t(`gallery:sorting.options.shot-info.${id}`)}
                              </dt>
                              <dd>{content}</dd>
                            </div>
                          ))}
                        </dl>
                      </section>
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
