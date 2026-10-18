import {describe, expect, it} from 'vitest'
import {renderToStaticMarkup} from 'react-dom/server'
import PostTitle from 'components/post-title'

function render(title: string) {
  return renderToStaticMarkup(<PostTitle title={title} />)
}

describe('PostTitle', () => {
  it('starts the title after the prefix with a capital', () => {
    const html = render('Tutorial: del monitor al papel')

    expect(html).toMatch(/Tutorial:<\/span>\s+Del monitor al papel/)
  })

  it('starts a title without a prefix with a capital', () => {
    expect(render('el mar que me enseñó a mirar')).toBe(
      'El mar que me enseñó a mirar'
    )
  })

  it('capitalizes letters outside of ascii', () => {
    expect(render('ñandú')).toBe('Ñandú')
  })

  it('leaves a title that already has a capital as it is', () => {
    expect(render('Tutorial: The Rocky Window')).toMatch(
      /Tutorial:<\/span>\s+The Rocky Window/
    )
  })
})
