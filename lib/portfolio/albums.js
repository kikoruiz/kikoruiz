const API_HOST = 'https://api.smugmug.com'
const API_KEY = 'tC9LWc5wgdFJcpPRt5HMf3w3nxSTGCB4'

export default async function getPortfolioAlbums() {
  const searchParams = `?APIKey=${API_KEY}`
  const options = {
    headers: {
      Accept: 'application/json'
    }
  }

  const response = await fetch(
    `${API_HOST}/api/v2/user/kikoruiz!albums${searchParams}`,
    options
  )
  const data = await response.json()
  const albums = data.Response.Album.map(
    ({Name, Uris, Keywords, ImageCount, WebUri}) => {
      const {AlbumImages} = Uris
      const {Uri} = AlbumImages

      return {
        name: Name,
        apiUrl: `${API_HOST}${Uri}${searchParams}`,
        count: ImageCount,
        webUrl: WebUri,
        keywords: Keywords
      }
    }
  )

  return albums
}
