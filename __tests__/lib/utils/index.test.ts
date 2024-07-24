import {describe, it, expect} from 'vitest'
import {getAbsoluteUrl, getSeason, getSlug, getTitle, isNew} from 'lib/utils'

describe('utils lib', () => {
  // Tests for `getSlug`.

  it('gets a slug from an uppercase name', () => {
    expect(getSlug('JOHN BOY')).toBe('john-boy')
  })

  it('gets a slug from a lowercase name', () => {
    expect(getSlug('john boy')).toBe('john-boy')
  })

  it('gets a slug from a name with special characters', () => {
    expect(getSlug('John (Boy)')).toBe('john-boy')
  })

  // Tests for `getTitle`.

  it('gets a title from an uppercase name', () => {
    expect(getTitle('JOHN BOY')).toBe('John Boy')
  })

  it('gets a title from a lowercase name', () => {
    expect(getTitle('john boy')).toBe('John Boy')
  })

  it('gets a title from a name with special characters', () => {
    expect(getTitle('John (Boy)')).toBe('John Boy')
  })

  // Tests for `isNew`.

  it('says an item from 2023-04-23 is new if today was 2023-10-22', () => {
    expect(isNew('2023-04-23', '2023-10-22')).to.be.true
  })

  it('says an item from 2023-04-23 is not new if today was 2023-10-24', () => {
    expect(isNew('2023-04-23', '2023-10-24')).to.be.false
  })

  // Tests for `getSeason`.

  it('checks it is winter season based on a selected day from 2023', () => {
    expect(getSeason(new Date('2023-12-22'))).toBe('winter')
  })

  it('checks it is spring season based on a selected day from 2024', () => {
    expect(getSeason(new Date('2024-03-20'))).toBe('spring')
  })

  it('checks it is summer season based on a selected day from 2024', () => {
    expect(getSeason(new Date('2024-06-21'))).toBe('summer')
  })

  it('checks it is autumn season based on a selected day from 2024', () => {
    expect(getSeason(new Date('2024-09-22'))).toBe('autumn')
  })

  it('checks it is winter season based on a selected day from 2024', () => {
    expect(getSeason(new Date('2024-12-21'))).toBe('winter')
  })

  // Tests for `getAbsoluteUrl`.

  it('gets the absolute url for a path', () => {
    expect(getAbsoluteUrl('foo.bar')).toBe('http://test/foo.bar')
  })

  it('gets the absolute url for a path starting with a trailing slash', () => {
    expect(getAbsoluteUrl('/foo.bar')).toBe('http://test/foo.bar')
  })
})
