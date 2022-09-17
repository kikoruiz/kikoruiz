import {paramCase} from 'change-case'
import {smugmugFetcher} from '../utils.js'

export async function getGalleryAlbums() {
  const data = await smugmugFetcher.get('/api/v2/user/kikoruiz!albums')
  const albums = data.Response?.Album?.map(
    ({Name, Uris, Keywords, ImageCount, WebUri, AlbumKey}) => {
      const {AlbumImages} = Uris
      const {Uri} = AlbumImages
      const keywords = Keywords && Keywords.split('; ')

      return {
        name: Name,
        slug: paramCase(Name),
        id: AlbumKey,
        endpoint: Uri,
        count: ImageCount,
        webUrl: WebUri,
        ...(keywords && {keywords})
      }
    }
  )

  return albums
}
