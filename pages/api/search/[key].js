import searchContent from '../../../data/search/content.json'
import picturesMetadata from '../../../data/pictures/metadata.json'
import {paramCase} from 'change-case'
import {GALLERY_ALBUMS} from '../../../config/gallery.js'
import {taggedPictures} from '../../../lib/gallery/pictures.js'

function matchSearchKey(key) {
  return function (attrs) {
    return Object.keys(attrs).find(attr => {
      const item = attrs[attr]

      if (!item) return

      return typeof item === 'string'
        ? item.toLowerCase().includes(key.toLowerCase())
        : item.includes(key.toLowerCase())
    })
  }
}

export default function handler(req, res) {
  const {
    query: {key}
  } = req
  const results = [
    ...searchContent.filter(matchSearchKey(key)),
    ...picturesMetadata
      .map(({description, keywords, title, fileName}) => {
        const album = GALLERY_ALBUMS.find(({tags, excludeTags}) =>
          taggedPictures({tags, excludeTags})({keywords})
        )

        return {
          slug: paramCase(title),
          description,
          keywords,
          title,
          fileName,
          ...(album && {album: album.id})
        }
      })
      .filter(matchSearchKey(key))
  ]

  res.status(200).json(results)
}
