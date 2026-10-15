import {ReactNode, useEffect, useState} from 'react'
import dynamic from 'next/dynamic'

// The cart library and Stripe's loader weigh on every page of the site, and
// only the shop uses them. Splitting them off keeps them out of the bundle the
// first visit has to parse, while the page of the shop itself is still
// prerendered with them.
const CartProvider = dynamic(() => import('./cart-provider'))

interface StoreCartProviderProps {
  isActive: boolean
  children: ReactNode
}

export default function StoreCartProvider({
  isActive,
  children
}: StoreCartProviderProps) {
  // A ref mutated in the render body leaks a stray write whenever React
  // discards a render without committing it, which state does not: it only
  // ever flips once, true to begin with or set here, and stays that way.
  const [everActive, setEverActive] = useState(isActive)
  if (isActive && !everActive) setEverActive(true)

  // Whoever browses around can still end up in the shop, so the chunk is
  // fetched once the browser is idle, which spares that navigation the wait
  // without having made the first load pay for it.
  useEffect(() => {
    const warm = () => import('./cart-provider')

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(warm, {timeout: 5000})

      return () => window.cancelIdleCallback(id)
    }

    const id = setTimeout(warm, 3000)

    return () => clearTimeout(id)
  }, [])

  if (!everActive) return <>{children}</>

  return <CartProvider>{children}</CartProvider>
}

StoreCartProvider.displayName = 'StoreCartProvider'
