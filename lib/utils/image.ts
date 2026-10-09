import path from 'node:path'
import fs from 'node:fs'
import {ImagePlaceholder, RawImagePlaceholder} from 'types/gallery'

const imagePlaceholdersFile = path.join(
  process.cwd(),
  'data',
  'image',
  'placeholders.json'
)

let cachedPlaceholders: Map<string, RawImagePlaceholder>

export async function getImagePlaceholder(
  src: string
): Promise<ImagePlaceholder> {
  if (!cachedPlaceholders) {
    const data = fs.readFileSync(imagePlaceholdersFile, 'utf8')
    const imagePlaceholders = JSON.parse(data) as RawImagePlaceholder[]

    cachedPlaceholders = new Map(
      imagePlaceholders.map(placeholder => [placeholder.image, placeholder])
    )
  }

  const imagePlaceholder = cachedPlaceholders.get(`public${src}`)

  return {css: imagePlaceholder.css}
}
