import {useState, useRef, useEffect, useMemo} from 'react'
import {useRouter} from 'next/router'
import {useCombobox} from 'downshift'
import useTranslation from 'next-translate/useTranslation'
import debounce from 'lodash/debounce'
import {getSlug} from 'lib/utils'
import IconMagnifyingGlass from 'assets/icons/magnifying-glass.svg'
import SearchList from './search-list'
import {REQUEST_STATUS_OPTIONS} from 'config'
import {SearchItem} from 'types'

interface SearchBarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function SearchBar({isOpen, setIsOpen}: SearchBarProps) {
  const {t} = useTranslation()
  const queryKey = t('gallery.carousel.query-key')
  const {locale, push} = useRouter()
  const inputRef = useRef(null)
  const [items, setItems] = useState([])
  const [status, setStatus] = useState(REQUEST_STATUS_OPTIONS.IDLE)
  const debouncedChangeHandler = useMemo(
    () =>
      debounce(async ({inputValue}: {inputValue: string}) => {
        setStatus(REQUEST_STATUS_OPTIONS.PENDING)

        let items: SearchItem[] | [] = []

        if (inputValue) {
          try {
            const search = (await import('lib/search')).default
            items = search({key: inputValue, locale})

            setStatus(REQUEST_STATUS_OPTIONS.RESOLVED)
          } catch (error) {
            console.error(error)
            setStatus(REQUEST_STATUS_OPTIONS.REJECTED)
          }
        } else {
          setStatus(REQUEST_STATUS_OPTIONS.IDLE)
        }

        setItems(items)
      }, 300),
    [locale]
  )
  const {
    isOpen: isMenuOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    reset,
    inputValue
  } = useCombobox({
    items,
    labelId: 'search-label',
    menuId: 'search-menu',
    onSelectedItemChange: ({selectedItem}) => {
      let destination
      if (selectedItem?.type === 'post') {
        destination = `/${getSlug(t('sections.blog.name'))}/${
          selectedItem.slug
        }`
      } else if (selectedItem?.type === 'picture' && selectedItem.album) {
        destination = `/${getSlug(t('sections.gallery.name'))}/${getSlug(
          t(`gallery.albums.${selectedItem.album}.name`)
        )}?${queryKey}=${selectedItem.slug}`
      }

      if (!destination) return
      reset()
      setIsOpen(false)
      push(destination, destination, {locale})
    },
    itemToString: () => '',
    onInputValueChange: debouncedChangeHandler,
    onStateChange: ({isOpen, type}) => {
      if (isOpen === false && type !== '__input_click__') {
        setStatus(REQUEST_STATUS_OPTIONS.IDLE)
        reset()
      }
    }
  })

  useEffect(() => {
    if (isOpen) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        reset()
        setIsOpen(false)
        setStatus(REQUEST_STATUS_OPTIONS.IDLE)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.removeEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, setIsOpen, reset])

  const isResolved = status === REQUEST_STATUS_OPTIONS.RESOLVED
  const showNoResults =
    isMenuOpen && isResolved && Boolean(inputValue) && items.length === 0

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (highlightedIndex < 0 || !menuRef.current) return

    const options = menuRef.current.querySelectorAll('[role="option"]')
    const item = options[highlightedIndex] as HTMLElement | undefined

    if (item) item.scrollIntoView({block: 'nearest'})
  }, [highlightedIndex])

  return (
    <div
      aria-hidden={!isOpen}
      className={`absolute left-0 top-full z-20 w-full px-4 transition-all duration-300 ease-out sm:px-0 ${
        isOpen
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-3 opacity-0'
      }`}
      onClick={event => {
        if (event.target === event.currentTarget) {
          setIsOpen(false)
          setStatus(REQUEST_STATUS_OPTIONS.IDLE)
        }
      }}
    >
      <form className="container mx-auto overflow-hidden rounded-md bg-neutral-800 drop-shadow-lg xl:max-w-4xl">
        <label
          {...getLabelProps()}
          htmlFor="search"
          className="sr-only mb-2 text-sm font-medium text-gray-900"
        >
          {t('navigation.search')}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <IconMagnifyingGlass className="w-6 fill-neutral-600" />
          </div>

          <input
            {...getInputProps({
              ref: inputRef,
              onClick: event => {
                event['preventDownshiftDefault'] = true
              }
            })}
            type="text"
            id="search"
            className="block w-full appearance-none rounded-md border border-transparent bg-transparent p-4 pl-12 text-neutral-300 placeholder-neutral-600 focus:border-orange-300/60 focus:outline-none focus:ring-orange-300/60"
            placeholder={t('navigation.search')}
            required
          />

          {status === REQUEST_STATUS_OPTIONS.PENDING && (
            <div
              aria-hidden
              role="status"
              className="absolute inset-0 flex h-full w-full items-center justify-end pr-4"
            >
              <div className="relative h-7 w-7 animate-spin rounded-full bg-gradient-to-r from-orange-300 via-neutral-800 to-orange-400">
                <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-neutral-800" />
              </div>
            </div>
          )}
        </div>

        <div
          {...getMenuProps({ref: menuRef})}
          className="max-h-[calc(100vh-20rem)] overflow-y-auto"
        >
          {isMenuOpen && items.length > 0 && (
            <SearchList
              items={items}
              getItemProps={getItemProps}
              highlightedIndex={highlightedIndex}
            />
          )}

          {showNoResults && (
            <div className="px-6 py-6 text-center text-sm font-light text-neutral-500">
              {t('navigation.search-no-results')}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

SearchBar.displayName = 'SearchBar'
