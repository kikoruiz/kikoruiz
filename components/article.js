import ReactMarkdown from 'react-markdown'

export default function Article({children, className}) {
  const articleClassName = `max-w-full prose prose-neutral prose-headings:text-neutral-300 prose-p:text-neutral-400 prose-a:text-orange-200 hover:prose-a:text-orange-300 hover:prose-a:no-underline prose-strong:text-neutral-300 dark:prose-invert${
    className ? ` ${className}` : ''
  }`

  return (
    <article className={articleClassName}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </article>
  )
}
