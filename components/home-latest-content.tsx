import PostCard from './post-card'
import HomeModule from './home-module'
import {BlogPost} from 'types/blog'

export default function HomeLatestContent({posts}: HomeLatestContentProps) {
  return (
    <HomeModule title="Últimos contenidos">
      <div className="mt-3 grid gap-3 p-3 pt-0 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <PostCard key={post.slug} {...post} className="" isLatest />
        ))}
      </div>
    </HomeModule>
  )
}

interface HomeLatestContentProps {
  posts: BlogPost[]
}
