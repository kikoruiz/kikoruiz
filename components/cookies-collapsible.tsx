import {useState} from 'react'
import useTranslation from 'next-translate/useTranslation'
import Switch from './switch'
import IconChevronDown from 'assets/icons/chevron-down.svg'
import {getSlug} from 'lib/utils'

export default function CookiesCollapsible({
  id,
  consents,
  setConsents
}: CookiesCollapsibleProps) {
  const {t} = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const isChecked = consents[id]
  const isNecessary = id === 'necessary'
  const slug = getSlug(id)

  return (
    <div key={id} className="rounded-lg bg-neutral-600/30">
      <header
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        className="flex hover:text-orange-300 transition-colors cursor-pointer gap-6 justify-between py-3 px-6 items-center"
      >
        <span className="font-thin drop-shadow text-lg">
          {t(`legal.cookies.types.${slug}.description`)}
        </span>

        <button className="flex p-3 rounded-full bg-gradient-to-t from-neutral-600/30 drop-shadow-xs group-hover:drop-shadow-xl hover:text-neutral-300 focus:outline-none">
          <IconChevronDown
            className={`h-4 w-4 transition-transform ease-in-out${
              isOpen ? ' -rotate-180' : ''
            }`}
          />
        </button>
      </header>

      {isOpen && (
        <div className="p-6">
          <div className="text-neutral-300/60">
            {t(`legal.cookies.types.${slug}.purpose`)}
          </div>

          <div className="flex justify-end">
            <Switch
              label={t(`legal.cookies.types.${slug}.description`)}
              isChecked={isChecked}
              isLocked={isNecessary}
              className="mt-6"
              onSwitch={nextIsChecked => {
                setConsents({...consents, [id]: nextIsChecked})
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface CookiesCollapsibleProps {
  id: string
  consents: object
  setConsents: (consents: object) => void
}
