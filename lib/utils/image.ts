import path from 'node:path'
import fs from 'node:fs/promises'
import {GetPlaiceholderReturn, getPlaiceholder} from 'plaiceholder'

export async function getImagePlaceholder(
  src: string
): Promise<GetPlaiceholderReturn> {
  console.log({src})

  const buffer = await fs.readFile(path.join('./public', src))

  return getPlaiceholder(buffer, {size: 10})
}

// import {GetPlaiceholderReturn} from 'plaiceholder'

// export async function getImagePlaceholder(
//   src: string
// ): Promise<{css: GetPlaiceholderReturn['css']}> {
//   return {
//     console.log({css})

//     css: {
//       backgroundImage:
//         'linear-gradient(90deg, rgb(87,55,83) 33.33333333333333%,rgb(139,92,117) 33.33333333333333% 66.66666666666666%,rgb(200,120,121) 66.66666666666666% 100%),linear-gradient(90deg, rgb(140,72,72) 33.33333333333333%,rgb(209,129,101) 33.33333333333333% 66.66666666666666%,rgb(218,144,105) 66.66666666666666% 100%),linear-gradient(90deg, rgb(77,50,66) 33.33333333333333%,rgb(113,65,72) 33.33333333333333% 66.66666666666666%,rgb(128,74,84) 66.66666666666666% 100%),linear-gradient(90deg, rgb(41,20,26) 33.33333333333333%,rgb(54,34,43) 33.33333333333333% 66.66666666666666%,rgb(84,50,61) 66.66666666666666% 100%)',
//       backgroundPosition:
//         '0 0 ,0 33.33333333333333%,0 66.66666666666666%,0 100%',
//       backgroundSize: '100% 25%',
//       backgroundRepeat: 'no-repeat'
//     }
//   }
// }
