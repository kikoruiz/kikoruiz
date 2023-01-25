import {ChangeEvent, MouseEvent, useState} from 'react'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import ArrowPathRoundedSquare from 'assets/icons/arrow-path-rounded-square.svg'
import GalleryListItems from './gallery-list-items'
import GallerySubcategory from './gallery-subcategory'
import {Picture, Subcategory} from 'types/gallery'
import useSubcategoryContext from 'contexts/subcategory'
import icons from './gallery-subcategory-icons'
import {getCapitalizedName} from 'lib/utils'
import {
  SORTING_OPTIONS,
  DEFAULT_SORTING_OPTION,
  DISABLED_SORTING_OPTIONS
} from 'config/gallery'

export default function GalleryList({
  pictures,
  category,
  subcategories,
  isAlbum = false,
  onSort,
  sortingOption,
  toggleSortingDirection,
  isReversedSorting
}: GalleryListProps) {
  const {t} = useTranslation()
  const [visibleSubcategory, setVisibleSubcategory] = useState(null)
  const {setSubcategory} = useSubcategoryContext()

  function onSubcategoryChange({visible: nextVisible, overlapped}) {
    if (typeof nextVisible !== 'undefined') setVisibleSubcategory(nextVisible)
    if (typeof overlapped !== 'undefined') setSubcategory(overlapped)
  }

  return (
    <section className="px-3">
      {category && subcategories && (
        <div className="mx-auto mb-12 flex max-w-xs flex-wrap justify-center gap-3 font-extralight sm:max-w-none">
          {subcategories.map(({id}) => {
            const name = t(`gallery.albums.${category}.subcategories.${id}`)
            const Icon = icons[`${getCapitalizedName(id)}Icon`]

            return (
              <Link
                key={id}
                href={`#${id}`}
                title={name}
                scroll={false}
                className="flex items-center rounded-lg bg-gradient-to-t from-neutral-600/20 to-neutral-600/10 py-2 px-3 text-neutral-300/60 hover:bg-neutral-600/10 hover:text-orange-300"
              >
                <Icon className="mr-2 w-4 rounded-full opacity-90" />
                {name}
              </Link>
            )
          })}
        </div>
      )}
      {!isAlbum && (
        <div className="flex justify-center gap-2 pt-3 sm:justify-end">
          <div className="flex items-center text-xs">
            <label htmlFor="sorting" className="mr-2 text-neutral-500">
              {t('gallery:sorting.label')}
            </label>
            <select
              id="sorting"
              className="block appearance-none rounded-md border border-neutral-700 bg-neutral-800 bg-select bg-[length:0.75rem] bg-[right_0.5rem_center] bg-no-repeat py-1.5 pl-3 pr-7 shadow-sm focus:border-orange-300/60 focus:outline-none focus:ring-orange-300/60"
              onChange={onSort}
              defaultValue={DEFAULT_SORTING_OPTION}
            >
              {SORTING_OPTIONS.map(option => {
                const isDisabled = DISABLED_SORTING_OPTIONS.includes(option)

                return (
                  <option
                    key={`sorting-by-${option}`}
                    value={option}
                    disabled={isDisabled}
                  >
                    {t(`gallery:sorting.options.${option}`)}
                  </option>
                )
              })}
            </select>
          </div>
          <button
            onClick={toggleSortingDirection}
            className="group flex items-center rounded-md border border-neutral-700 bg-neutral-800 p-1.5 text-xs font-light hover:border-orange-300/60 focus:border-orange-300/60 focus:outline-none focus:ring-orange-300/60"
            aria-label={t('gallery:sorting.direction')}
            title={t('gallery:sorting.direction')}
          >
            <span className="text-neutral-300/60">
              {isReversedSorting ? 'Z' : 'A'}
            </span>
            <ArrowPathRoundedSquare className="w-6 px-1 group-hover:fill-orange-300" />
            <span className="text-neutral-300/60">
              {isReversedSorting ? 'A' : 'Z'}
            </span>
          </button>
        </div>
      )}

      {category && subcategories ? (
        subcategories.map(({id, tag}, index) => (
          <GallerySubcategory
            key={id}
            index={index}
            id={id}
            category={category}
            visibleSubcategory={visibleSubcategory}
            subcategories={subcategories}
            items={pictures.filter(({tags}) => tags.includes(tag))}
            isAlbum={isAlbum}
            sortingOption={sortingOption}
            onChange={onSubcategoryChange}
          />
        ))
      ) : (
        <GalleryListItems
          items={pictures}
          isAlbum={isAlbum}
          sortingOption={sortingOption}
        />
      )}
    </section>
  )
}

interface GalleryListProps {
  pictures: Picture[]
  category?: string
  subcategories?: Subcategory[]
  isAlbum?: boolean
  onSort?: (event: ChangeEvent) => void
  sortingOption?: string
  toggleSortingDirection?: (event: MouseEvent) => void
  isReversedSorting?: boolean
}
