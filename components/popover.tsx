import {
  Children,
  ButtonHTMLAttributes,
  HTMLAttributes,
  PropsWithChildren,
  cloneElement,
  useState,
  ReactNode,
  useRef
} from 'react'
import useOutsideClick from 'hooks/use-outside-click'
import {cva, cx} from 'class-variance-authority'
import type {VariantProps} from 'class-variance-authority'

const popoverContentStyles = cva(
  'absolute z-30 flex w-52 bg-gradient-to-b from-neutral-300/10 to-neutral-300/30 rounded-xl p-3 items-center text-xs font-extralight leading-normal drop-shadow-lg after:absolute after:inline-block after:h-0 after:w-0 after:align-middle sm:w-max',
  {
    variants: {
      direction: {
        left: 'right-0 top-0 h-full mr-11 after:left-full after:border-y-4 after:border-l-4 after:border-y-transparent after:border-l-neutral-300/10',
        bottom:
          'top-full 2xl:left-1/2 -translate-x-1/2 mt-2 after:-top-1 after:left-[calc(50%+1.75em)] 2xl:after:left-1/2 after:-translate-x-1/2 after:border-x-4 after:border-b-4 after:border-x-transparent after:border-b-neutral-300/10'
      }
    }
  }
)

interface PopoverProps
  extends PropsWithChildren<
    HTMLAttributes<HTMLDivElement> & VariantProps<typeof popoverContentStyles>
  > {
  trigger: ReactNode
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
  direction = 'bottom'
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useOutsideClick(ref, () => {
    setIsOpen(false)
  })

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

      {isOpen && (
        <div
          className={popoverContentStyles({
            direction,
            class: cx(className)
          })}
        >
          {children}
        </div>
      )}
    </div>
  )
}
