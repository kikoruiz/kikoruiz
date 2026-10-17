import {StaticContent, Tag} from 'types'
import {HighlightedImage, Image} from './gallery'

export interface BlogPostContent extends StaticContent {
  excerpt: string
  author: string
  picture?: string
  tags: string
  // Optional front matter for an article that has been revised after it was
  // published, as `AAAA-MM-DD`.
  updated?: string
}

export interface BlogPost extends BlogPostContent {
  createdAt: string
  highlightedImage: HighlightedImage
  href: string
  readingTime: number
  blogTags?: Tag[]
  isDraft: boolean
  bodyImages: Image[]
}

export interface Tutorial {
  href: string
}
