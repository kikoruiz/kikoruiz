import {BLOG} from 'config'
import {capitalizeFirst as capitalize} from 'lib/utils'

export default function PostTitle({title}: PostTitleProps) {
  return title.includes(BLOG.TITLE_SEPARATOR) ? (
    <>
      <span className="text-neutral-300/60">
        {capitalize(title.split(BLOG.TITLE_SEPARATOR)[0])}
        {BLOG.TITLE_SEPARATOR}
      </span>{' '}
      {capitalize(title.split(BLOG.TITLE_SEPARATOR)[1])}
    </>
  ) : (
    <>{capitalize(title)}</>
  )
}

interface PostTitleProps {
  title: string
}

PostTitle.displayName = 'PostTitle'
