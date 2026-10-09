import {test, expect} from '@playwright/test'

const targetUrl = process.env.ORIGIN || 'https://kikoruiz.vercel.app'

test('Prints Page', async ({page}) => {
  const response = await page.goto(`${targetUrl}/tienda/impresiones`)

  expect(response?.status()).toBeLessThan(400)

  await page.getByRole('button', {name: 'Añadir al carrito'}).first().click()

  await expect(page.getByText('Subtotal')).toBeVisible()
})

test('Downloads Page', async ({page}) => {
  const response = await page.goto(`${targetUrl}/tienda/descargas`)

  expect(response?.status()).toBeLessThan(400)

  await page.getByRole('button', {name: 'Añadir al carrito'}).first().click()

  await expect(page.getByText('Subtotal')).toBeVisible()
})
