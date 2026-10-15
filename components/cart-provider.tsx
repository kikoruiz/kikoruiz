import {ReactNode} from 'react'
import {CartProvider as UseShoppingCartProvider} from 'use-shopping-cart'

export default function CartProvider({children}: {children: ReactNode}) {
  return (
    <UseShoppingCartProvider
      cartMode="checkout-session"
      stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string}
      currency="EUR"
      shouldPersist
    >
      {children}
    </UseShoppingCartProvider>
  )
}

CartProvider.displayName = 'CartProvider'
