import path from 'node:path'
import fs from 'node:fs/promises'
import {GetPlaiceholderReturn, getPlaiceholder} from 'plaiceholder'

export async function getImagePlaceholder(
  src: string
): Promise<GetPlaiceholderReturn> {
  const buffer = await fs.readFile(path.join('./public', src))

  return getPlaiceholder(buffer, {size: 10})
}
