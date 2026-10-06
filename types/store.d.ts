import {Image, Picture} from './gallery'

export interface Print {
  id: string
  name: string
  slug: string
  url?: string
  description?: string
  paper: Paper['id']
  size: string
  isBorderless: boolean
  price: number
  image?: Image
  aspectRatio?: string
  picture: Picture['permalink']
}

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

export interface Paper {
  id: string
  brand: string
  name: string
  type: string
  gsm: number
  description: string
  url: string | {en: string; es: string; ca: string}
}
