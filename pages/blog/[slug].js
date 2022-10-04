import Head from 'next/head'
import {useRouter} from 'next/router'
import {getAllPosts, getPostBySlug} from '../../lib/blog/posts.js'
import {getPrettyDate} from '../../lib/blog/date.js'

export default function Post({post}) {
  const {locale} = useRouter()

  return (
    <div>
      <Head>
        <title>Kiko Ruiz</title>
      </Head>

      <h1>{post.title}</h1>

      <time dateTime={post.createdAt}>
        {getPrettyDate(post.createdAt, locale)}
      </time>

      <div dangerouslySetInnerHTML={{__html: post.body}} />
    </div>
  )
}

export async function getStaticPaths({locales}) {
  let paths = []
  const posts = getAllPosts()

  for (const locale of locales) {
    paths = paths.concat(
      posts.map(post => ({
        params: {
          slug: post.slug
        },
        locale
      }))
    )
  }

  return {
    paths,
    fallback: false
  }
}

export function getStaticProps({params}) {
  const post = getPostBySlug(params.slug)

  return {
    props: {post, section: 'blog'}
  }
}
