export interface SectionPalette {
  background: string
  accent: string
  title: string
  description: string
  ink: string
}

const BRAND_ORANGE = '#fdba74'
const MIN_TEXT_CONTRAST = 4.5
const MIN_INK_CONTRAST = 7
// Each step is a little stronger than the one before: the first that reads on
// the background is the one used, so nothing is brighter than it needs to be.
const LIGHT_TITLES = ['#e5e5e5', '#efefef', '#f7f7f7', '#ffffff']
const LIGHT_DESCRIPTIONS = [
  '#cdcdcd',
  '#d9d9d9',
  '#e6e6e6',
  '#f2f2f2',
  '#ffffff'
]
const DARK_TITLES = ['#3a3a3a', '#2a2a2a', '#1c1c1c', '#0a0a0a']
const DARK_DESCRIPTIONS = [
  '#454545',
  '#333333',
  '#242424',
  '#1c1c1c',
  '#0a0a0a'
]

const DEFAULT_PALETTE: SectionPalette = {
  background: '#262626',
  accent: BRAND_ORANGE,
  title: BRAND_ORANGE,
  description: '#d6a77a',
  ink: '#262626'
}

function hexToRgb(hex: string) {
  return [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16))
}

function rgbToHex(channels: number[]) {
  return `#${channels
    .map(channel => Math.round(channel).toString(16).padStart(2, '0'))
    .join('')}`
}

function getLuminance(hex: string) {
  const [red, green, blue] = hexToRgb(hex)
    .map(channel => channel / 255)
    .map(channel =>
      channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

export function getContrastRatio(foreground: string, background: string) {
  const [lighter, darker] = [
    getLuminance(foreground),
    getLuminance(background)
  ].sort((a, b) => b - a)

  return (lighter + 0.05) / (darker + 0.05)
}

function mix(color: string, other: string, amount: number) {
  const [from, to] = [hexToRgb(color), hexToRgb(other)]

  return rgbToHex(
    from.map((channel, i) => channel + (to[i] - channel) * amount)
  )
}

function pickReadable(candidates: string[], background: string) {
  return (
    candidates.find(
      candidate => getContrastRatio(candidate, background) >= MIN_TEXT_CONTRAST
    ) ?? candidates[candidates.length - 1]
  )
}

// The text of a card over the average colour of a picture, which is a flat mid
// tone. The brand orange goes wherever it reads, with a description a notch
// quieter than the title; where it does not, the text is light or dark by
// whichever has more contrast, and as soft as the background allows.
export function getSectionPalette(averageHex: string): SectionPalette {
  if (!/^#[0-9a-f]{6}$/i.test(averageHex)) return DEFAULT_PALETTE

  const orangeContrast = getContrastRatio(BRAND_ORANGE, averageHex)
  const usesOrange = orangeContrast >= MIN_TEXT_CONTRAST
  const usesLight =
    getContrastRatio('#ffffff', averageHex) >=
    getContrastRatio('#0a0a0a', averageHex)
  // As quiet as the background lets it be, down to none.
  const quietOrange =
    [0.22, 0.16, 0.1, 0.05]
      .map(amount => mix(BRAND_ORANGE, averageHex, amount))
      .find(
        color => getContrastRatio(color, averageHex) >= MIN_TEXT_CONTRAST
      ) ?? BRAND_ORANGE
  let ink = averageHex

  // On hover the card turns orange, so its text darkens until it reads on it.
  for (let step = 0; step < 20; step++) {
    if (getContrastRatio(ink, BRAND_ORANGE) >= MIN_INK_CONTRAST) break

    ink = mix(ink, '#000000', 0.15)
  }

  return {
    background: averageHex,
    accent: BRAND_ORANGE,
    title: usesOrange
      ? BRAND_ORANGE
      : pickReadable(usesLight ? LIGHT_TITLES : DARK_TITLES, averageHex),
    description: usesOrange
      ? quietOrange
      : pickReadable(
          usesLight ? LIGHT_DESCRIPTIONS : DARK_DESCRIPTIONS,
          averageHex
        ),
    ink
  }
}
