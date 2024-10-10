import {PropsWithChildren} from 'react'
import Link, {LinkProps} from 'next/link'
import {cva, cx} from 'class-variance-authority'
import type {VariantProps} from 'class-variance-authority'
import IconChevronRight from 'assets/icons/chevron-right.svg'

const buttonLinkStyles = cva('', {
  variants: {
    intent: {
      primary:
        'border-neutral-600/60 from-neutral-300 to-neutral-200 text-neutral-700/90 hover:from-neutral-400 hover:to-neutral-300 hover:text-neutral-900/90',
      accent:
        'border-orange-600/60 from-orange-300 to-orange-200 text-orange-700/90 hover:from-orange-400 hover:to-orange-300 hover:text-orange-900/90'
    }
  }
})

type ButtonLinkProps = PropsWithChildren<
  LinkProps &
    VariantProps<typeof buttonLinkStyles> & {title?: string; className?: string}
>

export default function ButtonLink({
  children,
  title,
  className,
  intent = 'accent',
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      title={title}
      className={buttonLinkStyles({
        intent,
        class: cx(
          className,
          'group inline-flex w-max items-center rounded-full border bg-gradient-to-tr px-3 py-1.5 text-xs font-light shadow-sm transition-colors'
        )
      })}
    >
      {children}

      <IconChevronRight className="invisible relative -left-3 w-0 transition-all group-hover:visible group-hover:left-0 group-hover:-mr-1 group-hover:ml-1 group-hover:w-3" />
    </Link>
  )
}

ButtonLink.displayName = 'ButtonLink'
