import {PropsWithChildren} from 'react'
import {usePresence} from 'hooks/use-presence'

interface CollapsibleProps extends PropsWithChildren {
  isOpen: boolean
  // Keeps the content in the markup while it is closed, so what a search engine
  // reads is there even if nobody ever opens it. A closed one is invisible, so
  // it is out of the way of the keyboard and of assistive technology too.
  keepMounted?: boolean
}

// Height cannot be animated to `auto`, but a grid row can travel between 0fr
// and 1fr. The content stays mounted until the closing slide is over.
export default function Collapsible({
  isOpen,
  keepMounted = false,
  children
}: CollapsibleProps) {
  const {isRendered, isVisible: isExpanded} = usePresence(isOpen)

  if (!isRendered && !keepMounted) return null

  return (
    <div
      className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-in-out ${
        isExpanded
          ? 'grid-rows-[1fr] opacity-100'
          : `grid-rows-[0fr] opacity-0${keepMounted ? ' invisible' : ''}`
      }`}
    >
      <div
        className={`min-h-0 overflow-hidden transition-transform duration-300 ease-in-out ${
          isExpanded ? 'translate-y-0' : '-translate-y-3'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

Collapsible.displayName = 'Collapsible'
