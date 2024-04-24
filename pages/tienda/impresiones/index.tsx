import {useReducer} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {camelCase} from 'change-case'
import {Alternate} from 'types'
import {fromLocalesToAlternates} from 'lib/mappers'
import {getPrints} from 'lib/store/prints'
import {Print} from 'types/store'
import StorePage from 'components/store-page'
import PrintCard from 'components/print-card'
import {getSlug} from 'lib/utils'
import {FILTER_OPTIONS, SIMPLE_FILTERS} from 'config/store'

interface PrintsPageProps {
  alternates: Alternate[]
  prints: Print[]
}

function reducer(state, action) {
  switch (action.type) {
    case 'filter-size': {
      return {
        ...state,
        size: action.size
      }
    }
    case 'filter-size-option': {
      return {
        ...state,
        sizeOption: action.sizeOption
      }
    }
    case 'filter-paper': {
      return {
        ...state,
        paper: action.paper
      }
    }
  }

  throw new Error(`Unknown action: ${action.type}`)
}

const filterOptions = Object.keys(FILTER_OPTIONS)
const initialState = {
  size: FILTER_OPTIONS.size[0].value,
  sizeOption: FILTER_OPTIONS.sizeOption[0],
  paper: FILTER_OPTIONS.paper[0].value
}

export default function PrintsPage({alternates, prints}: PrintsPageProps) {
  const {t} = useTranslation()
  const [state, dispatch] = useReducer(reducer, initialState)
  const items = prints.filter(({size, isBorderless, paper}) => {
    return (
      size.toLowerCase() === state.size &&
      isBorderless === (state.sizeOption === 'borderless') &&
      paper === state.paper
    )
  })

  function handleFilterChange(event) {
    const {id, value} = event.target
    const [, option] = id.split('filter-')

    dispatch({type: id, [camelCase(option)]: value})
  }

  return (
    <StorePage
      title={t('store.categories.prints.name')}
      description={t('sections.store.description')}
      alternates={alternates}
    >
      <section className="px-6">
        <div className="flex justify-center gap-2 pt-3 sm:justify-end mb-6">
          {filterOptions.map(filter => {
            const slug = getSlug(filter)
            const id = `filter-${slug}`
            const isSimple = SIMPLE_FILTERS.includes(slug)

            return (
              <div key={id} className="flex items-center text-xs">
                {!isSimple && (
                  <label htmlFor={id} className="mx-2 text-neutral-500">
                    {t(`store:${slug}`)}
                  </label>
                )}

                <select
                  id={id}
                  className="block appearance-none rounded-md border border-neutral-700 bg-neutral-800 bg-select bg-[length:0.75rem] bg-[right_0.5rem_center] bg-no-repeat py-1.5 pl-3 pr-7 shadow-sm focus:border-orange-300/60 focus:outline-none focus:ring-orange-300/60"
                  onChange={handleFilterChange}
                  defaultValue={initialState[filter]}
                >
                  {FILTER_OPTIONS[filter].map(option => {
                    const key = option.value
                      ? `sorting-by-${option.value}`
                      : option
                    const value = option.value ?? option
                    const name = option.name ?? t(`store:filters.${option}`)

                    return (
                      <option key={key} value={value}>
                        {name}
                      </option>
                    )
                  })}
                </select>
              </div>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-9">
          {items.map(print => (
            <PrintCard key={print.id} {...print} />
          ))}
        </div>
      </section>
    </StorePage>
  )
}

export async function getStaticProps({locale, locales, defaultLocale}) {
  const section = 'store'
  const subSection = 'prints'
  const alternates = await Promise.all(
    locales.map(
      await fromLocalesToAlternates({
        defaultLocale,
        section,
        subSection
      })
    )
  )
  const prints = await getPrints({locale})

  return {
    props: {section, subSection, alternates, prints}
  }
}
