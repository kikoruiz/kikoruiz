type Hsl = [number, number, number]

export interface SectionPalette {
  background: string
  accent: string
  title: string
  description: string
  ink: string
}

const BRAND_ORANGE = '#fdba74'
const MIN_TEXT_CONTRAST = 4.5
const MIN_TITLE_CONTRAST = 5
const MIN_INK_CONTRAST = 7
const DEPTH = 0.6
const MIN_LIGHTNESS = 0.08

const DEFAULT_PALETTE: SectionPalette = {
  background: '#262626',
  accent: BRAND_ORANGE,
  title: BRAND_ORANGE,
  description: '#d4d4d4',
  ink: '#262626'
}

function hexToRgb(hex: string) {
  return [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16))
}

function rgbToHsl([red, green, blue]: number[]): Hsl {
  const [r, g, b] = [red, green, blue].map(channel => channel / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const lightness = (max + min) / 2

  if (max === min) return [0, 0, lightness]

  const delta = max - min
  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)
  const hue =
    max === r
      ? (g - b) / delta + (g < b ? 6 : 0)
      : max === g
        ? (b - r) / delta + 2
        : (r - g) / delta + 4

  return [hue * 60, saturation, lightness]
}

function hslToHex([hue, saturation, lightness]: Hsl) {
  const a = saturation * Math.min(lightness, 1 - lightness)
  const channel = (n: number) => {
    const k = (n + hue / 30) % 12
    const value = lightness - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))

    return Math.round(255 * value)
      .toString(16)
      .padStart(2, '0')
  }

  return `#${channel(0)}${channel(8)}${channel(4)}`
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

// The average of a picture is a flat mid tone, which is why it makes a dull
// card. The same hue, deeper, keeps the card tied to its picture and leaves the
// brand orange room to stand out: the title takes it always, the description
// takes a light tint of the hue, and on hover the card turns orange and the
// text goes to the dark of the same hue.
export function getSectionPalette(averageHex: string): SectionPalette {
  if (!/^#[0-9a-f]{6}$/i.test(averageHex)) return DEFAULT_PALETTE

  const [hue, saturation, lightness] = rgbToHsl(hexToRgb(averageHex))
  const deepSaturation = Math.min(0.5, saturation * 1.15)
  let deepLightness = lightness * DEPTH
  let background = hslToHex([hue, deepSaturation, deepLightness])

  // A picture that is light on average still has to leave the orange readable.
  while (
    deepLightness > MIN_LIGHTNESS &&
    getContrastRatio(BRAND_ORANGE, background) < MIN_TITLE_CONTRAST
  ) {
    deepLightness -= 0.02
    background = hslToHex([hue, deepSaturation, deepLightness])
  }

  let descriptionLightness = 0.8
  let description = hslToHex([hue, 0.3, descriptionLightness])

  while (
    descriptionLightness < 1 &&
    getContrastRatio(description, background) < MIN_TEXT_CONTRAST
  ) {
    descriptionLightness += 0.012
    description = hslToHex([hue, 0.3, Math.min(descriptionLightness, 1)])
  }

  let inkLightness = deepLightness

  while (
    inkLightness > 0 &&
    getContrastRatio(
      hslToHex([hue, deepSaturation, inkLightness]),
      BRAND_ORANGE
    ) < MIN_INK_CONTRAST
  ) {
    inkLightness -= 0.02
  }

  return {
    background,
    accent: BRAND_ORANGE,
    title: BRAND_ORANGE,
    description,
    ink: hslToHex([hue, deepSaturation, Math.max(inkLightness, 0)])
  }
}
