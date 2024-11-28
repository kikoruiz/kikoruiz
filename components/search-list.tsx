import useTranslation from 'next-translate/useTranslation'
import {UseComboboxPropGetters} from 'downshift'
import {SearchItem} from 'types'

export default function SearchList({
  items,
  getItemProps,
  highlightedIndex
}: SearchListProps) {
  const {t} = useTranslation()

  return (
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
              <div className="font-bold text-neutral-300/90">{item.title}</div>
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
  )
}

interface SearchListProps {
  items: SearchItem[]
  getItemProps: UseComboboxPropGetters<SearchItem>['getItemProps']
  highlightedIndex: number
}

SearchList.displayName = 'SearchList'
