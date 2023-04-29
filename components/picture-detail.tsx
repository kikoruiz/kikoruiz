import {useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import {getAspectRatio, getSlug} from 'lib/utils'
import {Picture} from 'types/gallery'
import Image from './image'
import PictureInfo from './picture-info'
import ButtonToggle from './button-toggle'
import IconInformationCircle from 'assets/icons/information-circle.svg'
import IconMap from 'assets/icons/map.svg'
import IconDocumentText from 'assets/icons/document-text.svg'
import IconChevronRight from 'assets/icons/chevron-right.svg'

const DynamicMap = dynamic(() => import('./map'), {
  ssr: false
})

export default function PictureDetail({
  picture,
  isFullScreen,
  onExit,
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
    prettyDate,
    shotInfo,
    isPano,
    model,
    lens,
    editingSoftware,
    tags,
    coordinates,
    tutorial
  } = picture
  const {t} = useTranslation('gallery')
  const {query} = useRouter()
  const {tag} = query
  const [showInfo, setShowPictureInfo] = useState(false)
  const [showMap, setShowPictureMap] = useState(false)
  const aspectRatio = getAspectRatio(imageSize)
  const pictureInfoProps = {
    shotInfo,
    isPano,
    model,
    lens,
    editingSoftware,
    aspectRatio
  }
  const showInfoText = showInfo
    ? t('carousel.hide-picture-info')
    : t('carousel.show-picture-info')
  const showMapText = showMap
    ? t('carousel.hide-picture-map')
    : t('carousel.show-picture-map')

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
          sizes="100vw"
          fallbackStyle={image.css}
        />

        {!isFullScreen && (
          <div className="fixed top-0 flex h-full w-full flex-col-reverse">
            <div className="bg-gradient-to-r from-neutral-900 via-neutral-900">
              <section className="mx-auto p-6 text-neutral-400 xl:max-w-5xl">
                <header className="mb-1 text-3xl font-black drop-shadow group-hover:text-orange-300">
                  {name}
                </header>

                <time className="flex text-neutral-300/40" dateTime={date}>
                  {prettyDate}
                </time>

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
                          onClick={onExit}
                          title={name}
                          className={`${baseClassName} hover:text-orange-300/60`}
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

                {tutorial?.href && (
                  <Link
                    href={tutorial.href}
                    onClick={onExit}
                    title={t('common:blog.post.read-tutorial')}
                    className="group mt-3 inline-flex items-center rounded-full border border-orange-600/60 bg-gradient-to-tr from-orange-300 to-orange-200 px-3 py-1.5 text-xs font-light text-orange-700/90 shadow-sm transition-colors hover:from-orange-400 hover:to-orange-300 hover:text-orange-900/90"
                  >
                    <IconDocumentText className="mr-1.5 w-3" />
                    {t('common:blog.post.read-tutorial')}
                    <IconChevronRight className="invisible relative -left-3 w-0 transition-all group-hover:visible group-hover:left-0 group-hover:-mr-1 group-hover:ml-1 group-hover:w-3" />
                  </Link>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface PictureDetailProps {
  picture: Picture
  isFullScreen: boolean
  onExit: () => void
  trackEvent: (action: string, name?: string) => void
  wrapperClassName?: string
}
