import {getPlaiceholder} from 'plaiceholder'
import {getAverageColor} from 'lib/utils'
import {HeroImages} from 'types'

const HERO_DEFAULT_DATA = {
  alt: 'Kiko Ruiz Photography',
  sizes: '100vw'
}
const HERO_IMAGES = {
  mobile: '/pictures/2021-12-10_0008.jpg',
  tablet: '/pictures/2021-10-12_0264.jpg',
  desktop: '/pictures/2021-10-23_0052.jpg'
}

export async function getHeroImages(): Promise<HeroImages> {
  return await Object.keys(HERO_IMAGES).reduce(async (acc, device) => {
    const src = HERO_IMAGES[device]
    const {css} = await getPlaiceholder(src)
    const averageColor = await getAverageColor(src)

    return {
      ...(await acc),
      [device]: {
        ...HERO_DEFAULT_DATA,
        src,
        css,
        averageColor
      }
    }
  }, Promise.resolve({} as HeroImages))
}
