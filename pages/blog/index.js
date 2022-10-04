import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {getAllPosts} from '../../lib/blog/posts.js'
import {getPrettyDate} from '../../lib/blog/date.js'

export default function Posts({posts}) {
  const {locale} = useRouter()

  return (
    <>
      <Head>
        <title>Kiko Ruiz</title>
      </Head>

      <div className="p-12">
        <h1>Posts</h1>
        {posts.map(post => (
          <article key={post.slug}>
            <h2>
              <Link href={post.permalink}>
                <a>{post.title}</a>
              </Link>
            </h2>

            <time dateTime={post.createdAt}>
              {getPrettyDate(post.createdAt, locale)}
            </time>

            <p>{post.excerpt}</p>

            <Link href={post.permalink}>
              <a>Read more</a>
            </Link>
          </article>
        ))}
      </div>
    </>
  )
}

export function getStaticProps() {
  return {
    props: {
      posts: getAllPosts(),
      section: 'blog'
    }
  }
}
