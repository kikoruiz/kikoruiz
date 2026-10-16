type Hsl = [number, number, number]

export interface SectionPalette {
  from: string
  to: string
  title: string
  description: string
}

const BRAND_ORANGE = '#fdba74'
const DEFAULT_PALETTE: SectionPalette = {
  from: '#333333',
  to: '#171717',
  title: BRAND_ORANGE,
  description: '#d4d4d4'
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

// The placeholder of a picture is a handful of rgb stops of it, which is the
// cheapest way to know which colour in it has the most life, with no pixels to
// read. Full saturation in the middle of the lightness range wins.
function getVibrantColor(placeholder: string): Hsl | null {
  const stops = [...placeholder.matchAll(/rgb\((\d+),(\d+),(\d+)\)/g)].map(
    ([, red, green, blue]) => rgbToHsl([+red, +green, +blue])
  )
  const getLife = ([, saturation, lightness]: Hsl) =>
    saturation * (1 - Math.abs(lightness - 0.55))

  return stops.sort((a, b) => getLife(b) - getLife(a))[0] ?? null
}

const MIN_TEXT_CONTRAST = 5
const START_LIGHTNESS = 0.3
const END_LIGHTNESS = 0.12

// The cards run from a lighter tone of the picture down to a dark one, with the
// brand orange for the titles and a tint of the picture for the descriptions.
// The lighter end is the hardest place to read, so it gets only as light as
// both texts still allow, which depends on the hue: a green of the same
// lightness as a brown holds far more light.
export function getSectionPalette(
  averageHex: string,
  placeholder = ''
): SectionPalette {
  const [averageHue, averageSaturation] = rgbToHsl(hexToRgb(averageHex))
  const vibrant = getVibrantColor(placeholder)

  if (!vibrant) return DEFAULT_PALETTE

  const [vibrantHue, vibrantSaturation] = vibrant
  const hue = vibrantSaturation > 0.25 ? vibrantHue : averageHue
  const saturation = Math.max(
    0.28,
    Math.min(0.5, Math.max(averageSaturation, vibrantSaturation) * 1.1)
  )
  const description = hslToHex([hue, Math.min(saturation, 0.35), 0.86])
  let lightness = START_LIGHTNESS

  while (
    lightness > END_LIGHTNESS &&
    [BRAND_ORANGE, description].some(
      text =>
        getContrastRatio(text, hslToHex([hue, saturation, lightness])) <
        MIN_TEXT_CONTRAST
    )
  ) {
    lightness -= 0.01
  }

  return {
    from: hslToHex([hue, saturation, lightness]),
    to: hslToHex([hue, saturation, END_LIGHTNESS]),
    title: BRAND_ORANGE,
    description
  }
}
