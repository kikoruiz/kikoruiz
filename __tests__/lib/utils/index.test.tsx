import {describe, it, expect} from 'vitest'
import {getSlug, getTitle, isNew} from 'lib/utils'

describe('utils lib', () => {
  it('gets a slug from an uppercase name', () => {
    expect(getSlug('JOHN BOY')).toBe('john-boy')
  })

  it('gets a slug from a lowercase name', () => {
    expect(getSlug('john boy')).toBe('john-boy')
  })

  it('gets a slug from a name with special characters', () => {
    expect(getSlug('John (Boy)')).toBe('john-boy')
  })

  it('gets a title from an uppercase name', () => {
    expect(getTitle('JOHN BOY')).toBe('John Boy')
  })

  it('gets a title from a lowercase name', () => {
    expect(getTitle('john boy')).toBe('John Boy')
  })

  it('gets a title from a name with special characters', () => {
    expect(getTitle('John (Boy)')).toBe('John Boy')
  })

  it('says an item from 2023-04-23 is new if today was 2023-10-22', () => {
    expect(isNew('2023-04-23', '2023-10-22')).to.be.true
  })

  it('says an item from 2023-04-23 is not new if today was 2023-10-24', () => {
    expect(isNew('2023-04-23', '2023-10-24')).to.be.false
  })
})
