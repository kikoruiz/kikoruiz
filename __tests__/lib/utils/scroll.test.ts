import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import {getScrollTopBelowHeader} from 'lib/utils/scroll'

function rect(top: number, bottom = top) {
  return {top, bottom} as DOMRect
}

describe('getScrollTopBelowHeader', () => {
  beforeEach(() => {
    document.body.innerHTML = '<header></header><h2 id="step"></h2>'
    Object.defineProperty(window, 'scrollY', {value: 500, configurable: true})
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  function place({header, heading}: {header?: DOMRect; heading: DOMRect}) {
    if (header) {
      document.querySelector('header').getBoundingClientRect = () => header
    } else {
      document.querySelector('header').remove()
    }
    document.getElementById('step').getBoundingClientRect = () => heading
  }

  it('leaves the gap between the header and the element', () => {
    place({header: rect(0, 146), heading: rect(900)})

    expect(getScrollTopBelowHeader(document.getElementById('step'), 36)).toBe(
      500 + 900 - 146 - 36
    )
  })

  it('follows the header when it is taller or shorter', () => {
    place({header: rect(0, 176), heading: rect(900)})

    expect(getScrollTopBelowHeader(document.getElementById('step'), 36)).toBe(
      500 + 900 - 176 - 36
    )
  })

  it('works without a header', () => {
    place({heading: rect(900)})

    expect(getScrollTopBelowHeader(document.getElementById('step'), 36)).toBe(
      500 + 900 - 36
    )
  })

  it('never asks for a negative position', () => {
    place({header: rect(0, 146), heading: rect(-400)})

    expect(getScrollTopBelowHeader(document.getElementById('step'))).toBe(0)
  })
})
