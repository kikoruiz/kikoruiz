import path from 'node:path'
import {getMarkdownContent} from './content.js'

const aboutMeDirectory = path.join(process.cwd(), 'data', 'pages', 'about-me')

export function getDescription({locale}) {
  const description = getMarkdownContent(`${aboutMeDirectory}/${locale}.md`)

  return description
}
