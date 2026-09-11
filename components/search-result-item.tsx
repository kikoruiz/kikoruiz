import {UseComboboxPropGetters} from 'downshift'
import {SearchItem} from 'types'

interface SearchResultItemProps {
  item: SearchItem
  index: number
  isHighlighted: boolean
  fallbackKey: string
  title: string
  primary?: string
  meta?: string[]
  excerpt?: string
  getItemProps: UseComboboxPropGetters<SearchItem>['getItemProps']
}

export default function SearchResultItem({
  item,
  index,
  isHighlighted,
  fallbackKey,
  title,
  primary,
  meta,
  excerpt,
  getItemProps
}: SearchResultItemProps) {
  const {key: itemKey, ...itemProps} = getItemProps({
    item,
    index
  }) as {key?: string} & Record<string, unknown>

  const hasDetails = Boolean(primary || meta?.length || excerpt)

  return (
    <li
      {...itemProps}
      key={itemKey ?? fallbackKey}
      className={`cursor-pointer px-6 py-3${
        isHighlighted ? ' bg-neutral-900/30' : ''
      }`}
    >
      <div className="font-extrabold text-lg text-neutral-300/90">{title}</div>

      {hasDetails && (
        <div className="flex flex-wrap gap-x-1.5 text-sm">
          {primary && <span className="text-orange-300/60">{primary}</span>}
          {meta?.map((value, valueIndex) => (
            <span
              key={valueIndex}
              className={`${
                valueIndex === 0 ? ' text-neutral-600' : 'text-neutral-700'
              }`}
            >
              {value}
            </span>
          ))}
          {excerpt && (
            <span className="line-clamp-1 text-neutral-700">{excerpt}</span>
          )}
        </div>
      )}
    </li>
  )
}

SearchResultItem.displayName = 'SearchResultItem'
