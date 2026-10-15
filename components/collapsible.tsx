import {PropsWithChildren, useEffect, useState} from 'react'

interface CollapsibleProps extends PropsWithChildren {
  isOpen: boolean
}

const DURATION = 300

// Height cannot be animated to `auto`, but a grid row can travel between 0fr
// and 1fr. The content stays mounted until the closing slide is over.
export default function Collapsible({isOpen, children}: CollapsibleProps) {
  const [isRendered, setIsRendered] = useState(isOpen)
  const [isExpanded, setIsExpanded] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true)
      let innerFrame: number
      const outerFrame = requestAnimationFrame(() => {
        innerFrame = requestAnimationFrame(() => setIsExpanded(true))
      })

      return () => {
        cancelAnimationFrame(outerFrame)
        cancelAnimationFrame(innerFrame)
      }
    }

    setIsExpanded(false)
    const timeout = setTimeout(() => setIsRendered(false), DURATION)

    return () => clearTimeout(timeout)
  }, [isOpen])

  if (!isRendered) return null

  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
        isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
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
