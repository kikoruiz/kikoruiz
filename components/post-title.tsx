import {BLOG} from 'config'

// A title starts with a capital whether or not it carries a prefix such as
// "Tutorial:", so one written in lowercase after the separator still reads well.
function capitalize(text: string) {
  return text.replace(/^(\s*)(\p{L})/u, (_, space, letter) => {
    return `${space}${letter.toUpperCase()}`
  })
}

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
