import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import PostCard from './post-card'
import HomeModule from './home-module'
import Tooltip from './tooltip'
import IconInformationCircle from 'assets/icons/information-circle.svg'
import {BlogPost} from 'types/blog'
import {BLOG} from 'config'

export default function HomeLatestContent({posts}: HomeLatestContentProps) {
  const {locale} = useRouter()
  const {t} = useTranslation('home')
  const additionalInfo = (
    <Tooltip
      message={t('common:blog.available-locales.warning')}
      icon={IconInformationCircle}
    />
  )
  const props = {
    title: t('latest-content'),
    ...(!BLOG.AVAILABLE_LOCALES.includes(locale) && {additionalInfo})
  }

  return (
    <HomeModule {...props}>
      <div className="mt-3 grid gap-3 p-3 pt-0 sm:grid-cols-2">
        {posts.map(post => (
          <PostCard key={post.slug} {...post} isLatest needsPreload />
        ))}
      </div>
    </HomeModule>
  )
}

interface HomeLatestContentProps {
  posts: BlogPost[]
}
