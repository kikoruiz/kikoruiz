import {useEffect, memo} from 'react'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import useEmblaCarousel from 'embla-carousel-react'
import {getCapitalizedName, getSlug} from 'lib/utils'
import {trackEvent} from 'lib/tracking'
import PictureViewer from './picture-viewer'
import subcategoryIcons from './gallery-subcategory-icons'
import {Picture, Subcategory} from 'types/gallery'
import {GALLERY_ALBUMS} from 'config/gallery'

let startIndex: number | undefined

function GalleryCarousel({
  pictures,
  category,
  subcategories,
  setIsCarouselOpen
}: GalleryCarouselProps) {
  const {push, asPath, query} = useRouter()
  const {t} = useTranslation('gallery')
  const queryKey = t('common:gallery.carousel.query-key')
  const {[queryKey]: slug} = query
  const items: Picture[] = subcategories
    ? subcategories.reduce(
        (acc, subcategory) => [
          ...acc,
          ...pictures
            .filter(({rawTags}) => rawTags.includes(subcategory.tag))
            .map(attrs => ({...attrs, subcategory: subcategory.tag}))
        ],
        []
      )
    : pictures
  const index = slug && items.findIndex(({name}) => getSlug(name) === slug)
  if (typeof startIndex === 'undefined') startIndex = index
  const [emblaRef, emblaApi] = useEmblaCarousel({startIndex})
  const needsButtonPrevious = emblaApi
    ? emblaApi.selectedScrollSnap() !== 0
    : startIndex !== 0
  const needsButtonNext = emblaApi
    ? emblaApi.selectedScrollSnap() !== items.length - 1
    : startIndex !== items.length - 1
  const item = items[index]
  let subcategoryName
  let subcategoryEmoji
  let SubcategoryIcon
  if (subcategories) {
    subcategoryName = t(
      `common:gallery.albums.${category}.subcategories.${getSlug(
        item.subcategory
      )}`
    )
    subcategoryEmoji = GALLERY_ALBUMS.find(
      ({id}) => id === category
    ).subcategories?.find(({id}) => id === item.subcategory)?.emoji
    SubcategoryIcon =
      subcategoryIcons[`Icon${getCapitalizedName(item.subcategory)}`]
  }

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
    if (emblaApi?.canScrollPrev()) {
      emblaApi.scrollPrev()
      trackCarouselEvent('go_to_previous')
    }
  }

  function handleButtonNext() {
    if (emblaApi?.canScrollNext()) {
      emblaApi.scrollNext()
      trackCarouselEvent('go_to_next')
    }
  }

  const paginationInfo = subcategoryName && (
    <span className="relative flex pl-3 after:absolute after:left-0 after:top-0 after:block after:h-full after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-neutral-600/60">
      <span className="inline-flex items-center pl-[1px]">
        {SubcategoryIcon && (
          <SubcategoryIcon className="mr-1.5 w-3 rounded-full opacity-90" />
        )}
        {subcategoryEmoji
          ? `${subcategoryEmoji} ${subcategoryName}`
          : subcategoryName}
      </span>
    </span>
  )

  useEffect((): (() => void) => {
    function handleSelect() {
      const index = emblaApi.selectedScrollSnap()
      const item = items[index]
      const slug = getSlug(item.name)
      const pathSeparator = `?${queryKey}=`
      const [destinationPath] = asPath.split(pathSeparator)
      const destination = `${destinationPath}${pathSeparator}${slug}`

      push(destination, destination, {shallow: true})
    }

    emblaApi?.on('select', handleSelect)

    return () => emblaApi?.off('select', handleSelect)
  }, [emblaApi, items, asPath, push, queryKey])

  return (
    <PictureViewer
      ref={emblaRef}
      pictures={items}
      index={index}
      rootClassName="embla"
      containerClassName="embla__container"
      detailClassName="embla__slide"
      translationsPrefix="carousel"
      onExit={resetCarousel}
      onClose={handleButtonClose}
      needsPrevious={needsButtonPrevious}
      onPrevious={handleButtonPrevious}
      needsNext={needsButtonNext}
      onNext={handleButtonNext}
      paginationInfo={paginationInfo}
      trackEvent={trackCarouselEvent}
    />
  )
}

export default memo(GalleryCarousel)

interface GalleryCarouselProps {
  pictures: Picture[]
  category?: string
  subcategories?: Subcategory[]
  setIsCarouselOpen: (isCarouselOpen: boolean) => void
}
