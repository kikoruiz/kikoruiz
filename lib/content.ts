import fs from 'node:fs'
import matter from 'gray-matter'
import {BlogPostContent} from 'types/blog'

export function getMarkdownContent(filename: string) {
  const file = fs.readFileSync(filename, 'utf8')
  const {content, data} = matter(file)

  return {
    ...data,
    content
  } as BlogPostContent
}
