import {BLOG} from 'config'

export default function PostTitle({title}: PostTitleProps) {
  return title.includes(BLOG.TITLE_SEPARATOR) ? (
    <>
      <span className="text-neutral-300/60">
        {title.split(BLOG.TITLE_SEPARATOR)[0]}
        {BLOG.TITLE_SEPARATOR}
      </span>{' '}
      {title.split(BLOG.TITLE_SEPARATOR)[1]}
    </>
  ) : (
    <>{title}</>
  )
}

interface PostTitleProps {
  title: string
}
