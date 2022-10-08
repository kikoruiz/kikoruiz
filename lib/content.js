import fs from 'node:fs'
import matter from 'gray-matter'
import {remark} from 'remark'
import html from 'remark-html'

export function getMarkdownContent(filename) {
  const file = fs.readFileSync(filename, 'utf8')
  const {content, data} = matter(file)
  const body = remark().use(html).processSync(content).toString()

  return {
    ...data,
    body
  }
}
