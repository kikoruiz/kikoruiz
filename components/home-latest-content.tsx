import useTranslation from 'next-translate/useTranslation'
import PostCard from './post-card'
import HomeModule from './home-module'
import {BlogPost} from 'types/blog'

export default function HomeLatestContent({posts}: HomeLatestContentProps) {
  const {t} = useTranslation('home')
  const hasOnePost = posts.length === 1

  return (
    <HomeModule title={t('latest-content')}>
      <div
        className={`mt-3 grid gap-3 p-3 pt-0 ${
          hasOnePost ? '' : 'sm:grid-cols-2'
        }`}
      >
        {posts.map(post => (
          <PostCard
            key={post.slug}
            {...post}
            isLatest
            needsPreload
            orientation={hasOnePost ? 'horizontal' : 'vertical'}
          />
        ))}
      </div>
    </HomeModule>
  )
}

interface HomeLatestContentProps {
  posts: BlogPost[]
}
