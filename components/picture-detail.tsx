import {useState} from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import {getAspectRatio} from 'lib/utils'
import {Picture} from 'types/gallery'
import Image from './image'
import PictureInfo from './picture-info'
import ButtonToggle from './button-toggle'
import IconInformationCircle from 'assets/icons/information-circle.svg'
import IconMap from 'assets/icons/map.svg'

const DynamicMap = dynamic(() => import('./map'), {
  ssr: false
})

export default function PictureDetail({
  picture,
  isFullScreen,
  onTagClick
}: PictureDetailProp) {
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
    coordinates
  } = picture
  const {t} = useTranslation('gallery')
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
                  <div className="-ml-1.5 py-1.5">
                    {tags.map(({id, name, href}) => (
                      <Link
                        key={id}
                        href={href}
                        onClick={onTagClick}
                        title={name}
                        className="inline-block px-1.5 py-1.5 text-xs font-extrabold leading-[0.5] text-neutral-600/60 drop-shadow-sm hover:text-orange-300/60"
                      >
                        <span className="font-extralight">#</span> {name}
                      </Link>
                    ))}
                  </div>
                )}

                <PictureInfo {...pictureInfoProps} isOpen={showInfo} />

                {showMap && coordinates && (
                  <div className="h-60 w-full overflow-hidden rounded-sm py-3 drop-shadow">
                    <DynamicMap pictures={[{slug, coordinates}]} zoom={10} />
                  </div>
                )}

                <div className="mt-3 flex">
                  <ButtonToggle
                    onClick={() => {
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
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface PictureDetailProp {
  picture: Picture
  isFullScreen: boolean
  onTagClick: () => void
}
