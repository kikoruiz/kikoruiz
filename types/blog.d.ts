import {Tag} from 'types'
import {HighlightedImage, Image} from './gallery'

export interface BlogPostContent {
  slug: string
  title: string
  excerpt: string
  author: string
  content: string
  picture?: string
  tags: string
}

export interface BlogPost extends BlogPostContent {
  createdAt: string
  highlightedImage: HighlightedImage
  href: string
  readingTime: number
  blogTags?: Tag[]
  isDraft: boolean
  contentImages: Image[]
}

export interface Tutorial {
  href: string
}
