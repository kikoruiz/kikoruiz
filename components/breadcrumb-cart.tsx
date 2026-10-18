import useTranslation from 'next-translate/useTranslation'
import {useShoppingCart} from 'use-shopping-cart'
import {trackEvent, getCartItems} from 'lib/tracking'
import BreadcrumbActionButton from './breadcrumb-action-button'
import IconShoppingCart from 'assets/icons/shopping-cart.svg'

export default function BreadcrumbCart() {
  const {t} = useTranslation()
  const {handleCartHover, cartCount, cartDetails, totalPrice, currency} =
    useShoppingCart()

  return (
    <BreadcrumbActionButton
      icon={IconShoppingCart}
      title={t('store:shopping-cart', {count: cartCount})}
      bagdeContent={cartCount}
      className="gap-3"
      onClick={() => {
        handleCartHover()
        trackEvent('view_cart', {
          value: totalPrice,
          currency: currency.toUpperCase(),
          items: getCartItems(cartDetails)
        })
      }}
    >
      {Boolean(totalPrice) && t('store:price', {count: totalPrice})}
    </BreadcrumbActionButton>
  )
}

BreadcrumbCart.displayName = 'BreadcrumbCart'
