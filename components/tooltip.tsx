import {FunctionComponent, useState} from 'react'

export default function Tooltip({
  message,
  icon: Icon,
  className,
  direction = 'left'
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  let directionClassName

  switch (direction) {
    case 'left':
      directionClassName =
        'right-0 top-0 h-full mr-11 text-right after:left-full after:border-y-4 after:border-l-4 after:border-y-transparent after:border-l-neutral-800'
      break
    case 'bottom':
      directionClassName =
        'top-full left-1/2 -translate-x-1/2 mt-2 after:-top-1 after:left-1/2 after:-translate-x-1/2 after:border-x-4 after:border-b-4 after:border-x-transparent after:border-b-neutral-800'
      break
  }

  return (
    <div
      className={`relative flex max-w-full items-center rounded-full bg-neutral-800 p-1.5 text-neutral-300/60 hover:cursor-help${
        className ? ` ${className}` : ''
      }`}
      onClick={() => {
        setIsOpen(!isOpen)
      }}
      onMouseEnter={() => {
        setIsOpen(true)
      }}
      onMouseLeave={() => {
        setIsOpen(false)
      }}
    >
      <Icon className="w-6" />

      {isOpen && (
        <div
          className={`absolute z-10 flex w-52 select-none items-center text-xs font-extralight leading-normal drop-shadow-lg after:absolute after:inline-block after:h-0 after:w-0 after:align-middle sm:w-max ${directionClassName}`}
        >
          <p className="rounded-sm bg-neutral-800 px-2 py-1">{message}</p>
        </div>
      )}
    </div>
  )
}

type IconProps = {
  className: string
}

interface TooltipProps {
  message: string
  icon: FunctionComponent<IconProps>
  className?: string
  direction?: 'left' | 'bottom'
}
