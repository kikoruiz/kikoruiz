import useTranslation from 'next-translate/useTranslation'
import {useShoppingCart} from 'use-shopping-cart'
import {CartEntry} from 'use-shopping-cart/core'
import Image from './image'
import ButtonSymbol from './button-symbol'
import {themeScreens} from 'lib/utils'
import {GetPlaiceholderReturn} from 'plaiceholder'

interface ShoppingCartItemProps extends CartEntry {
  isCheckoutLoading?: boolean
}
interface ProductDataInterface {
  image: {
    aspectRatio: string
    css: GetPlaiceholderReturn['css']
  }
  paper: string
  size: string
}

export default function ShoppingCartItem({
  id,
  name,
  image: src,
  quantity,
  value,
  product_data: productData,
  isCheckoutLoading = false
}: ShoppingCartItemProps) {
  const {sm} = themeScreens
  const {decrementItem, incrementItem} = useShoppingCart()
  const {image} = productData as ProductDataInterface
  const {t} = useTranslation('store')

  return (
    <div className="relative flex flex-row gap-3 md:gap-6 w-full py-6 sm:p-6 after:absolute after:left-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:bottom-[-1px] after:via-neutral-300/30 hover:bg-neutral-600/10 hover:rounded transition-colors">
      <div className="relative w-1/3 bg-gradient-to-bl from-neutral-600 via-neutral-200 to-neutral-400 p-6 drop-shadow-md">
        <Image
          src={src}
          alt={name}
          aspectRatio={image.aspectRatio}
          sizes={`(min-width: ${sm}) 50vw, 100vw`}
          fallbackStyle={image.css}
        />
      </div>

      <div className="flex flex-col justify-between grow text-lg">
        <header className="font-extralight">{name}</header>

        <div className="flex items-center justify-between">
          <span className="font-black text-xl text-orange-300">
            {t('price', {count: value})}
          </span>

          <div
            className={`flex items-center gap-1.5 rounded-full border border-neutral-600 p-1${isCheckoutLoading ? ' opacity-60' : ''}`}
          >
            <ButtonSymbol
              title="Decrease quantity"
              onClick={() => {
                decrementItem(id)
              }}
              disabled={isCheckoutLoading}
            >
              -
            </ButtonSymbol>

            <span className="text-xs">{quantity}</span>

            <ButtonSymbol
              title="Increase quantity"
              onClick={() => {
                incrementItem(id)
              }}
              disabled={isCheckoutLoading}
            >
              +
            </ButtonSymbol>
          </div>
        </div>
      </div>
    </div>
  )
}
