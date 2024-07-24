import {test, expect} from '@playwright/test'

test('Home Page', async ({page}) => {
  const targetUrl = process.env.ORIGIN || 'https://kikoruiz.vercel.app'
  const response = await page.goto(targetUrl)

  expect(response?.status()).toBeLessThan(400)
  await expect(page).toHaveTitle(/Kiko Ruiz/)
})
