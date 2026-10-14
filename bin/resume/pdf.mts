#!/usr/bin/env node
import path from 'node:path'
import {spawn} from 'node:child_process'
import {chromium} from 'playwright'

// One tall page, 1400 css px wide, like the exports that were made by hand.
const WIDTH = 1400
const PORT = 3123

async function isUp(origin: string) {
  try {
    await fetch(origin)
    return true
  } catch {
    return false
  }
}

// Uses the site that is already running, or starts a dev server just for the
// time it takes to print the pages.
let origin = process.env.ORIGIN ?? 'http://localhost:3000'
let server: ReturnType<typeof spawn> | undefined

if (!(await isUp(origin))) {
  origin = `http://localhost:${PORT}`
  console.log(`No site at the default address, starting one on ${origin}`)
  server = spawn('npx', ['next', 'dev', '--webpack', '--port', String(PORT)], {
    stdio: 'ignore'
  })

  for (let attempt = 0; attempt < 60 && !(await isUp(origin)); attempt++) {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  if (!(await isUp(origin))) {
    server.kill()
    throw new Error('The dev server did not start.')
  }
}
const documents = [
  {url: '/sobre-mi/curriculum', file: 'kikoruiz-es-curriculum.pdf'},
  {url: '/ca/sobre-mi/curriculum', file: 'kikoruiz-ca-curriculum.pdf'},
  {url: '/en/about-me/resume', file: 'kikoruiz-en-resume.pdf'}
]

const browser = await chromium.launch()

for (const {url, file} of documents) {
  const page = await browser.newPage({viewport: {width: WIDTH, height: 1000}})
  await page.emulateMedia({media: 'screen'})
  await page.goto(`${origin}${url}?print=1`, {waitUntil: 'networkidle'})
  await page.addStyleTag({content: 'nextjs-portal{display:none!important}'})

  // Let the entrance animations finish so nothing is captured half faded.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    window.scrollTo(0, 0)
    await Promise.all(document.getAnimations().map(a => a.finished.catch(() => {})))
  })
  await page.waitForTimeout(1500)

  const height = await page.evaluate(() =>
    Math.ceil(document.documentElement.scrollHeight)
  )

  await page.pdf({
    path: path.join(process.cwd(), 'public', 'documents', file),
    width: `${WIDTH}px`,
    height: `${height + 1}px`,
    printBackground: true,
    pageRanges: '1'
  })
  console.log(`${file}: ${WIDTH}x${height}px`)
  await page.close()
}

await browser.close()
server?.kill()
