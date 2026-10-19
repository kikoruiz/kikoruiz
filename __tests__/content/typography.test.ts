import fs from 'node:fs'
import {globSync} from 'glob'
import {describe, expect, it} from 'vitest'

// Spanish and Catalan put a space between a number and its percent sign, and
// it has to be a no-break one so the two never end up on different lines.
const files = globSync([
  'data/posts/{es,ca}/*.md',
  'data/pages/**/{es,ca}.md',
  'locales/{es,ca}/*.json'
])

describe('typography of the Spanish and Catalan texts', () => {
  it('has texts to check', () => {
    expect(files.length).toBeGreaterThan(10)
  })

  it.each(files)(
    'keeps the number and the percent sign of %s together',
    file => {
      const text = fs.readFileSync(file, 'utf8')

      expect(text.match(/\d %/g) ?? []).toEqual([])
    }
  )
})
