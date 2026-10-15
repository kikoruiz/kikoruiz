#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import {fromMetadataToSearchIndex} from 'lib/search-index'
import {RawPicture} from 'types/gallery'

const dataDirectory = path.join(process.cwd(), 'data')
const picturesFile = path.join(dataDirectory, 'pictures', 'metadata.json')
const searchPicturesFile = path.join(dataDirectory, 'search', 'pictures.json')

const pictures = JSON.parse(
  fs.readFileSync(picturesFile, 'utf8')
) as RawPicture[]

fs.writeFileSync(
  searchPicturesFile,
  JSON.stringify(fromMetadataToSearchIndex(pictures))
)
console.log('\n✅ Pictures search index has been saved.\n')
