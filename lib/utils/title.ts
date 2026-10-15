// Advance widths of Inter at weight 900, in em, measured in the browser with
// the font the titles are set in. A word's width is the sum of its letters, so
// a title can be sized to the screen without rendering it first.
const INTER_BLACK_WIDTHS: Record<string, number> = {
  '0': 0.711,
  '1': 0.452,
  '2': 0.646,
  '3': 0.669,
  '4': 0.702,
  '5': 0.646,
  '6': 0.675,
  '7': 0.595,
  '8': 0.679,
  '9': 0.675,
  a: 0.597,
  b: 0.646,
  c: 0.603,
  d: 0.646,
  e: 0.606,
  f: 0.422,
  g: 0.647,
  h: 0.649,
  i: 0.296,
  j: 0.296,
  k: 0.606,
  l: 0.296,
  m: 0.943,
  n: 0.649,
  o: 0.625,
  p: 0.646,
  q: 0.646,
  r: 0.434,
  s: 0.588,
  t: 0.399,
  u: 0.649,
  v: 0.632,
  w: 0.877,
  x: 0.609,
  y: 0.636,
  z: 0.59,
  A: 0.795,
  B: 0.668,
  C: 0.748,
  D: 0.723,
  E: 0.613,
  F: 0.584,
  G: 0.754,
  H: 0.75,
  I: 0.291,
  J: 0.596,
  K: 0.759,
  L: 0.565,
  M: 0.956,
  N: 0.77,
  O: 0.775,
  P: 0.656,
  Q: 0.787,
  R: 0.668,
  S: 0.666,
  T: 0.687,
  U: 0.722,
  V: 0.795,
  W: 1.082,
  X: 0.786,
  Y: 0.775,
  Z: 0.694,
  '\u00e1': 0.597,
  '\u00e0': 0.597,
  '\u00e2': 0.597,
  '\u00e4': 0.597,
  '\u00e3': 0.597,
  '\u00e5': 0.597,
  '\u00e7': 0.603,
  '\u00e9': 0.606,
  '\u00e8': 0.606,
  '\u00ea': 0.606,
  '\u00eb': 0.606,
  '\u00ed': 0.296,
  '\u00ec': 0.296,
  '\u00ee': 0.296,
  '\u00ef': 0.296,
  '\u00f1': 0.649,
  '\u00f3': 0.625,
  '\u00f2': 0.625,
  '\u00f4': 0.625,
  '\u00f6': 0.625,
  '\u00f5': 0.625,
  '\u00fa': 0.649,
  '\u00f9': 0.649,
  '\u00fb': 0.649,
  '\u00fc': 0.649,
  '\u00c1': 0.795,
  '\u00c0': 0.795,
  '\u00c2': 0.795,
  '\u00c4': 0.795,
  '\u00c7': 0.748,
  '\u00c9': 0.613,
  '\u00c8': 0.613,
  '\u00ca': 0.613,
  '\u00cb': 0.613,
  '\u00cd': 0.291,
  '\u00cc': 0.291,
  '\u00ce': 0.291,
  '\u00cf': 0.291,
  '\u00d1': 0.77,
  '\u00d3': 0.775,
  '\u00d2': 0.775,
  '\u00d4': 0.775,
  '\u00d6': 0.775,
  '\u00da': 0.722,
  '\u00d9': 0.722,
  '\u00db': 0.722,
  '\u00dc': 0.722,
  '\u00b7': 0.373,
  '.': 0.373,
  "'": 0.372,
  '\u2019': 0.353,
  '-': 0.475,
  '&': 0.695,
  '+': 0.693,
  '/': 0.412,
  '(': 0.388,
  ')': 0.388
}

// What the widest letter of the table takes, for any character it lacks.
const FALLBACK_WIDTH = 1.1
// Kerning is left out of the sum and the page gutters are not exact either.
const SAFETY_MARGIN = 1.02
const PAGE_GUTTER = '3rem'

export const FIT_TITLE_CLASS_NAME =
  '[--title-size:3.75rem] sm:[--title-size:6rem]'

function getWordWidth(word: string) {
  return [...word].reduce(
    (width, character) =>
      width + (INTER_BLACK_WIDTHS[character] ?? FALLBACK_WIDTH),
    0
  )
}

// Titles share one size, the one of the main sections, and only the ones with a
// word that would not fit the screen give some of it up. A word cannot be
// broken, so the whole title is sized by its widest.
export function getFitTitleStyle(title: string) {
  const widestWord = Math.max(...title.split(/\s+/).map(getWordWidth))

  return {
    fontSize: `min(var(--title-size), calc((100vw - ${PAGE_GUTTER}) / ${(widestWord * SAFETY_MARGIN).toFixed(3)}))`
  }
}
