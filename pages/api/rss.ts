import type {NextApiRequest, NextApiResponse} from 'next'
import {getAllPosts} from 'lib/blog/posts'
import {SITE_NAME, DEFAULT_ORIGIN} from 'config'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const locale = (req.query.locale as string) || 'es'
  const posts = await getAllPosts(locale)
  const localePath = locale === 'es' ? '' : `/${locale}`
  const siteUrl = `${DEFAULT_ORIGIN}${localePath}`

  const items = posts
    .map(
      post => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid>${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`
    )
    .join('\n')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} / Blog</title>
    <link>${siteUrl}/blog</link>
    <description>${SITE_NAME} Blog</description>
    <language>${locale}</language>
    <atom:link href="${DEFAULT_ORIGIN}/api/rss?locale=${locale}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.status(200).send(feed)
}
