import path from 'node:path'
import {getMarkdownContent} from './content'

const aboutMeDirectory = path.join(process.cwd(), 'data', 'pages', 'about-me')

export function getDescription({locale}: {locale: string}) {
  const description = getMarkdownContent(`${aboutMeDirectory}/${locale}.md`)

  return description
}
