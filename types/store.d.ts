import {Image, Picture} from './gallery'

export interface PrintVariant {
  id: string
  productName: string
  paper: Paper['id']
  size: string
  isBorderless: boolean
  price: number
  priceId: string
}

// The picture travels once with its variants, since repeating it for every
// size, border and paper is most of what the page sends.
export interface PrintPicture {
  pictureId: string
  name: string
  slug: string
  image?: Image
  aspectRatio?: string
  imageSize: string
  picture: Picture['permalink']
  variants: PrintVariant[]
}

export type Print = Omit<PrintPicture, 'variants'> & PrintVariant

export interface RawPrint {
  id: string
  name: string
  type: string
  currency: string
  images: string[]
  pictureId: string
  size: string
  isBorderless: boolean
  paper: Paper['id']
  price: number
  priceId: string
}

export interface PicturePrint {
  id: string
  name: string
  size: string
  isBorderless: boolean
  paper: Paper['id']
  price: number
}

export interface PictureDownload {
  id: string
  name: string
  price: number
}

export interface DownloadVariant {
  id: string
  tier: string
  licence: string
  longestSide: number | null
  price: number
  priceId: string | null
}

export interface Download {
  id: string
  name: string
  slug: string
  image: Image
  aspectRatio: string
  imageSize: string
  picture: Picture['permalink']
  variants: DownloadVariant[]
}

export interface RawDownload {
  id: string
  name: string
  type: string
  currency: string
  images: string[]
  pictureId: string
  tier: string
  price: number
  priceId: string
}

export interface Paper {
  id: string
  brand: string
  name: string
  type: string
  gsm: number
  description: string
  url: string | {en: string; es: string; ca: string}
}
