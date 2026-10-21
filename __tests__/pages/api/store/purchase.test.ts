import {beforeEach, describe, expect, it, vi} from 'vitest'
import handler from 'pages/api/store/purchase'
import type {NextApiRequest, NextApiResponse} from 'next'

const {retrieve} = vi.hoisted(() => ({retrieve: vi.fn()}))

vi.mock('stripe', () => ({
  default: class {
    checkout = {sessions: {retrieve}}
  }
}))

function createResponse() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
    end: vi.fn(),
    setHeader: vi.fn()
  }

  res.status.mockReturnValue(res)
  res.json.mockReturnValue(res)

  return res
}

function call(method: string, query: Record<string, string> = {}) {
  const res = createResponse()

  return handler(
    {method, query} as unknown as NextApiRequest,
    res as unknown as NextApiResponse
  ).then(() => res)
}

const paidSession = {
  id: 'cs_1',
  currency: 'eur',
  payment_status: 'paid',
  amount_subtotal: 10500,
  total_details: {
    amount_discount: 1500,
    amount_tax: 1890,
    amount_shipping: 500
  },
  line_items: {
    data: [
      {
        quantity: 2,
        price: {
          lookup_key: 'print_sea_30x45',
          nickname: 'Sea (print)',
          unit_amount: 4500
        }
      },
      {
        quantity: 1,
        price: {
          lookup_key: 'download_sea_web',
          nickname: 'Sea (web download)',
          unit_amount: 1500
        }
      }
    ]
  }
}

describe('/api/store/purchase', () => {
  beforeEach(() => {
    retrieve.mockReset()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('only answers GET', async () => {
    const res = await call('POST', {session_id: 'cs_1'})

    expect(res.status).toHaveBeenCalledWith(405)
    expect(retrieve).not.toHaveBeenCalled()
  })

  it('needs a session', async () => {
    const res = await call('GET')

    expect(res.status).toHaveBeenCalledWith(400)
    expect(retrieve).not.toHaveBeenCalled()
  })

  it('refuses an order that is not paid', async () => {
    retrieve.mockResolvedValue({...paidSession, payment_status: 'unpaid'})

    const res = await call('GET', {session_id: 'cs_1'})

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).not.toHaveBeenCalledWith(
      expect.objectContaining({transaction_id: expect.anything()})
    )
  })

  it('answers with the purchase in GA4 shape and euros', async () => {
    retrieve.mockResolvedValue(paidSession)

    const res = await call('GET', {session_id: 'cs_1'})

    expect(retrieve).toHaveBeenCalledWith('cs_1', {
      expand: ['line_items.data.price']
    })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      transaction_id: 'cs_1',
      currency: 'EUR',
      value: 90,
      tax: 18.9,
      shipping: 5,
      items: [
        {
          item_id: 'print_sea_30x45',
          item_name: 'Sea (print)',
          price: 45,
          quantity: 2
        },
        {
          item_id: 'download_sea_web',
          item_name: 'Sea (web download)',
          price: 15,
          quantity: 1
        }
      ]
    })
  })

  it('is never cached', async () => {
    retrieve.mockResolvedValue(paidSession)

    const res = await call('GET', {session_id: 'cs_1'})

    expect(res.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'private, no-store'
    )
  })

  it('passes on the status of a Stripe error without its message', async () => {
    retrieve.mockRejectedValue(
      Object.assign(new Error('No such session: cs_x'), {statusCode: 404})
    )

    const res = await call('GET', {session_id: 'cs_x'})

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      message: 'This order cannot be read.'
    })
  })
})
