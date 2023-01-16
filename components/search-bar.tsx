import {useState, useRef, useEffect, useCallback} from 'react'
import {useRouter} from 'next/router'
import {useCombobox} from 'downshift'
import useTranslation from 'next-translate/useTranslation'
import {debounce} from 'lodash'
import {fetcher, getSlug} from 'lib/utils'
import IconMagnifyingGlass from 'assets/icons/magnifying-glass.svg'

const STATUS_OPTIONS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
}

export default function SearchBar({isOpen, setIsOpen}: SearchBarProps) {
  const {t} = useTranslation()
  const {locale, push} = useRouter()
  const inputRef = useRef(null)
  const [items, setItems] = useState([])
  const [status, setStatus] = useState(STATUS_OPTIONS.IDLE)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChangeHandler = useCallback(
    debounce(async ({inputValue}) => {
      setStatus(STATUS_OPTIONS.PENDING)
      let items = []

      if (inputValue) {
        try {
          items = await fetcher.get(`/api/search/${inputValue}`)
          setStatus(STATUS_OPTIONS.RESOLVED)
        } catch (error) {
          console.error(error)
          setStatus(STATUS_OPTIONS.REJECTED)
        }
      } else {
        setStatus(STATUS_OPTIONS.IDLE)
      }

      setItems(items)
    }, 600),
    []
  )
  const {
    isOpen: isMenuOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    reset
  } = useCombobox({
    items,
    labelId: 'search-label',
    menuId: 'search-menu',
    onSelectedItemChange: ({selectedItem}) => {
      let destination
      if (selectedItem?.excerpt) {
        destination = `/${getSlug(t('sections.blog.name'))}/${
          selectedItem.slug
        }`
      } else if (selectedItem?.album) {
        destination = `/${getSlug(t('sections.gallery.name'))}/${getSlug(
          t(`gallery.albums.${selectedItem.album}.name`)
        )}?carousel=${selectedItem.slug}`
      }

      if (!destination) return
      reset()
      setIsOpen(false)
      push(destination, destination, {locale})
    },
    itemToString: () => '',
    onInputValueChange: debouncedChangeHandler,
    onStateChange: ({isOpen}) => {
      if (isOpen === false) {
        setStatus(STATUS_OPTIONS.IDLE)
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
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        reset()
        setIsOpen(false)
        setStatus(STATUS_OPTIONS.IDLE)
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

  return (
    <div
      className={`absolute left-0 top-full z-20 cursor-pointer px-4 sm:px-0 w-full${
        isOpen ? '' : ' hidden'
      }`}
      onClick={event => {
        const {localName} = event.target as HTMLDivElement

        if (localName !== 'input') {
          setIsOpen(false)
          setStatus(STATUS_OPTIONS.IDLE)
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
        <div {...getComboboxProps()} className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <IconMagnifyingGlass className="w-6 fill-neutral-600" />
          </div>
          <input
            {...getInputProps({ref: inputRef})}
            type="text"
            id="search"
            className="block w-full appearance-none rounded-md border border-transparent bg-transparent p-4 pl-12 text-neutral-300 placeholder-neutral-600 focus:border-orange-300/60 focus:outline-none focus:ring-orange-300/60"
            placeholder={t('navigation.search')}
            required
          />
          {status === STATUS_OPTIONS.PENDING && (
            <div
              aria-hidden
              role="status"
              className="absolute inset-0 flex h-full w-full items-center justify-end pr-4"
            >
              <div className="relative h-7 w-7 animate-spin rounded-full bg-gradient-to-r from-orange-300 via-neutral-800 to-orange-400">
                <div className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-neutral-800" />
              </div>
            </div>
          )}
        </div>

        <div
          {...getMenuProps()}
          className="max-h-[calc(100vh-20rem)] overflow-y-auto"
        >
          {isMenuOpen && (
            <ul>
              {items.map((item, index) => {
                return (
                  <li
                    {...getItemProps({item, index})}
                    key={item.slug}
                    className={`p-4 cursor-pointer${
                      highlightedIndex === index ? ' bg-neutral-900/30' : ''
                    }`}
                  >
                    {item.excerpt ? (
                      <div className="font-bold text-neutral-300/90">
                        {item.title}
                      </div>
                    ) : (
                      <>
                        <header className="font-bold text-neutral-300/90">
                          {item.title}
                        </header>
                        <dl className="flex text-xs">
                          <dt className="text-neutral-300/30 after:content-[':\00a0']">
                            {t('gallery.album')}
                          </dt>
                          <dd className="text-orange-300/60">
                            {t(`gallery.albums.${item.album}.name`)}
                          </dd>
                        </dl>
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </form>
    </div>
  )
}

interface SearchBarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}
