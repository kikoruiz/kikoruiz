import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import {remark} from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'data', 'posts')

export function getAllPosts() {
  const filenames = fs.readdirSync(postsDirectory)

  return filenames.map(filename => {
    const file = fs.readFileSync(`${postsDirectory}/${filename}`, 'utf8')
    const {data} = matter(file)
    const slug = filename.replace(/\.md$/, '')

    return {
      ...data,
      slug,
      permalink: `/blog/${slug}`
    }
  })
}

export function getPostBySlug(slug) {
  const file = fs.readFileSync(`${postsDirectory}/${slug}.md`, 'utf8')
  const {content, data} = matter(file)
  const body = remark().use(html).processSync(content).toString()

  return {
    ...data,
    body
  }
}
