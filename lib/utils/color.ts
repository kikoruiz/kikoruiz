const MIN_CONTRAST = 4.5

function getLuminance(hex: string) {
  const [red, green, blue] = [1, 3, 5]
    .map(start => parseInt(hex.slice(start, start + 2), 16) / 255)
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

// The brand orange is kept wherever the background lets it be read, and only
// where it cannot it gives way to white or near black, whichever has more
// contrast. The background is the average colour of a picture, so it is not
// known until the page is.
export function getReadableTextClassName(background: string) {
  if (getContrastRatio('#fdba74', background) >= MIN_CONTRAST) {
    return 'text-orange-300'
  }

  return getContrastRatio('#ffffff', background) >=
    getContrastRatio('#171717', background)
    ? 'text-white'
    : 'text-neutral-900'
}
