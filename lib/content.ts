import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import getT from 'next-translate/getT'
import {StaticContent} from 'types'
import {BlogPostContent} from 'types/blog'

export function getMarkdownContent(filename: string) {
  const file = fs.readFileSync(filename, 'utf8')
  const {content, data} = matter(file)

  return {
    ...data,
    body: content
  } as StaticContent | BlogPostContent
}

export async function getContent({
  locale,
  page,
  category,
  isSubSection = false
}: {
  locale: string
  page: string
  category?: string
  isSubSection?: boolean
}) {
  const t = await getT(locale, 'common')
  const directory = path.join(
    process.cwd(),
    'data',
    'pages',
    isSubSection ? `${category}/${page}` : page
  )
  const content = getMarkdownContent(`${directory}/${locale}.md`)
  const needsTitle = Boolean(category)

  return {
    ...content,
    ...(needsTitle && {title: t(`${category}.pages.${page}`)})
  } as StaticContent
}
