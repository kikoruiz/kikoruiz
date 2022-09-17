const SMUGMUG_API_HOST = 'https://api.smugmug.com'
const SMUGMUG_API_KEY = 'tC9LWc5wgdFJcpPRt5HMf3w3nxSTGCB4'

export const fetcher = {
  get: async (url, options) => {
    const response = await fetch(url, options)

    return response.json()
  }
}

export const smugmugFetcher = {
  get: async path => {
    const searchParams = `?APIKey=${SMUGMUG_API_KEY}`

    return fetcher.get(`${SMUGMUG_API_HOST}${path}${searchParams}`, {
      headers: {
        Accept: 'application/json'
      }
    })
  }
}
