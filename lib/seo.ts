const MAX_TITLE_LENGTH = 60
const MAX_DESCRIPTION_LENGTH = 155
const MIN_DESCRIPTION_LENGTH = 90

// Google shows about sixty characters of a title, so the place is only added
// when it fits, and the name of the picture is never the part that is cut.
export function getPictureTitle({
  name,
  city,
  printLabel,
  siteName
}: {
  name: string
  city?: string
  printLabel?: string
  siteName: string
}) {
  const build = (parts: string[]) => `${parts.join(' · ')} | ${siteName}`
  const extras = [city, printLabel].filter(Boolean)
  const withAll = build([name, ...extras])

  if (withAll.length <= MAX_TITLE_LENGTH) return withAll

  // The print is what the title is for when there is one, so it outlives the
  // city.
  const withPrint = build([name, ...(printLabel ? [printLabel] : [])])

  if (withPrint.length <= MAX_TITLE_LENGTH) return withPrint

  return build([name])
}

function cut(text: string, max: number) {
  if (text.length <= max) return text

  const slice = text.slice(0, max)
  const lastSentence = Math.max(
    slice.lastIndexOf('. '),
    slice.lastIndexOf('! '),
    slice.lastIndexOf('? ')
  )

  if (lastSentence >= max * 0.6) return slice.slice(0, lastSentence + 1)

  return `${slice.slice(0, slice.lastIndexOf(' ')).replace(/[,;:\s]+$/, '')}…`
}

// The description written for the picture goes first and is trimmed to what a
// result shows. When it is short the facts of the picture fill it up, and when
// the picture is for sale that is said if there is room.
export function getPictureDescription({
  description,
  fallback,
  facts = [],
  printNote
}: {
  description?: string
  fallback: string
  facts?: string[]
  printNote?: string
}) {
  let text = cut(
    (description ?? fallback).replaceAll(/\s+/g, ' ').trim(),
    MAX_DESCRIPTION_LENGTH
  )

  for (const fact of facts.filter(Boolean)) {
    if (text.length >= MIN_DESCRIPTION_LENGTH) break

    const next = `${text.replace(/\.$/, '')}. ${fact}.`

    if (next.length <= MAX_DESCRIPTION_LENGTH) text = next
  }

  if (printNote && `${text} ${printNote}`.length <= MAX_DESCRIPTION_LENGTH) {
    text = `${text} ${printNote}`
  }

  return text
}
