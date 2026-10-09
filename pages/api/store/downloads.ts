import type {NextApiRequest, NextApiResponse} from 'next'
import Stripe from 'stripe'
import {getDownloadKey, getSignedDownloadUrl} from 'lib/store/r2'
import {getSlug} from 'lib/utils'
import {DOWNLOAD_TYPE} from 'config/store'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') return res.status(405).end()

  const {session_id: sessionId} = req.query as {session_id: string}

  if (!sessionId) return res.status(400).json({message: 'Missing session.'})

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price']
    })

    // The session id is the only credential here, so a paid status is what
    // turns it into the right to download anything.
    if (session.payment_status !== 'paid') {
      return res.status(403).json({message: 'This order is not paid.'})
    }

    const items = session.line_items.data.filter(
      ({price}) => price.metadata.type === DOWNLOAD_TYPE
    )
    const downloads = await Promise.all(
      items.map(async ({price}) => {
        const {
          picture_id: pictureId,
          tier,
          longest_side: longestSide
        } = price.metadata
        const fileName = `${getSlug(price.nickname)}.jpg`

        return {
          id: price.lookup_key,
          // The nickname is written as "Title (tier download)", and only the
          // title is worth showing next to an already localized tier.
          name: price.nickname.replace(/\s*\([^)]*\)$/, ''),
          tier,
          url: await getSignedDownloadUrl({
            key: getDownloadKey({
              pictureId,
              longestSide:
                longestSide === 'original' ? null : Number(longestSide)
            }),
            fileName
          })
        }
      })
    )

    res.setHeader('Cache-Control', 'private, no-store')
    res.status(200).json({downloads})
  } catch (error) {
    // Stripe spells out which resource it could not find, and that is both
    // unlocalized and more than the buyer needs to know.
    console.error(error)

    res.status(error.statusCode ?? 500).json({message: 'This order cannot be read.'})
  }
}
