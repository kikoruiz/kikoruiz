import PostCard from './post-card'
import {BlogPost} from 'types/blog'
import {Tag} from 'types'
import BlogHeader from './blog-header'

export default function BlogList({tag, tags, posts}: BlogListProps) {
  return (
    <>
      <BlogHeader tag={tag} tags={tags} />

      <section className="grid p-4 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
        {posts.map(post => (
          <PostCard key={post.slug} {...post} />
        ))}
      </section>
    </>
  )
}

interface BlogListProps {
  tag?: string
  tags?: Tag[]
  posts: BlogPost[]
}
