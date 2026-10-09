import {Resend} from 'resend'
import getT from 'next-translate/getT'
import {DEFAULT_ORIGIN, SITE_NAME} from 'config'
import {getSlug} from 'lib/utils'

// Resend needs this to be a verified sender on the domain, so a typo here
// fails every send rather than silently going to spam.
const FROM = `${SITE_NAME} <hola@kikoruiz.es>`

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
  const url = `${origin}${localePath}/${storeSlug}?checkout=success&session_id=${sessionId}`

  return new Resend(apiKey).emails.send({
    from: FROM,
    to,
    subject: tStore('downloads.email.subject'),
    text: [
      tStore('downloads.email.body'),
      '',
      url,
      '',
      tStore('downloads.email.notice')
    ].join('\n')
  })
}
