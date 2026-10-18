import {describe, expect, it, vi} from 'vitest'
import {renderToStaticMarkup} from 'react-dom/server'
import BlogTag from 'components/blog-tag'

vi.mock('next-translate/useTranslation', () => ({
  default: () => ({t: (key: string) => key})
}))

function render(id: string) {
  return renderToStaticMarkup(
    <BlogTag id={id} slug={id} name={id} href={`/blog/tags/${id}`} />
  )
}

describe('BlogTag', () => {
  it.each([
    ['photography', 'red'],
    ['personal', 'blue'],
    ['development', 'green'],
    ['tutorial', 'orange']
  ])('paints %s in %s', (id, color) => {
    const html = render(id)

    expect(html).toContain(`bg-${color}-400/60`)
    expect(html).toContain(`border-${color}-900`)
  })
})
