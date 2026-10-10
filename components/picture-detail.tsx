import {useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import {getAspectRatio, getSlug, themeScreens} from 'lib/utils'
import {fromRawTagsToTags} from 'lib/gallery/tags'
import {Picture} from 'types/gallery'
import Image from './image'
import PictureInfo from './picture-info'
import ButtonToggle from './button-toggle'
import IconInformationCircle from 'assets/icons/information-circle.svg'
import IconMap from 'assets/icons/map.svg'
import IconMapPin from 'assets/icons/map-pin.svg'
import IconDocumentText from 'assets/icons/document-text.svg'
import IconShoppingBag from 'assets/icons/shopping-bag.svg'
import IconDocumentArrowDown from 'assets/icons/document-arrow-down.svg'
import IconShare from 'assets/icons/share.svg'
import IconCheckCircle from 'assets/icons/check-circle.svg'
import ButtonLink from './button-link'
import Button from './button'

interface PictureDetailProps {
  picture: Picture
  isFullScreen: boolean
  needsPreload?: boolean
  isLazy?: boolean
  trackEvent: (action: string, name?: string) => void
  wrapperClassName?: string
}

const DynamicMap = dynamic(() => import('./map'), {
  ssr: false
})

export default function PictureDetail({
  picture,
  isFullScreen,
  needsPreload,
  isLazy = false,
  trackEvent,
  wrapperClassName
}: PictureDetailProps) {
  const {
    name,
    id,
    slug,
    image,
    imageSize,
    date,
    processingDate,
    prettyDate,
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
    print,
    download,
    permalink
  } = picture
  const {t} = useTranslation('gallery')
  const {query, locale, defaultLocale} = useRouter()
  const {tag} = query
  // The permalink already carries the translated slugs, but not the locale
  // prefix the routes hang from, so without it the copied link is a 404.
  const localePath = locale === defaultLocale ? '' : `/${locale}`
  const [showInfo, setShowPictureInfo] = useState(false)
  const [showMap, setShowPictureMap] = useState(false)
  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const aspectRatio = getAspectRatio(imageSize)
  const tags = fromRawTagsToTags({rawTags, t})
  const pictureInfoProps = {
    shotInfo,
    isPano,
    isStarTracked,
    model,
    lens,
    editingSoftware,
    aspectRatio,
    processingDate,
    prettyProcessingDate
  }
  const {sm, lg} = themeScreens
  const sizes =
    image.orientation === 'vertical'
      ? `(min-width: ${lg}) 33vw, (min-width: ${sm}) 50vw, 100vw`
      : '100vw'
  const showInfoText = showInfo
    ? t('carousel.hide-picture-info')
    : t('carousel.show-picture-info')
  const showMapText = showMap
    ? t('carousel.hide-picture-map')
    : t('carousel.show-picture-map')
  const locationName =
    location &&
    `${location.city}, ${location.state.replace('Province', '')} (${
      location.country
    })`

  return (
    <div
      key={id}
      className={`${
        wrapperClassName ? `${wrapperClassName} ` : ''
      }flex-[0_0_100%]`}
    >
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
          sizes={sizes}
          fallbackStyle={image.css}
          needsPreload={needsPreload}
          isLazy={isLazy}
        />

        {!isFullScreen && (
          <div className="fixed top-0 flex h-full w-full flex-col-reverse">
            <div className="bg-gradient-to-r from-neutral-900 via-neutral-900">
              <section className="mx-auto p-6 text-neutral-400 xl:max-w-5xl">
                <header className="mb-1 text-3xl font-black drop-shadow group-hover:text-orange-300">
                  {name}
                </header>

                <div className="mb-2 flex flex-col gap-1.5">
                  <time className="flex text-neutral-300/40" dateTime={date}>
                    {prettyDate}
                  </time>

                  {locationName && coordinates && (
                    <address className="text-xs font-extralight not-italic">
                      <Link
                        href={`https://www.google.es/maps/place/${coordinates.latitude},${coordinates.longitude}`}
                        target="_blank"
                        title={locationName}
                        className="inline-flex items-center text-orange-300/60 hover:text-orange-300/90"
                      >
                        <IconMapPin className="mr-1 w-3" />
                        {locationName}
                      </Link>
                    </address>
                  )}
                </div>

                {tags.length > 0 && (
                  <div className="-ml-1.5 mb-3 pt-1.5">
                    {tags.map(({id, name, href}) => {
                      const currentTag = getSlug(t(`tags.${id}`))
                      const baseClassName =
                        'inline-block px-1.5 py-1.5 text-xs font-extrabold leading-[0.5] text-neutral-600/60 drop-shadow-sm'
                      const content = (
                        <>
                          <span className="font-extralight">#</span> {name}
                        </>
                      )

                      return tag === currentTag ? (
                        <div
                          key={id}
                          className={`${baseClassName} rounded-full border border-neutral-600/30 first:ml-1.5`}
                        >
                          {content}
                        </div>
                      ) : (
                        <Link
                          key={id}
                          href={href}
                          title={name}
                          className={`${baseClassName} hover:text-neutral-300/60`}
                        >
                          {content}
                        </Link>
                      )
                    })}
                  </div>
                )}

                <PictureInfo {...pictureInfoProps} isOpen={showInfo} />

                {showMap && coordinates && (
                  <div className="mb-5 h-60 w-full overflow-hidden rounded drop-shadow">
                    <DynamicMap pictures={[{slug, coordinates}]} zoom={10} />
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <div className="flex">
                    <ButtonToggle
                      onClick={() => {
                        if (showInfo) {
                          trackEvent('hide_info', name)
                        } else {
                          trackEvent('show_info', name)
                        }
                        setShowPictureInfo(!showInfo)
                      }}
                      label={showInfoText}
                      isToggled={showInfo}
                    >
                      <IconInformationCircle className="mr-1.5 w-3" />
                      {showInfoText}
                    </ButtonToggle>

                    {coordinates && (
                      <ButtonToggle
                        onClick={() => {
                          if (showMap) {
                            trackEvent('hide_map', name)
                          } else {
                            trackEvent('show_map', name)
                          }
                          setShowPictureMap(!showMap)
                        }}
                        label={showMapText}
                        isToggled={showMap}
                      >
                        <IconMap className="mr-1.5 w-3" />
                        {showMapText}
                      </ButtonToggle>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 empty:hidden">
                    <Button
                      size="small"
                      isRounded
                      intent="primary"
                      title={t('common:gallery.picture.copy-link')}
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          `${window.location.origin}${localePath}${permalink}`
                        )
                        setIsLinkCopied(true)
                        trackEvent('copy_picture_link', name)
                      }}
                    >
                      <span className="inline-flex items-center">
                        {isLinkCopied ? (
                          <IconCheckCircle className="mr-1.5 w-3" />
                        ) : (
                          <IconShare className="mr-1.5 w-3" />
                        )}
                        {isLinkCopied
                          ? t('common:gallery.picture.link-copied')
                          : t('common:gallery.picture.copy-link')}
                      </span>
                    </Button>

                    {print && (
                      <ButtonLink
                        href={print}
                        title={t('carousel.order-print')}
                        intent="accent"
                      >
                        <IconShoppingBag className="mr-1.5 w-3" />
                        {t('carousel.order-print')}
                      </ButtonLink>
                    )}

                    {download && (
                      <ButtonLink
                        href={download}
                        title={t('carousel.download-picture')}
                        intent="accent"
                      >
                        <IconDocumentArrowDown className="mr-1.5 w-3" />
                        {t('carousel.download-picture')}
                      </ButtonLink>
                    )}

                    {tutorial?.href && (
                      <ButtonLink
                        href={tutorial.href}
                        title={t('common:blog.post.read-tutorial')}
                      >
                        <IconDocumentText className="mr-1.5 w-3" />
                        {t('common:blog.post.read-tutorial')}
                      </ButtonLink>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

PictureDetail.displayName = 'PictureDetail'
