import fs from 'node:fs'
import matter from 'gray-matter'

export function getMarkdownContent(filename) {
  const file = fs.readFileSync(filename, 'utf8')
  const {content, data} = matter(file)

  return {
    ...data,
    content
  }
}
