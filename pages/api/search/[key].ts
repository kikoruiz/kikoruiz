import type {NextApiRequest, NextApiResponse} from 'next'
import searchContent from 'data/search/content.json'
import picturesMetadata from 'data/pictures/metadata.json'
import {paramCase} from 'change-case'
import {GALLERY_ALBUMS} from 'config/gallery'
import {taggedPictures} from 'lib/gallery/pictures'
import {SearchItem} from 'types'

function matchSearchKey(key: string) {
  return function (attrs: object) {
    return Object.keys(attrs).find(attr => {
      const item = attrs[attr] as string | string[]

      if (!item) return

      return typeof item === 'string'
        ? item.toLowerCase().includes(key.toLowerCase())
        : item.includes(key.toLowerCase())
    })
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {key, locale} = req.query as {key: string; locale: string}
  const results: SearchItem[] = [
    ...searchContent[locale]?.filter(matchSearchKey(key)),
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
