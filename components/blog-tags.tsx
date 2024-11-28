import useTranslation from 'next-translate/useTranslation'
import {Tag} from 'types'
import BlogTag from './blog-tag'

export default function BlogTags({tags, isPost = false}: BlogTagsProps) {
  const {t} = useTranslation('blog')

  return (
    <div
      className={`flex items-center gap-3 text-xs ${
        isPost ? 'mt-12 sm:mt-16' : 'mt-9 justify-center'
      }`}
    >
      {!isPost && <span className="font-light">{t('list.filter-by')}</span>}
      <div className="flex flex-row-reverse gap-3 text-xs">
        {tags.map(tag => (
          <BlogTag key={tag.slug} {...tag} />
        ))}
      </div>
    </div>
  )
}

interface BlogTagsProps {
  tags: Tag[]
  isPost?: boolean
}

BlogTags.displayName = 'BlogTags'
