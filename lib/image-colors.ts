import averageColors from 'data/image/average-colors.json'
import {ImageAverageColor} from 'types/gallery'

// The colour of each picture is worked out by `make save_colors` and kept as
// data, because the pages that need it are regenerated while live, in a
// function that has no `public` folder to read the picture from. It is not in
// `lib/utils` on purpose: that one reaches the browser, and this is data only
// the server needs.
export function getAverageColor(src: string): ImageAverageColor {
  const averageColor = (averageColors as Record<string, ImageAverageColor>)[src]

  if (!averageColor) {
    throw new Error(
      `There is no average colour for ${src}. Run make save_colors.`
    )
  }

  return averageColor
}
