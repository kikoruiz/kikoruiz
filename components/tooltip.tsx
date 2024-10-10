import {FC, useState, type SVGProps} from 'react'
import {UAParser} from 'ua-parser-js'

interface TooltipProps {
  message: string
  icon: FC<SVGProps<SVGSVGElement>>
  className?: string
  direction?: 'left' | 'bottom'
  type?: 'info' | 'warning'
}

function typeClassName({
  type,
  isOpen
}: {
  type: string
  isOpen: boolean
}): string {
  switch (type) {
    case 'warning':
      return isOpen ? 'text-orange-500' : 'text-orange-500/60'
    case 'info':
      return isOpen ? 'text-neutral-300' : 'text-neutral-300/60'
  }
}

export default function Tooltip({
  message,
  icon: Icon,
  className,
  direction = 'left',
  type = 'info'
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  let directionClassName: string

  switch (direction) {
    case 'left':
      directionClassName =
        'right-0 top-0 h-full mr-11 after:left-full after:border-y-4 after:border-l-4 after:border-y-transparent after:border-l-neutral-800'
      break
    case 'bottom':
      directionClassName =
        'top-full left-1/2 -translate-x-1/2 mt-2 after:-top-1 after:left-1/2 after:-translate-x-1/2 after:border-x-4 after:border-b-4 after:border-x-transparent after:border-b-neutral-800'
      break
  }

  return (
    <div
      className={`relative flex max-w-full items-center rounded-full bg-neutral-800 p-1.5 hover:cursor-help${
        className ? ` ${className}` : ''
      } ${typeClassName({type, isOpen})}`}
      onClick={() => {
        const {device} = UAParser()

        if (device.type) setIsOpen(!isOpen)
      }}
      onMouseEnter={() => {
        const {device} = UAParser()

        if (!device.type) setIsOpen(true)
      }}
      onMouseLeave={() => {
        const {device} = UAParser()

        if (!device.type) setIsOpen(false)
      }}
    >
      <Icon className="w-6" />

      {isOpen && (
        <div
          className={`absolute z-10 flex w-52 select-none items-center text-xs font-extralight leading-normal drop-shadow-lg after:absolute after:inline-block after:h-0 after:w-0 after:align-middle sm:w-max ${directionClassName}`}
        >
          <p className="rounded bg-neutral-800 px-3 py-1.5">{message}</p>
        </div>
      )}
    </div>
  )
}

Tooltip.displayName = 'Tooltip'
