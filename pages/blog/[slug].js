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

export function getStaticPaths() {
  return {
    fallback: false,
    paths: getAllPosts().map(post => ({
      params: {
        slug: post.slug
      }
    }))
  }
}

export function getStaticProps({params}) {
  return {
    props: {
      post: getPostBySlug(params.slug)
    }
  }
}
