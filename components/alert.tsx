import {FunctionComponent, useState} from 'react'
import {cva, cx} from 'class-variance-authority'
import type {VariantProps} from 'class-variance-authority'
import IconXMark from 'assets/icons/x-mark.svg'

const alertStyles = cva('', {
  variants: {
    status: {
      success: 'from-green-900/30 to-green-900 text-green-200/75',
      error: 'from-red-900/60 to-red-900 text-red-200/75',
      warning: 'from-orange-800/30 to-orange-800/60 text-orange-300/75'
    }
  }
})

type IconProps = {
  className: string
}

interface AlertProps extends VariantProps<typeof alertStyles> {
  title: string
  message: string
  icon?: FunctionComponent<IconProps>
  className?: string
  onClose?: () => void
}

export default function Alert({
  title,
  message,
  icon: Icon,
  className,
  onClose = () => {},
  status = 'success'
}: AlertProps) {
  const [isOpen, setIsOpen] = useState(true)

  return isOpen ? (
    <div
      className={alertStyles({
        status,
        class: cx(
          className,
          'relative flex items-center gap-3 rounded py-6 pl-5 pr-9 bg-gradient-to-bl'
        )
      })}
    >
      {Icon && (
        <Icon className="size-9 self-start -mt-1 sm:self-auto sm:mt-0" />
      )}

      <div>
        <header className="font-extrabold">{title}</header>
        <p className="font-light text-sm">{message}</p>
      </div>

      <button
        className="absolute top-2 right-2 opacity-60 rounded-full p-1 transition-colors hover:opacity-100 hover:bg-neutral-900/30"
        onClick={() => {
          setIsOpen(false)
          onClose()
        }}
      >
        <IconXMark className="size-4" />
      </button>
    </div>
  ) : null
}

Alert.displayName = 'Alert'
