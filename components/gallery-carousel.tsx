import {useEffect, useState, useSyncExternalStore, memo} from 'react'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import useEmblaCarousel from 'embla-carousel-react'
import omit from 'lodash/omit'
import {getCapitalizedName, getSlug} from 'lib/utils'
import {trackEvent} from 'lib/tracking'
import PictureViewer from './picture-viewer'
import subcategoryIcons from './gallery-subcategory-icons'
import {Picture, Subcategory} from 'types/gallery'
import {GALLERY_ALBUMS, PICTURE_ROUTE} from 'config/gallery'

interface GalleryCarouselProps {
  pictures: Picture[]
  openPicture: Picture
  category?: string
  subcategories?: Subcategory[]
  basePath: string
}

const subscribeToNothing = () => () => {}

function GalleryCarousel({
  pictures,
  openPicture,
  category,
  subcategories,
  basePath
}: GalleryCarouselProps) {
  const {push, pathname, query} = useRouter()
  const {t} = useTranslation('gallery')
  const queryKey = t('common:gallery.carousel.query-key')
  const isPicturePage = pathname === PICTURE_ROUTE
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
  const index = items.findIndex(({slug}) => slug === openPicture.slug)
  // Freezing the index the carousel opened at keeps the options object stable,
  // since Embla re-initialises whenever they change.
  const [startIndex] = useState(index)
  // Server side only the open picture is a slide, otherwise the markup, and so
  // the first paint, would show the first picture of the album until Embla
  // moves the container. The rest join in as soon as there is JavaScript.
  const isHydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  )
  const slides = isHydrated ? items : [items[index]]
  const [emblaRef, emblaApi] = useEmblaCarousel({startIndex})
  const needsButtonPrevious = emblaApi
    ? emblaApi.selectedScrollSnap() !== 0
    : index !== 0
  const needsButtonNext = emblaApi
    ? emblaApi.selectedScrollSnap() !== items.length - 1
    : index !== items.length - 1
  let subcategoryName
  let subcategoryEmoji
  let SubcategoryIcon
  if (subcategories) {
    subcategoryName = t(
      `common:gallery.albums.${category}.subcategories.${getSlug(
        items[index].subcategory
      )}`
    )
    subcategoryEmoji = GALLERY_ALBUMS.find(
      ({id}) => id === category
    ).subcategories?.find(({id}) => id === items[index].subcategory)?.emoji
    SubcategoryIcon =
      subcategoryIcons[`Icon${getCapitalizedName(items[index].subcategory)}`]
  }

  function trackCarouselEvent(action: string, name?: string) {
    const index = emblaApi?.selectedScrollSnap()
    const label = name || (index && items[index].name)

    trackEvent({action, category: 'carousel', ...(label && {label})})
  }

  function handleButtonClose() {
    trackCarouselEvent('close')

    // Closing on the picture page means leaving its route, so that is the one
    // navigation which cannot be shallow. Everywhere else the album is still
    // behind the viewer, so leaving its scroll alone brings the visitor back
    // next to the picture just closed.
    if (isPicturePage) {
      push(basePath)
    } else {
      push({pathname, query: omit(query, queryKey)}, basePath, {
        shallow: true,
        scroll: false
      })
    }
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

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.reInit({startIndex: index})
    // Re-initialising at the open picture is what keeps it on screen once the
    // rest of the album joins it, so this deliberately ignores later `index`
    // changes: those come from scrolling, which must not reset the carousel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emblaApi, slides.length])

  useEffect((): (() => void) => {
    function handleSelect() {
      const {slug, permalink} = items[emblaApi.selectedScrollSnap()]

      if (slug === openPicture.slug) return

      // Only the album owning the picture has a page for it, so from the rest,
      // and from a tag or the home listing, the open one stays in the query.
      const ownsPicture = permalink === `${basePath}/${slug}`

      push(
        {
          pathname,
          query: {...query, [isPicturePage ? 'picture' : queryKey]: slug}
        },
        ownsPicture ? permalink : `${basePath}?${queryKey}=${slug}`,
        {shallow: true, scroll: false}
      )
    }

    emblaApi?.on('select', handleSelect)

    return () => emblaApi?.off('select', handleSelect)
  }, [
    basePath,
    emblaApi,
    items,
    isPicturePage,
    openPicture.slug,
    pathname,
    push,
    query,
    queryKey
  ])

  return (
    <PictureViewer
      ref={emblaRef}
      pictures={slides}
      index={index}
      total={items.length}
      openSlug={openPicture.slug}
      rootClassName="embla"
      containerClassName="embla__container"
      detailClassName="embla__slide"
      translationsPrefix="carousel"
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

GalleryCarousel.displayName = 'GalleryCarousel'
