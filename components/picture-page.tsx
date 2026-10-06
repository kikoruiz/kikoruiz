import Link from 'next/link'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import Image from './image'
import PictureInfo from './picture-info'
import ButtonLink from './button-link'
import {getAspectRatio, themeScreens} from 'lib/utils'
import {fromRawTagsToTags} from 'lib/gallery/tags'
import {trackEvent} from 'lib/tracking'
import {DEFAULT_UNIT_OF_MEASUREMENT, PRINT_SIZES} from 'config/store'
import papers from 'data/store/papers.json'
import {Picture, PictureSibling} from 'types/gallery'
import {PicturePrint} from 'types/store'
import IconMapPin from 'assets/icons/map-pin.svg'
import IconShoppingBag from 'assets/icons/shopping-bag.svg'
import IconDocumentText from 'assets/icons/document-text.svg'

interface PicturePageProps {
  picture: Picture
  album: {id: string; name: string}
  siblings: PictureSibling[]
  prints: PicturePrint[]
}

const DynamicMap = dynamic(() => import('./map'), {ssr: false})

export default function PicturePage({
  picture,
  album,
  siblings,
  prints
}: PicturePageProps) {
  const {t} = useTranslation()
  const {
    name,
    slug,
    description,
    image,
    imageSize,
    date,
    prettyDate,
    processingDate,
    prettyProcessingDate,
    shotInfo,
    isPano,
    isStarTracked,
    model,
    lens,
    editingSoftware,
    rawTags,
    coordinates,
    location,
    tutorial,
    print
  } = picture
  const {sm, lg} = themeScreens
  const aspectRatio = getAspectRatio(imageSize)
  const tags = fromRawTagsToTags({rawTags, t})
  const [width, height] = imageSize.split('x').map(Number)
  const locationName =
    location &&
    `${location.city}, ${location.state.replace('Province', '')} (${
      location.country
    })`
  const paperNames = [...new Set(prints.map(({paper}) => paper))]
    .map(paper => `${papers[paper].brand} ${papers[paper].type}`)
    .join(', ')
  const lowestPrice = prints.length > 0 && Math.min(...prints.map(p => p.price))

  return (
    <article className="mx-auto px-6 pb-12 xl:max-w-5xl">
      <Image
        src={image.src}
        alt={name}
        className="overflow-hidden rounded-md"
        aspectRatio={aspectRatio}
        style={aspectRatio ? {} : {aspectRatio: `${width} / ${height}`}}
        sizes={`(min-width: ${lg}) 66vw, 100vw`}
        fallbackStyle={image.css}
        isLazy={false}
        needsPreload
        isRounded
      />

      <header className="mt-9">
        <h1 className="text-4xl font-black drop-shadow sm:text-6xl">{name}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <time className="text-neutral-300/40" dateTime={date}>
            {prettyDate}
          </time>

          {locationName && coordinates && (
            <address className="font-extralight not-italic">
              <Link
                href={`https://www.google.es/maps/place/${coordinates.latitude},${coordinates.longitude}`}
                target="_blank"
                title={locationName}
                className="inline-flex items-center text-orange-300/60 hover:text-orange-300/90"
              >
                <IconMapPin className="mr-1.5 w-3" />
                {locationName}
              </Link>
            </address>
          )}
        </div>
      </header>

      {description && (
        <p className="mt-6 max-w-3xl font-light leading-relaxed text-neutral-300/90">
          {description}
        </p>
      )}

      {tags.length > 0 && (
        <div className="-ml-1.5 mt-6">
          {tags.map(({id, name, href}) => (
            <Link
              key={id}
              href={href}
              title={name}
              className="inline-block px-1.5 py-1.5 text-xs font-extrabold leading-[0.5] text-neutral-600/60 drop-shadow-sm hover:text-neutral-300/60"
            >
              <span className="font-extralight">#</span> {name}
            </Link>
          ))}
        </div>
      )}

      {coordinates && (
        <section className="mt-9">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-300/30">
            {t('gallery.picture.location')}
          </h2>

          <div className="h-60 w-full overflow-hidden rounded drop-shadow sm:h-72">
            <DynamicMap pictures={[{slug, coordinates}]} zoom={10} />
          </div>
        </section>
      )}

      <section className="mt-9">
        <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-300/30">
          {t('gallery.picture.technical-info')}
        </h2>

        <PictureInfo
          isOpen
          shotInfo={shotInfo}
          isPano={isPano}
          isStarTracked={isStarTracked}
          model={model}
          lens={lens}
          editingSoftware={editingSoftware}
          aspectRatio={aspectRatio}
          processingDate={processingDate}
          prettyProcessingDate={prettyProcessingDate}
        />
      </section>

      {prints.length > 0 && (
        <section className="mt-9 rounded-md border border-neutral-700/60 bg-gradient-to-b from-neutral-800/60 p-6">
          <h2 className="text-2xl font-black text-orange-300/90">
            {t('store.categories.prints.name')}
          </h2>

          <p className="mt-3 text-sm font-light text-neutral-300/60">
            {t('gallery.picture.prints-from', {price: lowestPrice})}
            {paperNames && ` · ${paperNames}`}
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {prints.map(({id, size, isBorderless, price}) => (
              <li
                key={id}
                className="flex items-baseline justify-between gap-3 border-b border-neutral-700/30 pb-3"
              >
                <span className="text-sm font-light text-neutral-300/60">
                  {size}
                  {isBorderless &&
                    ` ${t('store:filters.borderless').toLowerCase()}`}{' '}
                  <span className="font-thin text-neutral-300/30">
                    ({PRINT_SIZES[size][DEFAULT_UNIT_OF_MEASUREMENT]}{' '}
                    {DEFAULT_UNIT_OF_MEASUREMENT})
                  </span>
                </span>

                <span className="font-black text-orange-300">
                  {t('store:price', {count: price})}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <ButtonLink
              href={print}
              title={t('gallery.picture.order-print')}
              intent="accent"
              onClick={() => {
                trackEvent({action: 'order_print', label: name})
              }}
            >
              <IconShoppingBag className="mr-1.5 w-3" />
              {t('gallery.picture.order-print')}
            </ButtonLink>
          </div>
        </section>
      )}

      {tutorial?.href && (
        <div className="mt-9">
          <ButtonLink
            href={tutorial.href}
            title={t('blog.post.read-tutorial')}
            intent="primary"
          >
            <IconDocumentText className="mr-1.5 w-3" />
            {t('blog.post.read-tutorial')}
          </ButtonLink>
        </div>
      )}

      {siblings.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-wide text-neutral-300/30">
            {t('gallery.picture.more-from-album', {album: album.name})}
          </h2>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {siblings.map(sibling => (
              <li key={sibling.slug}>
                <Image
                  src={sibling.image.src}
                  url={sibling.permalink}
                  alt={sibling.name}
                  className="block w-full"
                  aspectRatio="1:1"
                  sizes={`(min-width: ${sm}) 17vw, 50vw`}
                  fallbackStyle={sibling.image.css}
                  isRounded
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}

PicturePage.displayName = 'PicturePage'
