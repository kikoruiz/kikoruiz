import {Tag} from 'types'
import {HighlightedImage} from './gallery'

export interface BlogPostContent {
  author: string
  content: string
  excerpt: string
  tags: string
  title: string
  picture?: string
}

export interface BlogPost extends BlogPostContent {
  createdAt: string
  highlightedImage: HighlightedImage
  href: string
  readingTime: number
  slug: string
  blogTags?: Tag[]
}

export interface Tutorial {
  href: string
}
