#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

import {kebabCase} from 'change-case'
import removeAccents from 'remove-accents'
import {GALLERY_ALBUMS} from 'config/gallery'
import {taggedPictures} from 'lib/utils/pictures'
import {RawPicture} from 'types/gallery'
import {RawPrint} from 'types/store'

const dataDirectory = path.join(process.cwd(), 'data')
const picturesFile = `${dataDirectory}/pictures/metadata.json`
const productsFile = `${dataDirectory}/store/products.json`

const COLUMNS = [
  'id',
  'slug',
  'title',
  'albums',
  'hasDescription',
  'hasLocation',
  'isPrintable'
]

function auditContent() {
  const allPictures = JSON.parse(
    fs.readFileSync(picturesFile, 'utf8')
  ) as RawPicture[]
  const products = JSON.parse(
    fs.readFileSync(productsFile, 'utf8')
  ) as RawPrint[]
  const printableIds = new Set(products.map(({pictureId}) => pictureId))

  const rows = allPictures.map(picture => {
    const {fileName, title, description, location, keywords} = picture
    const [id] = fileName.split('.')
    const albums = GALLERY_ALBUMS.filter(({tags, excludeTags}) =>
      taggedPictures({tags, excludeTags})({keywords})
    ).map(({id}) => id)

    return {
      id,
      slug: kebabCase(removeAccents(title)),
      title,
      albums: albums.join('|'),
      hasDescription: Boolean(description),
      hasLocation: Boolean(location),
      isPrintable: printableIds.has(id)
    }
  })
  // Every picture gets its own page, so this is a writing backlog and not an
  // indexing gate: these are the ones still carrying only the fallback copy.
  const backlog = rows.filter(
    ({hasDescription, hasLocation}) => !hasDescription && !hasLocation
  )
  const withoutDescription = rows.filter(({hasDescription}) => !hasDescription)

  console.log(COLUMNS.join('\t'))
  for (const row of backlog) {
    console.log(COLUMNS.map(column => row[column]).join('\t'))
  }

  console.error(
    `\n${rows.length} pictures · ${withoutDescription.length} without a description · ${backlog.length} with neither description nor place · ${rows.filter(({isPrintable}) => isPrintable).length} printable\n`
  )
}

auditContent()
