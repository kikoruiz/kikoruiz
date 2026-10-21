import {describe, expect, it, vi} from 'vitest'
import {renderToStaticMarkup} from 'react-dom/server'
import PostCard from 'components/post-card'

vi.mock('assets/icons/chevron-right.svg', () => ({default: () => null}))
vi.mock('next/router', () => ({useRouter: () => ({locale: 'es'})}))
vi.mock('next-translate/useTranslation', () => ({
  default: () => ({t: (key: string) => key})
}))

const today = new Date().toISOString().slice(0, 10)
const longAgo = '2023-04-23'

function render(props: Partial<Parameters<typeof PostCard>[0]> = {}) {
  return renderToStaticMarkup(
    <PostCard
      title="Un artículo"
      href="/blog/un-articulo"
      createdAt={longAgo}
      readingTime={3}
      excerpt="Resumen"
      tags="photography, personal"
      highlightedImage={undefined}
      isDraft={false}
      {...props}
    />
  )
}

describe('PostCard label', () => {
  it('marks a tutorial in the list, even when it is not the latest', () => {
    const html = render({tags: 'photography, tutorial'})

    expect(html).toContain('blog.tags.tutorial')
    expect(html).toContain('border-orange-600/60')
  })

  it('tells the latest tutorial apart when it is new', () => {
    const html = render({
      tags: 'photography, tutorial',
      isLatest: true,
      createdAt: today
    })

    expect(html).toContain('blog.post.latest-tutorial')
  })

  it('falls back to the plain label once the latest tutorial is old', () => {
    const html = render({tags: 'photography, tutorial', isLatest: true})

    expect(html).toContain('blog.tags.tutorial')
    expect(html).not.toContain('blog.post.latest-tutorial')
  })

  it('does not mark an ordinary post in the list', () => {
    const html = render()

    expect(html).not.toContain('blog.tags.tutorial')
    expect(html).not.toContain('blog.post.latest-post')
  })

  it('marks the latest new post', () => {
    const html = render({isLatest: true, createdAt: today})

    expect(html).toContain('blog.post.latest-post')
    expect(html).toContain('border-neutral-600/30')
  })

  it('reads the tutorial from the tags, not from the title', () => {
    expect(render({title: 'Sin prefijo', tags: 'tutorial'})).toContain(
      'blog.tags.tutorial'
    )
    expect(
      render({title: 'Tutorial: falso', tags: 'photography'})
    ).not.toContain('blog.tags.tutorial')
  })
})
