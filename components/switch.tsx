import {useState} from 'react'
import {getSlug} from 'lib/utils'

export default function Switch({
  label,
  className,
  isLocked = false,
  onSwitch,
  ...props
}: SwitchProps) {
  const id = getSlug(label)
  const [isChecked, setIsChecked] = useState(props.isChecked)

  return (
    <div className={`flex items-center${className ? ` ${className}` : ''}`}>
      <label
        htmlFor={id}
        className={`text-white text-[15px] leading-none pr-[15px] ${
          isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        {label}
      </label>

      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={isChecked}
        onClick={() => {
          if (!isLocked) {
            const nextIsChecked = !isChecked

            onSwitch(nextIsChecked)
            setIsChecked(nextIsChecked)
          }
        }}
        className={`w-[42px] h-[25px] rounded-full transition-all relative outline-none ${
          isChecked
            ? 'bg-gradient-to-b from-orange-300 to-orange-400'
            : 'bg-neutral-900/60'
        } ${
          isLocked
            ? 'cursor-not-allowed'
            : 'cursor-pointer hover:ring-1 hover:ring-orange-300'
        }`}
      >
        <span
          className={`block w-[21px] drop-shadow-xs h-[21px] rounded-full transition-all duration-300 translate-x-0.5 will-change-transform ${
            isChecked ? 'bg-white translate-x-[19px]' : 'bg-neutral-300'
          }`}
        />
      </button>
    </div>
  )
}

interface SwitchProps {
  label: string
  className?: string
  isChecked?: boolean
  isLocked?: boolean
  onSwitch: () => void
}
