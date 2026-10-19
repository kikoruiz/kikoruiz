import fs from 'node:fs'
import {globSync} from 'glob'
import {describe, expect, it} from 'vitest'

// A percent sign is written right after its number, in every language, so the
// two can never end up on different lines.
const files = globSync([
  'data/posts/*/*.md',
  'data/pages/**/*.md',
  'locales/*/*.json'
])

describe('typography of the texts', () => {
  it('has texts to check', () => {
    expect(files.length).toBeGreaterThan(10)
  })

  it.each(files)(
    'keeps the number and the percent sign of %s together',
    file => {
      const text = fs.readFileSync(file, 'utf8')

      expect(text.match(/\d[\s\u00a0\u202f]%/g) ?? []).toEqual([])
    }
  )
})
