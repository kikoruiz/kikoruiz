import {Resend} from 'resend'
import getT from 'next-translate/getT'
import {DEFAULT_ORIGIN, SITE_NAME} from 'config'
import {getSlug} from 'lib/utils'

// Resend needs this to be a verified sender on the domain, so a typo here
// fails every send rather than silently going to spam.
const FROM = `${SITE_NAME} <hola@kikoruiz.es>`

const SHIPPING_ALERTS = {
  'missing-surcharge':
    'va a Canarias, Ceuta o Melilla y ha elegido el envío sin recargo',
  'unneeded-surcharge':
    'va a la Península o Baleares y ha elegido el envío con recargo'
}

// An email to the owner, since nobody else is going to notice that an order
// picked the shipping option of another place.
export async function sendShippingAlert({
  sessionId,
  postalCode,
  mismatch
}: {
  sessionId: string
  postalCode: string
  mismatch: keyof typeof SHIPPING_ALERTS
}) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) throw new Error('There is no RESEND_API_KEY to send with.')

  const text = [
    `El pedido ${sessionId} ${SHIPPING_ALERTS[mismatch]} (código postal ${postalCode}).`,
    '',
    'Revísalo en Stripe y escribe al comprador antes de enviarlo: cóbrale la diferencia o devuélvele el recargo.',
    `https://dashboard.stripe.com/payments?query=${sessionId}`
  ].join('\n')

  return new Resend(apiKey).emails.send({
    from: FROM,
    to: 'hola@kikoruiz.es',
    subject: `kikoruiz.es · Revisar envío del pedido ${sessionId.slice(-8)}`,
    text
  })
}

export async function sendDownloadsEmail({
  to,
  sessionId,
  locale
}: {
  to: string
  sessionId: string
  locale: string
}) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) throw new Error('There is no RESEND_API_KEY to send with.')

  const t = await getT(locale, 'common')
  const tStore = await getT(locale, 'store')
  const origin = process.env.ORIGIN || DEFAULT_ORIGIN
  const localePath = locale === 'es' ? '' : `/${locale}`
  const storeSlug = getSlug(t('sections.store.name'))
  // The same URL the buyer was already sent to, which re-signs its links on
  // every visit, so this one keeps working long after the first hour.
  const url = withPreviewBypass(
    `${origin}${localePath}/${storeSlug}?checkout=success&session_id=${sessionId}`
  )
  const body = tStore('downloads.email.body')
  const notice = tStore('downloads.email.notice')

  // Preview deployments sit behind Vercel's SSO wall, which would otherwise
  // block the buyer's own link and the mail client's logo fetch. The bypass
  // secret only exists as an env var on Preview, so production links never
  // carry it.
  function withPreviewBypass(href: string) {
    const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET

    if (process.env.VERCEL_ENV !== 'preview' || !bypassSecret) return href

    const separator = href.includes('?') ? '&' : '?'

    return `${href}${separator}x-vercel-protection-bypass=${bypassSecret}&x-vercel-set-bypass-cookie=true`
  }

  return new Resend(apiKey).emails.send({
    from: FROM,
    to,
    subject: `kikoruiz.es · ${tStore('downloads.email.subject')}`,
    text: [body, '', url, '', notice].join('\n'),
    html: `
      <p>${body}</p>
      <p><a href="${url}">${url}</a></p>
      <p>${notice}</p>
      <p><img src="${withPreviewBypass(`${origin}/logo.png`)}" alt="kikoruiz.es" width="40" height="40" /></p>
    `
  })
}
