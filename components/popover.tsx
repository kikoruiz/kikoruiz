import {
  Children,
  ButtonHTMLAttributes,
  HTMLAttributes,
  PropsWithChildren,
  cloneElement,
  useState,
  ReactNode,
  useRef,
  useEffect
} from 'react'
import useOutsideClick from 'hooks/use-outside-click'
import {cva, cx} from 'class-variance-authority'
import type {VariantProps} from 'class-variance-authority'

const popoverStyles = cva(
  'absolute z-30 flex items-center w-52 p-3 bg-gradient-to-b from-neutral-300/10 to-neutral-300/30 rounded-xl transition-all duration-200 origin-top text-xs font-extralight leading-normal drop-shadow-lg after:absolute after:inline-block after:h-0 after:w-0 after:align-middle sm:w-max',
  {
    variants: {
      direction: {
        left: 'right-0 top-0 h-full mr-11 after:left-full after:border-y-4 after:border-l-4 after:border-y-transparent after:border-l-neutral-300/10',
        bottom:
          'top-full 2xl:left-1/2 -translate-x-1/2 mt-2 after:-top-1 after:left-[calc(50%+1.75em)] 2xl:after:left-1/2 after:-translate-x-1/2 after:border-x-4 after:border-b-4 after:border-x-transparent after:border-b-neutral-300/10'
      },
      isOpen: {
        true: 'opacity-100 scale-100',
        false: 'opacity-0 scale-75 pointer-events-none'
      }
    }
  }
)

interface PopoverProps
  extends PropsWithChildren<
    HTMLAttributes<HTMLDivElement> &
      Omit<VariantProps<typeof popoverStyles>, 'isOpen'>
  > {
  trigger: ReactNode
  forceClose?: boolean
}

function PopoverTrigger({
  children,
  onClick,
  className
}: PropsWithChildren<
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'className'>
>) {
  // eslint-disable-next-line
  const child: any = Children.only(children)

  return (
    <>
      {cloneElement(child, {
        ...child.props,
        onClick,
        className: cx(className, child.props.className)
      })}
    </>
  )
}

export default function Popover({
  trigger,
  children,
  className,
  direction = 'bottom',
  forceClose = true
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useOutsideClick(ref, () => {
    setIsOpen(false)
  })

  useEffect(() => {
    if (forceClose) {
      setIsOpen(false)
    }
  }, [forceClose])

  useEffect(() => {
    // Set "⌘B" keyboard shortcut.
    function handleKeyDown({code, metaKey}: KeyboardEvent) {
      if (code === 'KeyB' && metaKey && !isOpen && !forceClose) {
        setIsOpen(true)
      }
      if (code === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, forceClose])

  return (
    <div ref={ref} className="relative">
      <PopoverTrigger
        className={isOpen ? 'text-orange-300' : 'hover:text-orange-200'}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        {trigger}
      </PopoverTrigger>

      <div
        className={popoverStyles({
          direction,
          isOpen,
          class: cx(className)
        })}
      >
        {children}
      </div>
    </div>
  )
}

Popover.displayName = 'Popover'
