import type {NextApiRequest, NextApiResponse} from 'next'

// The holder's tax ID and address are required to be public, but they do not
// have to be easy to harvest. They live in the environment instead of the
// repository or the page markup, so they are in neither the committed files,
// the prerendered HTML nor the client bundle, and only reach the browser when
// the legal notice asks for them.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const {
    LEGAL_HOLDER_NAME: name,
    LEGAL_HOLDER_NIF: nif,
    LEGAL_HOLDER_ADDRESS: address
  } = process.env

  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')

  if (!name || !nif || !address) {
    return res.status(404).json({message: 'The holder is not configured.'})
  }

  // An env value is a single line wherever it is typed, so a line break in the
  // address is written as a literal "\n", which is turned into a real one here.
  // A value entered over several lines already carries real breaks and is kept.
  res.status(200).json({name, nif, address: address.replace(/\\n/g, '\n')})
}
