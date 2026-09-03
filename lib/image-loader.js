const WIDTHS = [640, 1080, 1920]

export default function imageLoader({src, width}) {
  if (src.startsWith('/pictures/') && !src.includes('/optimized/')) {
    const name = src.replace('/pictures/', '').replace(/\.[^.]+$/, '')
    const w = WIDTHS.find(w => w >= width) || WIDTHS[WIDTHS.length - 1]
    return `/pictures/optimized/${name}-${w}w.webp`
  }
  return `${src}?w=${width}`
}
