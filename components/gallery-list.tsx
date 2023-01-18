import {ChangeEvent, MouseEvent} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {
  SORTING_OPTIONS,
  DEFAULT_SORTING_OPTION,
  DISABLED_SORTING_OPTIONS
} from 'config/gallery'
import ArrowPathRoundedSquare from 'assets/icons/arrow-path-rounded-square.svg'
import GalleryListItems from './gallery-list-items'
import {Picture, Subcategory} from 'types/gallery'

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

  return (
    <section className="px-3">
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
        subcategories.map(({id, tag}) => {
          return (
            <div className="mt-3 xl:mt-4" key={id}>
              <header className="rounded-sm bg-gradient-to-r from-neutral-800/30 p-3 text-xl font-light text-neutral-300/60 drop-shadow-sm">
                {t(`gallery.albums.${category}.subcategories.${id}`)}
              </header>
              <GalleryListItems
                items={pictures.filter(({tags}) => tags.includes(tag))}
                isAlbum={isAlbum}
                sortingOption={sortingOption}
              />
            </div>
          )
        })
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
