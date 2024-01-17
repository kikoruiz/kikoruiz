import useTranslation from 'next-translate/useTranslation'
import Image from 'components/image'
import Button from 'components/button'
import Logo from 'assets/brand/photo-logo.svg'
import {themeScreens} from 'lib/utils'
import {Print} from 'types/store'
import {useState} from 'react'

export default function PrintCard({
  id,
  name,
  url,
  price,
  image,
  aspectRatio
}: Print) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const {t} = useTranslation('store')
  const {sm, lg} = themeScreens
  const {css, src} = image

  return (
    <div
      key={id}
      className="group p-3 bg-neutral-800 hover:bg-neutral-700 rounded-md break-inside-avoid-column"
    >
      <div className="relative bg-gradient-to-bl from-neutral-600 via-neutral-200 to-neutral-400 p-[10%] drop-shadow-md group-hover:from-neutral-100 group-hover:to-neutral-100 group-hover:drop-shadow-xl before:absolute before:z-10 before:content-[''] before:top-0 before:right-0 before:border-solid before:border-b-[.75em] before:border-r-[.75em] before:border-y-neutral-300/60 before:border-x-neutral-800 before:transition-[border-width] group-hover:before:border-y-neutral-300/90 group-hover:before:border-x-neutral-700 group-hover:before:border-b-[1.5em] group-hover:before:border-r-[1.5em]">
        <Image
          src={src}
          url={url}
          alt={name}
          aspectRatio={aspectRatio}
          sizes={`(min-width: ${lg}) 33vw, (min-width: ${sm}) 50vw, 100vw`}
          fallbackStyle={css}
          onLoad={() => {
            setIsImageLoaded(true)
          }}
        />

        {isImageLoaded && (
          <Logo className="absolute left-[calc(10%+1em)] bottom-[calc(10%)] w-9 fill-white/80" />
        )}
      </div>

      <div className="flex items-center justify-between mt-3 py-1.5 pl-1.5">
        <span className="font-black text-2xl group-hover:text-neutral-100 drop-shadow">
          {t('price', {count: price})}
        </span>

        <Button
          intent="accent"
          isRounded
          className="snipcart-add-item"
          data-item-id={id}
          data-item-name={name}
          data-item-price={price}
          data-item-url={url}
          data-item-image={src}
        >
          {t('add-to-cart')}
        </Button>
      </div>
    </div>
  )
}
