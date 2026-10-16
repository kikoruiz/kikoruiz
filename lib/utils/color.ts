type Hsl = [number, number, number]

export interface SectionPalette {
  background: string
  title: string
  description: string
}

const DEFAULT_PALETTE: SectionPalette = {
  background: '#262626',
  title: '#fdba74',
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

// The average of a picture is a flat mid tone, so instead of painting with it
// the cards take its hue, darkened enough for light text to read on it, and the
// title borrows the liveliest colour of the picture itself.
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

  return {
    background: hslToHex([hue, saturation, 0.15]),
    title: hslToHex([vibrantHue, Math.max(0.55, vibrantSaturation), 0.68]),
    description: hslToHex([hue, Math.min(saturation, 0.35), 0.74])
  }
}
