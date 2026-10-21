import {describe, expect, it} from 'vitest'
import {flushSync} from 'react-dom'
import {createRoot} from 'react-dom/client'
import {renderToStaticMarkup} from 'react-dom/server'
import Article from 'components/article'
import {LayoutContext} from 'contexts/Layout'

function render(content: string) {
  return renderToStaticMarkup(<Article content={content} />)
}

function getLinks(html: string) {
  return [...html.matchAll(/<a ([^>]*)>/g)].map(([, attributes]) => ({
    href: attributes.match(/href="([^"]*)"/)?.[1],
    target: attributes.match(/target="([^"]*)"/)?.[1]
  }))
}

describe('Article', () => {
  it('opens external links in a new tab and internal ones in the same', () => {
    const html = render(
      'Mira [mi tienda](/tienda/impresiones) y [esto](https://example.com/x).'
    )

    expect(getLinks(html)).toEqual([
      {href: '/tienda/impresiones', target: '_self'},
      {href: 'https://example.com/x', target: '_blank'}
    ])
  })

  it('handles a paragraph made only of a link', () => {
    const html = render('[solo enlace](/galeria)')

    expect(getLinks(html)).toEqual([{href: '/galeria', target: '_self'}])
    expect(html).toContain('>solo enlace</a></p>')
  })

  it('treats links in lists the same as in paragraphs', () => {
    const html = render(
      '- [interno](/blog)\n- texto con [externo](https://example.com)'
    )

    expect(getLinks(html)).toEqual([
      {href: '/blog', target: '_self'},
      {href: 'https://example.com', target: '_blank'}
    ])
    expect(html).toContain('<li>texto con <a ')
  })

  it('keeps plain text and emphasis untouched', () => {
    const html = render('Un **texto** normal.')

    expect(html).toContain('<p>Un <strong>texto</strong> normal.</p>')
  })

  it('gives every second level heading an id that matches its step', () => {
    const html = render('## Calibrar el **monitor**')

    expect(html).toContain('id="calibrar-el-monitor"')
  })
})

describe('Article headings', () => {
  it('keep their DOM node, and gain the header spacing, when the header height arrives', () => {
    const container = document.createElement('div')
    const root = createRoot(container)
    // `flushSync` commits right away and, unlike `act`, exists in every build
    // of React, the production one included.
    const renderWithHeader = (headerHeight?: number) =>
      flushSync(() => {
        root.render(
          <LayoutContext.Provider
            value={
              {
                layout: headerHeight ? {headerHeight} : null,
                setLayout: () => {}
              } as never
            }
          >
            <Article content="## Calibrar el monitor" />
          </LayoutContext.Provider>
        )
      })

    renderWithHeader()

    const heading = container.querySelector('h2')

    expect(heading.className).toContain('scroll-mt-48')
    expect(heading.style.scrollMarginTop).toBe('')

    renderWithHeader(146)

    expect(container.querySelector('h2')).toBe(heading)
    expect(heading.style.scrollMarginTop).toBe('calc(146px + 1.5rem)')

    flushSync(() => root.unmount())
  })
})
