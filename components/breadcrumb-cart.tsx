import useTranslation from 'next-translate/useTranslation'
import {useShoppingCart} from 'use-shopping-cart'
import {trackEvent} from 'lib/tracking'
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
        trackEvent({
          action: 'view_cart',
          value: totalPrice,
          currency: currency.toUpperCase(),
          items: Object.keys(cartDetails).map(id => {
            const item = cartDetails[id]
            const {id: productId} = item.product_data as {id: string}

            return {
              id: productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity
            }
          })
        })
      }}
    >
      {Boolean(totalPrice) && t('store:price', {count: totalPrice})}
    </BreadcrumbActionButton>
  )
}

BreadcrumbCart.displayName = 'BreadcrumbCart'
