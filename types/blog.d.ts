import {HighlightedImage} from './gallery'

export interface BlogPostContent {
  author: string
  content: string
  excerpt: string
  tags: string
  title: string
}

export interface BlogPost extends BlogPostContent {
  createdAt: string
  highlightedImage: HighlightedImage
  href: string
  readingTime: number
  slug: string
  blogTags: BlogTag[]
}

export interface BlogTag {
  href: string
  id: string
  name: string
  slug: string
}
