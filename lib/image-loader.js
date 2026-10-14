const WIDTHS = [640, 1080, 1920]
// Same path as the original, under `public/optimized` (see bin/image/site.mts).
const SITE_IMAGE = /^\/(avatar|(store|blog)\/.+)\.(jpe?g|png)$/i

export default function imageLoader({src, width}) {
  const w = WIDTHS.find(w => w >= width) || WIDTHS[WIDTHS.length - 1]
  // Some sources are the absolute address of the picture on the site itself.
  const path = src.replace(/^https?:\/\/(www\.)?kikoruiz\.es(?=\/)/, '')

  if (path.startsWith('/pictures/')) {
    // Already one of the pre-made widths, which only needs the right one.
    if (path.includes('/optimized/')) {
      return /-\d+w\.webp$/.test(path)
        ? path.replace(/-\d+w\.webp$/, `-${w}w.webp`)
        : `${path}?w=${width}`
    }

    const name = path.replace('/pictures/', '').replace(/\.[^.]+$/, '')
    return `/pictures/optimized/${name}-${w}w.webp`
  }

  if (SITE_IMAGE.test(path)) {
    return `/optimized${path.replace(/\.[^.]+$/, '')}-${w}w.webp`
  }

  return `${src}?w=${width}`
}
