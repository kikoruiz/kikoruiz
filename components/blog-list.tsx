import PostCard from './post-card'
import {BlogPost} from 'types/blog'
import {Tag} from 'types'
import BlogHeader from './blog-header'

export default function BlogList({tag, tags, posts}: BlogListProps) {
  return (
    <>
      <BlogHeader tag={tag} tags={tags} hasNoContent={posts.length === 0} />

      {posts.length > 0 && (
        <section className="grid p-4 pt-0 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {posts.map(post => (
            <PostCard key={post.slug} {...post} className="mt-4" />
          ))}
        </section>
      )}
    </>
  )
}

interface BlogListProps {
  tag?: string
  tags?: Tag[]
  posts: BlogPost[]
}

BlogList.displayName = 'BlogList'
