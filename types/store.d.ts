import {Image, Picture} from './gallery'

export interface Print {
  id: string
  name: string
  slug: string
  url?: string
  description?: string
  paper: Paper['id']
  size: string
  price: number
  image?: Image
  aspectRatio?: string
  picture: Picture['url']
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

export interface Cart {
  items?: {
    count?: number
  }
  subtotal?: number
}
