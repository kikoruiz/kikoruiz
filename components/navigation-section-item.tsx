import sectionIcons from './section-icons'
import IconChevronDown from 'assets/icons/chevron-down.svg'
import {getCapitalizedName} from 'lib/utils'
import {SECTIONS} from 'config'

interface NavigationSectionItemProps {
  name: string
  section: (typeof SECTIONS)[number]
  hasCategories: boolean
  isExpanded: boolean
}

export default function NavigationSectionItem({
  name,
  section,
  hasCategories,
  isExpanded
}: NavigationSectionItemProps) {
  const SectionIcon = sectionIcons[`Icon${getCapitalizedName(section.id)}`]

  return (
    <div className="relative flex items-center">
      <span className="inline-flex items-center">
        <SectionIcon className="mr-1 w-5 sm:hidden" />

        {name}
      </span>

      {hasCategories && (
        <>
          <IconChevronDown
            className={`navigation-section-icon ml-2 h-[12px] w-[12px] transition-transform ease-in-out${
              isExpanded
                ? ' -rotate-180 sm:rotate-0 sm:group-hover:-rotate-180'
                : ''
            }`}
          />
        </>
      )}
    </div>
  )
}
