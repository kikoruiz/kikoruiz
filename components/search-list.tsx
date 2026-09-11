import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {UseComboboxPropGetters} from 'downshift'
import {getPrettyDate} from 'lib/blog/date'
import SearchResultCategory from './search-result-category'
import SearchResultItem from './search-result-item'
import {SearchItem} from 'types'
import IconPhoto from 'assets/icons/photo.svg'
import IconDocumentText from 'assets/icons/document-text.svg'

export default function SearchList({
  items,
  getItemProps,
  highlightedIndex
}: SearchListProps) {
  const {t} = useTranslation()
  const {locale} = useRouter()
  const posts = items.filter(item => item.type === 'post')
  const pictures = items.filter(item => item.type === 'picture')

  return (
    <div>
      {posts.length > 0 && (
        <SearchResultCategory
          icon={IconDocumentText}
          title={t('sections.blog.name')}
        >
          {posts.map((item, positionInGroup) => {
            const index = positionInGroup

            return (
              <SearchResultItem
                key={`post-${item.slug}`}
                item={item}
                index={index}
                isHighlighted={highlightedIndex === index}
                fallbackKey={`post-${item.slug}`}
                title={item.title}
                primary={
                  item.createdAt
                    ? getPrettyDate(item.createdAt, locale)
                    : undefined
                }
                excerpt={item.excerpt}
                getItemProps={getItemProps}
              />
            )
          })}
        </SearchResultCategory>
      )}

      {pictures.length > 0 && (
        <SearchResultCategory
          icon={IconPhoto}
          title={t('sections.gallery.name')}
        >
          {pictures.map((item, positionInGroup) => {
            const index = posts.length + positionInGroup
            const year = item.createDate
              ? new Date(item.createDate).getFullYear().toString()
              : undefined
            const meta = [item.location, year].filter(Boolean) as string[]

            return (
              <SearchResultItem
                key={`picture-${item.slug}`}
                item={item}
                index={index}
                isHighlighted={highlightedIndex === index}
                fallbackKey={`picture-${item.slug}`}
                title={item.title}
                primary={
                  item.album
                    ? t(`gallery.albums.${item.album}.name`)
                    : undefined
                }
                meta={meta}
                getItemProps={getItemProps}
              />
            )
          })}
        </SearchResultCategory>
      )}
    </div>
  )
}

interface SearchListProps {
  items: SearchItem[]
  getItemProps: UseComboboxPropGetters<SearchItem>['getItemProps']
  highlightedIndex: number
}

SearchList.displayName = 'SearchList'
